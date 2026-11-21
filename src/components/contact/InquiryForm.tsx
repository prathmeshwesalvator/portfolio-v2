"use client";

import { Check, ChevronDown, CircleAlert, CircleCheck, LoaderCircle, Mail, Pencil, Send } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { Button, ButtonLink } from "@/components/shared/Button";
import { CopyButton } from "@/components/shared/CopyButton";
import { budgetRanges, inquiryLimits, projectTypes } from "@/data/inquiry";
import { profile } from "@/data/profile";
import { cn } from "@/lib/cn";
import {
  buildInquiryBrief,
  buildMailtoUrl,
  emptyInquiry,
  formatCount,
  getInquiryDelivery,
  hasInquiryErrors,
  inquiryFieldOrder,
  isHoneypotFilled,
  normaliseInquiry,
  sendViaEmailJS,
  validateInquiry,
  type InquiryErrors,
  type InquiryField,
  type InquiryValues,
} from "@/lib/inquiry";

/** Resolved at build time from NEXT_PUBLIC_* variables — identical on server and client. */
export const INQUIRY_DELIVERY = getInquiryDelivery();

type Status = "idle" | "submitting" | "sent" | "draft" | "error";

const FIELD_LABELS: Record<(typeof inquiryFieldOrder)[number], string> = {
  name: "Name",
  email: "Email",
  projectType: "Project type",
  budget: "Budget range",
  description: "Project description",
};

const ERROR_TEXT = "text-[#ff8a8a]";
const ERROR_BORDER = "border-[#ff8a8a]/70";

const CONTROL =
  "w-full rounded-xl border bg-surface-2 px-4 text-[0.9375rem] text-fg placeholder:text-subtle transition-colors " +
  "focus:border-accent-text focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0";

/** Remaining characters at which the description counter starts announcing itself. */
const COUNTER_WARN_AT = 200;

export function InquiryForm() {
  const formId = useId();
  const fieldId = (field: InquiryField) => `${formId}-${field}`;
  const errorId = (field: InquiryField) => `${formId}-${field}-error`;

  const [values, setValues] = useState<InquiryValues>({ ...emptyInquiry });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  /** Normalised values of the last successful hand-off (drives the result panels). */
  const [submitted, setSubmitted] = useState<InquiryValues | null>(null);

  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cancel an in-flight request if the form unmounts (e.g. mode switch).
  useEffect(() => () => abortRef.current?.abort(), []);

  // Move focus to the result panel so its heading is announced.
  useEffect(() => {
    if (status === "sent" || status === "draft" || status === "error") resultRef.current?.focus();
  }, [status]);

  function update(field: InquiryField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validateInquiry(normaliseInquiry(next)));
    if (status === "error") setStatus("idle");
  }

  function revalidate() {
    if (attempted) setErrors(validateInquiry(normaliseInquiry(values)));
  }

  function focusField(field: InquiryField) {
    const target =
      field === "projectType"
        ? document.querySelector<HTMLInputElement>(`input[name="${formId}-projectType"]`)
        : document.getElementById(fieldId(field));
    target?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setAttempted(true);
    const clean = normaliseInquiry(values);
    const nextErrors = validateInquiry(clean);
    setErrors(nextErrors);
    if (hasInquiryErrors(nextErrors)) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    if (INQUIRY_DELIVERY === "mailto") {
      // Opens the visitor's email app with a pre-filled draft. Nothing is sent from here.
      if (!isHoneypotFilled(clean)) window.location.href = buildMailtoUrl(clean);
      setSubmitted(clean);
      setStatus("draft");
      return;
    }

    setStatus("submitting");
    const controller = new AbortController();
    abortRef.current = controller;
    const result = await sendViaEmailJS(clean, controller.signal);
    if (controller.signal.aborted) return;
    abortRef.current = null;
    setSubmitted(clean);
    setStatus(result.ok ? "sent" : "error");
  }

  function reset() {
    setValues({ ...emptyInquiry });
    setErrors({});
    setAttempted(false);
    setSubmitted(null);
    setStatus("idle");
  }

  /* ------------------------------------------------------------------ */
  /*  Result panels                                                      */
  /* ------------------------------------------------------------------ */

  if (status === "sent" && submitted) {
    return (
      <ResultPanel
        icon={<CircleCheck aria-hidden="true" className="size-7 text-accent-2" strokeWidth={1.75} />}
        title={`Thanks, ${submitted.name.split(" ")[0]} — your brief is in my inbox.`}
        headingRef={resultRef}
      >
        <p className="text-muted">
          Replies will go to <span className="break-all text-fg">{submitted.email}</span>.
        </p>
        <Button variant="secondary" onClick={reset} className="mt-8">
          Send another brief
        </Button>
      </ResultPanel>
    );
  }

  if (status === "draft" && submitted) {
    const mailto = buildMailtoUrl(submitted);
    return (
      <ResultPanel
        icon={<Mail aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.75} />}
        title="Your email app should now be open with your brief ready to send."
        headingRef={resultRef}
      >
        <p className="text-muted">Nothing has been sent yet — press Send in your email app to deliver it.</p>
        <div className="mt-8 rounded-2xl border border-line bg-surface-2 p-5">
          <p className="text-sm font-medium text-fg">Didn&apos;t open?</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ButtonLink href={mailto} size="sm" leadingIcon={<Mail aria-hidden="true" />}>
              Open email app again
            </ButtonLink>
            <CopyButton value={buildInquiryBrief(submitted)} label="Copy brief" showText className="h-9 px-4" />
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
            Or paste it into an email to <span className="break-all text-fg">{profile.email}</span>
            <CopyButton value={profile.email} label="Copy email address" />
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStatus("idle")}
          leadingIcon={<Pencil aria-hidden="true" />}
          className="mt-6 -ml-3"
        >
          Edit brief
        </Button>
      </ResultPanel>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Form                                                               */
  /* ------------------------------------------------------------------ */

  const errorList = inquiryFieldOrder.filter((field) => errors[field]);
  const descriptionLength = values.description.length;
  const remaining = inquiryLimits.descriptionMax - descriptionLength;
  const submitting = status === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="flex flex-col gap-6">
      {attempted && errorList.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className={cn("rounded-2xl border bg-surface-2 p-4 sm:p-5", ERROR_BORDER)}
        >
          <p className={cn("flex items-center gap-2 text-sm font-semibold", ERROR_TEXT)}>
            <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
            Please check {errorList.length === 1 ? "one field" : `${errorList.length} fields`}:
          </p>
          <ul className="mt-2 flex flex-col gap-1 pl-6 text-sm">
            {errorList.map((field) => (
              <li key={field}>
                <a
                  href={`#${fieldId(field)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                  className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-current"
                >
                  {FIELD_LABELS[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor={fieldId("name")} error={errors.name} errorId={errorId("name")}>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={inquiryLimits.nameMax}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            onBlur={revalidate}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? errorId("name") : undefined}
            placeholder="Your name"
            className={cn(CONTROL, "h-12", errors.name ? ERROR_BORDER : "border-line hover:border-line-strong")}
          />
        </Field>
        <Field label="Email" htmlFor={fieldId("email")} error={errors.email} errorId={errorId("email")}>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={inquiryLimits.emailMax}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            onBlur={revalidate}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? errorId("email") : undefined}
            placeholder="you@company.com"
            className={cn(CONTROL, "h-12", errors.email ? ERROR_BORDER : "border-line hover:border-line-strong")}
          />
        </Field>
      </div>

      <fieldset aria-describedby={errors.projectType ? errorId("projectType") : undefined}>
        <legend className="text-sm font-medium text-fg">Project type</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {projectTypes.map((option) => {
            const checked = values.projectType === option.value;
            return (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name={`${formId}-projectType`}
                  value={option.value}
                  checked={checked}
                  onChange={() => update("projectType", option.value)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ring)]",
                    checked
                      ? "border-accent-text bg-accent-soft text-fg"
                      : cn("bg-surface-2 text-muted hover:border-line-strong hover:text-fg", errors.projectType ? ERROR_BORDER : "border-line"),
                  )}
                >
                  {checked ? <Check aria-hidden="true" className="size-3.5 text-accent-text" strokeWidth={2.75} /> : null}
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.projectType ? (
          <ErrorText id={errorId("projectType")}>{errors.projectType}</ErrorText>
        ) : null}
      </fieldset>

      <Field
        label={
          <>
            Budget range <span className="font-normal text-subtle">(optional)</span>
          </>
        }
        htmlFor={fieldId("budget")}
        error={errors.budget}
        errorId={errorId("budget")}
      >
        <div className="relative">
          <select
            id={fieldId("budget")}
            name="budget"
            value={values.budget}
            onChange={(event) => update("budget", event.target.value)}
            aria-invalid={errors.budget ? true : undefined}
            aria-describedby={errors.budget ? errorId("budget") : undefined}
            className={cn(
              CONTROL,
              "h-12 cursor-pointer appearance-none pr-11",
              errors.budget ? ERROR_BORDER : "border-line hover:border-line-strong",
            )}
          >
            {budgetRanges.map((option) => (
              <option key={option.value || "none"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-subtle"
          />
        </div>
      </Field>

      <Field
        label="Project description"
        htmlFor={fieldId("description")}
        error={errors.description}
        errorId={errorId("description")}
      >
        <textarea
          id={fieldId("description")}
          name="description"
          rows={6}
          maxLength={inquiryLimits.descriptionMax}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          onBlur={revalidate}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={cn(`${fieldId("description")}-hint`, errors.description && errorId("description"))}
          placeholder="A few sentences about the idea…"
          className={cn(
            CONTROL,
            "min-h-40 resize-y py-3 leading-relaxed",
            errors.description ? ERROR_BORDER : "border-line hover:border-line-strong",
          )}
        />
        <div className="mt-2 flex items-start justify-between gap-4 text-xs">
          <p id={`${fieldId("description")}-hint`} className="text-subtle">
            What are you building, who is it for, any deadlines?
          </p>
          <p
            aria-live={remaining <= COUNTER_WARN_AT ? "polite" : "off"}
            className={cn("shrink-0 font-mono tabular-nums", remaining <= COUNTER_WARN_AT ? "text-fg" : "text-subtle")}
          >
            {formatCount(descriptionLength)} / {formatCount(inquiryLimits.descriptionMax)}
          </p>
        </div>
      </Field>

      {/* Honeypot — hidden from people and assistive tech; bots tend to fill it. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Leave this field empty</label>
        <input
          id={fieldId("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      {status === "error" ? (
        <div
          role="alert"
          className={cn("rounded-2xl border bg-surface-2 p-4 sm:p-5", ERROR_BORDER)}
        >
          <h3
            ref={resultRef}
            tabIndex={-1}
            className={cn("flex items-center gap-2 text-sm font-semibold focus:outline-none", ERROR_TEXT)}
          >
            <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
            Your message couldn&apos;t be sent.
          </h3>
          <p className="mt-2 text-sm text-muted">
            Please try again, or send it from your own email app — your brief is kept below.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button type="submit" size="sm">
              Try again
            </Button>
            <ButtonLink
              href={buildMailtoUrl(values)}
              variant="secondary"
              size="sm"
              leadingIcon={<Mail aria-hidden="true" />}
            >
              Email it instead
            </ButtonLink>
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <span className="break-all">{profile.email}</span>
              <CopyButton value={profile.email} label="Copy email address" />
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-line pt-6">
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full sm:w-auto sm:self-start"
          leadingIcon={
            submitting ? (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            ) : INQUIRY_DELIVERY === "mailto" ? (
              <Mail aria-hidden="true" />
            ) : (
              <Send aria-hidden="true" />
            )
          }
        >
          {submitting ? "Sending…" : INQUIRY_DELIVERY === "mailto" ? "Continue in your email app" : "Send brief"}
        </Button>
        {INQUIRY_DELIVERY === "mailto" ? (
          <p className="text-xs leading-relaxed text-subtle">
            This opens your email app with everything filled in — nothing is sent until you press Send there.
          </p>
        ) : null}
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <label htmlFor={htmlFor} className="mb-2.5 text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={cn("mt-2 flex items-start gap-1.5 text-sm", ERROR_TEXT)}>
      <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function ResultPanel({
  icon,
  title,
  headingRef,
  children,
}: {
  icon: ReactNode;
  title: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col py-2">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface-2">{icon}</span>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-6 font-display text-2xl leading-tight font-semibold tracking-[-0.02em] text-fg focus:outline-none sm:text-3xl"
      >
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
