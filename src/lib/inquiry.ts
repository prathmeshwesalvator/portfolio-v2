/**
 * Project inquiry — pure helpers behind the Freelance inquiry form (no React).
 *
 * Security notes (OWASP):
 *  - Every value is normalised (control characters stripped, whitespace
 *    trimmed, lengths clamped) before it is validated, rendered or delivered.
 *  - Output is plain text only: mailto: parameters are percent-encoded and the
 *    EmailJS payload is JSON. Nothing here is ever interpreted as HTML.
 *  - Nothing is logged or persisted. Data leaves the browser only through the
 *    delivery channel the visitor triggers (their email app, or EmailJS).
 */
import { budgetRanges, inquiryLimits, projectTypes } from "@/data/inquiry";
import { profile } from "@/data/profile";
import type { SelectOption } from "@/types";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface InquiryValues {
  name: string;
  email: string;
  /** One of `projectTypes[].value`. */
  projectType: string;
  /** "" (not specified) or one of `budgetRanges[].value`. */
  budget: string;
  description: string;
  /** Honeypot. Hidden from people, so any value signals an automated submission. */
  website: string;
}

export type InquiryField = keyof InquiryValues;
export type InquiryErrors = Partial<Record<InquiryField, string>>;
export type InquiryDelivery = "emailjs" | "mailto";
export type InquiryFailureReason = "network" | "rejected";
export type InquirySendResult = { ok: true } | { ok: false; reason: InquiryFailureReason };

export const emptyInquiry: Readonly<InquiryValues> = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  description: "",
  website: "",
};

/** Visible fields in on-screen order (drives the error summary). */
export const inquiryFieldOrder = ["name", "email", "projectType", "budget", "description"] as const satisfies readonly InquiryField[];

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const NAME_MIN = 2;
/** Option values are short slugs; anything longer cannot be one of ours. */
const OPTION_MAX = 64;
const HONEYPOT_MAX = 256;
/** Pragmatic check, not full RFC 5322. Only ever run on input ≤ emailMax characters. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const SEND_TIMEOUT_MS = 15_000;

const TAB = 0x09;
const LINE_FEED = 0x0a;
const NOT_SPECIFIED = "Not specified";

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                */
/* -------------------------------------------------------------------------- */

/** 2000 → "2,000". Locale-independent, so server and client always agree. */
export function formatCount(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function findOption(options: readonly SelectOption[], value: string): SelectOption | undefined {
  return options.find((option) => option.value === value);
}

export function getProjectTypeLabel(value: string): string {
  return findOption(projectTypes, value)?.label ?? NOT_SPECIFIED;
}

/** The empty value ("Prefer not to say") reads as "Not specified" in the email. */
export function getBudgetLabel(value: string): string {
  return value ? (findOption(budgetRanges, value)?.label ?? NOT_SPECIFIED) : NOT_SPECIFIED;
}

/* -------------------------------------------------------------------------- */
/*  Normalisation                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Drops C0/C1 control characters (except the code points in `keep`) and the
 * invisible bidi override/isolate marks that can disguise text ("Trojan
 * Source"). Lone surrogates become U+FFFD so `encodeURIComponent` never throws.
 * Iterates by code point (for…of), so valid surrogate pairs (emoji) survive.
 */
function stripUnsafeCharacters(value: string, keep: readonly number[] = []): string {
  let result = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const isControl = code <= 0x1f || (code >= 0x7f && code <= 0x9f);
    const isBidiControl = (code >= 0x202a && code <= 0x202e) || (code >= 0x2066 && code <= 0x2069);
    if (isBidiControl || (isControl && !keep.includes(code))) continue;
    result += code >= 0xd800 && code <= 0xdfff ? "�" : char;
  }
  return result;
}

/** Truncates to `max` UTF-16 units (what `maxLength` counts) without splitting a surrogate pair. */
function clampLength(value: string, max: number): string {
  if (value.length <= max) return value;
  const lastCode = value.charCodeAt(max - 1);
  const end = lastCode >= 0xd800 && lastCode <= 0xdbff ? max - 1 : max;
  return value.slice(0, end);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Single-line fields lose every control character, including CR, LF and TAB. */
function singleLine(value: unknown, max: number, { collapseWhitespace = false } = {}): string {
  let text = asText(value);
  // Collapse first so line breaks and tabs inside a name become single spaces.
  if (collapseWhitespace) text = text.replace(/\s+/g, " ");
  return clampLength(stripUnsafeCharacters(text).trim(), max).trimEnd();
}

/** Multi-line text keeps LF and TAB; CRLF / CR line endings become LF. */
function multiLine(value: unknown, max: number): string {
  const text = asText(value).replace(/\r\n?/g, "\n");
  return clampLength(stripUnsafeCharacters(text, [TAB, LINE_FEED]).trim(), max).trimEnd();
}

/** Trims, strips control characters and clamps every field. Idempotent. */
export function normaliseInquiry(values: InquiryValues): InquiryValues {
  const { nameMax, emailMax, descriptionMax } = inquiryLimits;
  return {
    name: singleLine(values.name, nameMax, { collapseWhitespace: true }),
    email: singleLine(values.email, emailMax),
    projectType: singleLine(values.projectType, OPTION_MAX),
    budget: singleLine(values.budget, OPTION_MAX),
    description: multiLine(values.description, descriptionMax),
    website: singleLine(values.website, HONEYPOT_MAX),
  };
}

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

/** Validates (normalised) values. Returns one friendly message per invalid field. */
export function validateInquiry(values: InquiryValues): InquiryErrors {
  const { nameMax, emailMax, descriptionMin, descriptionMax } = inquiryLimits;
  const errors: InquiryErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < NAME_MIN) {
    errors.name = `Your name needs at least ${NAME_MIN} characters.`;
  } else if (name.length > nameMax) {
    errors.name = `Please keep your name to ${nameMax} characters or fewer.`;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > emailMax) {
    // Length is checked before the pattern, so the regex only sees bounded input.
    errors.email = "That email address is too long.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "That email address doesn't look right.";
  }

  if (!findOption(projectTypes, values.projectType)) {
    errors.projectType = "Please choose the option closest to your project.";
  }

  if (values.budget !== "" && !findOption(budgetRanges, values.budget)) {
    errors.budget = "Please choose a budget range from the list.";
  }

  const description = values.description.trim();
  if (!description) {
    errors.description = "Please tell me a little about your project.";
  } else if (description.length < descriptionMin) {
    errors.description = `A sentence or two more helps — at least ${descriptionMin} characters.`;
  } else if (description.length > descriptionMax) {
    errors.description = `Please keep it to ${formatCount(descriptionMax)} characters or fewer.`;
  }

  return errors;
}

export function hasInquiryErrors(errors: InquiryErrors): boolean {
  return Object.values(errors).some(Boolean);
}

/** True when the hidden honeypot field was filled in (bots only). */
export function isHoneypotFilled(values: InquiryValues): boolean {
  return values.website.trim().length > 0;
}

/* -------------------------------------------------------------------------- */
/*  Message building                                                          */
/* -------------------------------------------------------------------------- */

export function buildInquirySubject(values: InquiryValues): string {
  return `Project inquiry — ${getProjectTypeLabel(values.projectType)} — ${values.name}`;
}

/** Plain-text body shared by the mailto: draft, EmailJS and "Copy brief". */
export function buildInquiryBody(values: InquiryValues): string {
  return [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Project type: ${getProjectTypeLabel(values.projectType)}`,
    `Budget: ${getBudgetLabel(values.budget)}`,
    "",
    "Project description:",
    values.description,
  ].join("\n");
}

/** Subject + body as one block of text, ready to paste into any email. */
export function buildInquiryBrief(values: InquiryValues): string {
  return `Subject: ${buildInquirySubject(values)}\n\n${buildInquiryBody(values)}`;
}

/**
 * mailto: URL with a pre-filled subject and body. Values are normalised again
 * (idempotent) and percent-encoded; line breaks are sent as CRLF (RFC 6068).
 */
export function buildMailtoUrl(values: InquiryValues): string {
  const clean = normaliseInquiry(values);
  const subject = encodeURIComponent(buildInquirySubject(clean));
  const body = encodeURIComponent(buildInquiryBody(clean).replace(/\n/g, "\r\n"));
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

/* -------------------------------------------------------------------------- */
/*  Delivery                                                                  */
/* -------------------------------------------------------------------------- */

interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

function getEmailJsConfig(): EmailJsConfig | null {
  // Each variable is referenced explicitly so Next.js inlines it at build time
  // (dynamic lookups such as process.env[name] are never inlined).
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ?? "";
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ?? "";
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ?? "";
  return serviceId && templateId && publicKey ? { serviceId, templateId, publicKey } : null;
}

/**
 * "emailjs" when all three NEXT_PUBLIC_EMAILJS_* variables are set, otherwise
 * "mailto" (opens a pre-filled draft in the visitor's email app).
 */
export function getInquiryDelivery(): InquiryDelivery {
  return getEmailJsConfig() ? "emailjs" : "mailto";
}

/**
 * Sends the inquiry through the EmailJS REST API. Never throws: failures come
 * back as a generic reason, and the response body is ignored so service
 * details never reach the UI. Times out after 15 seconds; `signal` lets the
 * caller cancel (e.g. when the form unmounts).
 */
export async function sendViaEmailJS(values: InquiryValues, signal?: AbortSignal): Promise<InquirySendResult> {
  const config = getEmailJsConfig();
  const clean = normaliseInquiry(values);
  if (!config || hasInquiryErrors(validateInquiry(clean))) {
    return { ok: false, reason: "rejected" };
  }
  // Honeypot tripped: report success without sending anything.
  if (isHoneypotFilled(clean)) {
    return { ok: true };
  }

  const controller = new AbortController();
  const abort = () => controller.abort();
  const timeout = setTimeout(abort, SEND_TIMEOUT_MS);
  if (signal?.aborted) abort();
  else signal?.addEventListener("abort", abort, { once: true });

  const subject = buildInquirySubject(clean);
  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        // Names match the EmailJS template: {{name}} {{email}} {{reply_to}} {{subject}}
        // {{message}} {{project_type}} {{budget}}.
        template_params: {
          name: clean.name,
          email: clean.email,
          reply_to: clean.email,
          subject,
          message: buildInquiryBody(clean),
          project_type: getProjectTypeLabel(clean.projectType),
          budget: getBudgetLabel(clean.budget),
        },
      }),
    });
    return response.ok ? { ok: true } : { ok: false, reason: "rejected" };
  } catch {
    // Offline, DNS/CORS/CSP failure, timeout or caller abort.
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
