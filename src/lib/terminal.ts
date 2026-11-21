/**
 * Pure command logic for the terminal easter egg.
 *
 *   input string + context (current mode) → { lines, effect? }
 *
 * Every line of output is derived from `src/data` — nothing here invents
 * claims, metrics or availability. The <Terminal> component renders the lines
 * as React text nodes and executes the (optional) effect.
 */
import { education } from "@/data/education";
import { visibleExperience } from "@/data/experience";
import { profile } from "@/data/profile";
import { freelanceFeaturedId, freelanceWorkIds, getProject, recruiterFeaturedIds, recruiterMoreIds } from "@/data/projects";
import { modeMeta, SECTION_IDS } from "@/data/site";
import { programmingLanguages, skillGroups } from "@/data/skills";
import { isViewerMode } from "@/lib/viewer";
import type { ProjectId, ViewerMode } from "@/types";

/** Window event that opens the terminal (dispatched by the footer). */
export const TERMINAL_OPEN_EVENT = "portfolio:terminal-open";

/** Transcript cap — older lines are dropped first. */
export const TERMINAL_MAX_LINES = 200;

export const TERMINAL_INPUT_MAX_LENGTH = 200;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type OutputLine =
  /** Echo of a submitted command (rendered after the prompt). */
  | { kind: "input"; text: string }
  | { kind: "text"; text: string }
  | { kind: "muted"; text: string }
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | { kind: "heading"; text: string }
  /** Bulleted line with a hanging indent. */
  | { kind: "item"; text: string }
  /** Two aligned columns (command → description, label → value). */
  | { kind: "pair"; term: string; text: string }
  | {
      kind: "link";
      label: string;
      href: string;
      /** Opens in a new tab (target=_blank, rel=noopener noreferrer). */
      external: boolean;
      /** Optional left column, like `pair`. */
      term?: string;
      /** Screen-reader-only context appended to the link name (e.g. the project). */
      context?: string;
    }
  | { kind: "blank" };

export type TerminalEffect =
  | { type: "clear" }
  | { type: "close" }
  | { type: "open-url"; url: string; newTab: boolean }
  | { type: "switch-mode"; mode: ViewerMode }
  /** Close the terminal, then smooth-scroll to the section. */
  | { type: "scroll-to"; sectionId: string; delayMs?: number };

export interface TerminalContext {
  mode: ViewerMode;
}

export interface TerminalResult {
  lines: readonly OutputLine[];
  effect?: TerminalEffect;
}

interface ParsedCommand {
  /** Lower-cased name as typed (may be an alias). */
  name: string;
  /** Lower-cased arguments. */
  args: readonly string[];
}

interface CommandDefinition {
  name: string;
  aliases?: readonly string[];
  /** Shown in `help` instead of the bare name (e.g. "cd <section>"). */
  usage?: string;
  summary: string;
  /** Extra phrases offered by Tab completion (e.g. "mode freelance"). */
  completions?: (context: TerminalContext) => readonly string[];
  run: (command: ParsedCommand, context: TerminalContext) => TerminalResult;
}

/* -------------------------------------------------------------------------- */
/*  Line builders                                                             */
/* -------------------------------------------------------------------------- */

const text = (value: string): OutputLine => ({ kind: "text", text: value });
const muted = (value: string): OutputLine => ({ kind: "muted", text: value });
const success = (value: string): OutputLine => ({ kind: "success", text: value });
const error = (value: string): OutputLine => ({ kind: "error", text: value });
const heading = (value: string): OutputLine => ({ kind: "heading", text: value });
const item = (value: string): OutputLine => ({ kind: "item", text: value });
const pair = (term: string, value: string): OutputLine => ({ kind: "pair", term, text: value });
const blank: OutputLine = { kind: "blank" };

function link(
  label: string,
  href: string,
  options: { external?: boolean; term?: string; context?: string } = {},
): OutputLine {
  return { kind: "link", label, href, external: options.external ?? false, term: options.term, context: options.context };
}

/** Joins blocks of lines with a blank line between them. */
function joinBlocks(blocks: readonly (readonly OutputLine[])[]): OutputLine[] {
  return blocks.flatMap((block, index) => (index === 0 ? [...block] : [blank, ...block]));
}

function truncate(value: string, max = 40): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** "https://www.linkedin.com/in/x/" → "linkedin.com/in/x" */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/+$/, "");
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

/** Only links that come from our own data are ever opened, but stay defensive. */
export function isSafeTerminalUrl(url: string): boolean {
  return /^https:\/\//i.test(url) || /^mailto:/i.test(url) || (url.startsWith("/") && !url.startsWith("//"));
}

export function echoLine(input: string): OutputLine {
  return { kind: "input", text: input };
}

export const WELCOME_LINE: OutputLine = text("Welcome. Type 'help' to see what I can tell you.");

/* -------------------------------------------------------------------------- */
/*  Data helpers                                                              */
/* -------------------------------------------------------------------------- */

/** Projects in the order the current experience presents them. */
function projectIdsFor(mode: ViewerMode): readonly ProjectId[] {
  const ids = mode === "recruiter" ? [...recruiterFeaturedIds, ...recruiterMoreIds] : [freelanceFeaturedId, ...freelanceWorkIds];
  return unique(ids);
}

/** Where `sudo hire-me` lands in each experience. */
const CONTACT_SECTION: Record<ViewerMode, string> = {
  recruiter: SECTION_IDS.recruiter.contact,
  freelance: SECTION_IDS.freelance.inquiry,
};

const resumeLink = (): OutputLine =>
  link(profile.links.resumeFileName, profile.links.resume, { term: "résumé", external: true });
const emailLink = (): OutputLine => link(profile.email, `mailto:${profile.email}`, { term: "email" });
const githubLink = (): OutputLine =>
  link(displayUrl(profile.links.github), profile.links.github, { term: "github", external: true });
const linkedinLink = (): OutputLine =>
  link(displayUrl(profile.links.linkedin), profile.links.linkedin, { term: "linkedin", external: true });

/* -------------------------------------------------------------------------- */
/*  Command output                                                            */
/* -------------------------------------------------------------------------- */

function helpLines(): OutputLine[] {
  return [
    muted("Available commands:"),
    ...COMMANDS.map((command) => pair(command.usage ?? command.name, command.summary)),
    blank,
    muted("↑/↓ history · Tab completes · Esc closes"),
  ];
}

function whoamiLines(): OutputLine[] {
  return [heading(profile.name), text(profile.title), muted(profile.location.label)];
}

function aboutLines(): OutputLine[] {
  const { current } = profile;
  return [
    text(profile.summary),
    blank,
    pair("now", `${current.role} · ${current.company} (client: ${current.client})`),
    pair("education", `${education.degree} (${education.specialization})`),
    pair("", `${education.institution}, ${education.university} · ${education.period}`),
    pair("", `${education.grade.label} ${education.grade.value}/${education.grade.scale}`),
    pair("based in", profile.location.label),
    pair("languages", profile.languages.join(", ")),
    blank,
    muted("Try 'experience', 'projects' or 'skills' for more."),
  ];
}

function experienceLines(): OutputLine[] {
  return joinBlocks(
    visibleExperience.map((entry) => {
      const lines: OutputLine[] = [
        heading(`${entry.role} · ${entry.company}`),
        muted(entry.client ? `${entry.period} · Client: ${entry.client}` : entry.period),
      ];
      if (entry.summary) lines.push(text(entry.summary));
      lines.push(...entry.highlights.map(item));
      lines.push(muted(`Stack: ${entry.stack.join(", ")}`));
      if (entry.projectIds?.length) {
        const related = entry.projectIds.map((id) => getProject(id));
        const kinds = unique(related.map((project) => project.kindLabel));
        lines.push(
          muted(`Products: ${related.map((project) => project.name).join(", ")} (${kinds.join(", ")}) — see 'projects'`),
        );
      }
      return lines;
    }),
  );
}

function projectLines(mode: ViewerMode): OutputLine[] {
  return joinBlocks(
    projectIdsFor(mode).map((id) => {
      const project = getProject(id);
      // Employer work always carries its delivery context next to "Professional contribution".
      const showContext = project.kind === "professional" && project.context;
      const lines: OutputLine[] = [
        heading(`${project.name} — ${project.tagline}`),
        muted(showContext ? `${project.kindLabel} · ${project.context}` : project.kindLabel),
      ];
      if (project.ownershipNote) lines.push(muted(project.ownershipNote));
      lines.push(text(project.summary), muted(`Stack: ${project.stack.join(", ")}`));
      // Only verified links exist in data; projects without links simply get none.
      lines.push(
        ...project.links.map((projectLink) =>
          link(projectLink.label, projectLink.href, { external: true, context: project.name }),
        ),
      );
      return lines;
    }),
  );
}

function skillLines(): OutputLine[] {
  return joinBlocks([
    ...skillGroups.map((group) => [
      heading(`${group.title} · ${group.label}`),
      ...group.clusters.map((cluster) => item(`${cluster.title}: ${cluster.items.join(", ")}`)),
    ]),
    [heading("Programming languages"), item(programmingLanguages.join(", "))],
  ]);
}

/* -------------------------------------------------------------------------- */
/*  Command registry (order = `help` order)                                   */
/* -------------------------------------------------------------------------- */

const COMMANDS: readonly CommandDefinition[] = [
  { name: "help", summary: "Show available commands", run: () => ({ lines: helpLines() }) },
  { name: "whoami", summary: "Name, title and location", run: () => ({ lines: whoamiLines() }) },
  { name: "about", summary: "Summary, current role and education", run: () => ({ lines: aboutLines() }) },
  { name: "experience", summary: "Roles and what I worked on", run: () => ({ lines: experienceLines() }) },
  {
    name: "projects",
    summary: "Projects featured in this view",
    run: (_command, { mode }) => ({ lines: projectLines(mode) }),
  },
  { name: "skills", summary: "Skills, grouped by area", run: () => ({ lines: skillLines() }) },
  {
    name: "contact",
    summary: "Email, LinkedIn, GitHub and résumé",
    run: () => ({ lines: [emailLink(), linkedinLink(), githubLink(), resumeLink()] }),
  },
  {
    name: "resume",
    summary: "Open the résumé (PDF) in a new tab",
    run: () => ({
      lines: [muted("Opening the résumé in a new tab…"), resumeLink()],
      effect: { type: "open-url", url: profile.links.resume, newTab: true },
    }),
  },
  {
    name: "github",
    summary: "Open my GitHub profile",
    run: () => ({
      lines: [muted("Opening GitHub in a new tab…"), githubLink()],
      effect: { type: "open-url", url: profile.links.github, newTab: true },
    }),
  },
  {
    name: "linkedin",
    summary: "Open my LinkedIn profile",
    run: () => ({
      lines: [muted("Opening LinkedIn in a new tab…"), linkedinLink()],
      effect: { type: "open-url", url: profile.links.linkedin, newTab: true },
    }),
  },
  {
    name: "email",
    summary: "Write me an email",
    run: () => ({
      lines: [muted("Opening your email app…"), emailLink()],
      effect: { type: "open-url", url: `mailto:${profile.email}`, newTab: false },
    }),
  },
  {
    name: "ls",
    summary: "List the sections on this page",
    run: (_command, { mode }) => ({
      lines: [
        ...modeMeta[mode].nav.map((section) => pair(`${section.id}/`, section.label)),
        blank,
        muted("Type 'cd <section>' to jump to one."),
      ],
    }),
  },
  {
    name: "cd",
    usage: "cd <section>",
    summary: "Jump to a section (see 'ls')",
    completions: ({ mode }) => modeMeta[mode].nav.map((section) => `cd ${section.id}`),
    run: ({ args }, { mode }) => {
      const [rawTarget] = args;
      // `cd`, `cd ~` and `cd /` go "home" — the top of the page.
      if (!rawTarget || rawTarget === "~" || rawTarget === "/") {
        return { lines: [muted("Back to the top…")], effect: { type: "scroll-to", sectionId: SECTION_IDS[mode].hero } };
      }
      const target = rawTarget.replace(/^(\.\/|#)/, "").replace(/\/+$/, "");
      const section = modeMeta[mode].nav.find(
        (entry) => entry.id === target || entry.label.toLowerCase() === target,
      );
      if (!section) {
        return { lines: [error(`cd: no such section: ${truncate(rawTarget)} — type 'ls'`)] };
      }
      return { lines: [muted(`Jumping to ${section.label}…`)], effect: { type: "scroll-to", sectionId: section.id } };
    },
  },
  {
    name: "mode",
    aliases: ["view"],
    usage: "mode <view>",
    summary: "Switch view: recruiter | freelance (alias: view)",
    completions: () => ["recruiter", "freelance"].flatMap((view) => [`mode ${view}`, `view ${view}`]),
    run: ({ name, args }, { mode }) => {
      const [target] = args;
      if (!isViewerMode(target)) {
        return { lines: [error(`usage: ${name} recruiter|freelance`)] };
      }
      if (target === mode) {
        return { lines: [muted(`You're already in the ${modeMeta[mode].label} view.`)] };
      }
      return {
        lines: [success(`Switching to the ${modeMeta[target].label} view…`)],
        effect: { type: "switch-mode", mode: target },
      };
    },
  },
  {
    name: "sudo",
    usage: "sudo hire-me",
    summary: "Skip straight to contact",
    completions: () => ["sudo hire-me"],
    run: ({ args }, { mode }) => {
      const [target] = args;
      if (target === "hire-me") {
        return {
          lines: [success("Permission granted.")],
          // Short pause so the line is readable before the dialog closes.
          effect: { type: "scroll-to", sectionId: CONTACT_SECTION[mode], delayMs: 700 },
        };
      }
      if (!target) return { lines: [error("usage: sudo hire-me")] };
      return { lines: [error(`sudo: ${truncate(target)}: not permitted — try 'sudo hire-me'`)] };
    },
  },
  { name: "clear", summary: "Clear the screen", run: () => ({ lines: [], effect: { type: "clear" } }) },
  {
    name: "exit",
    aliases: ["close"],
    summary: "Close the terminal (or press Esc)",
    run: () => ({ lines: [], effect: { type: "close" } }),
  },
];

/** name/alias → definition. A Map avoids prototype keys like "constructor". */
const COMMAND_INDEX: ReadonlyMap<string, CommandDefinition> = new Map(
  COMMANDS.flatMap((command) => [command.name, ...(command.aliases ?? [])].map((key) => [key, command] as const)),
);

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

/** Runs one line of input. Case-insensitive; surrounding whitespace ignored. */
export function runCommand(input: string, context: TerminalContext): TerminalResult {
  const rawTokens = input.trim().split(/\s+/).filter(Boolean);
  const [rawName] = rawTokens;
  if (!rawName) return { lines: [] };

  const name = rawName.toLowerCase();
  const command = COMMAND_INDEX.get(name);
  if (!command) {
    return { lines: [error(`command not found: ${truncate(rawName)} — type 'help'`)] };
  }
  return command.run({ name, args: rawTokens.slice(1).map((token) => token.toLowerCase()) }, context);
}

function longestCommonPrefix(values: readonly string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/**
 * Tab completion. Returns the completed input, or null when there is nothing
 * to complete (the caller then lets Tab move focus as usual).
 */
export function completeCommand(input: string, context: TerminalContext): string | null {
  const typed = input.trimStart().replace(/\s+/g, " ").toLowerCase();
  if (!typed) return null;

  const phrases = unique(
    COMMANDS.flatMap((command) => [command.name, ...(command.aliases ?? []), ...(command.completions?.(context) ?? [])]),
  );
  const extensions = phrases.filter((phrase) => phrase.startsWith(typed) && phrase !== typed);
  if (extensions.length === 0) return null;

  const completion = extensions.length === 1 ? extensions[0] : longestCommonPrefix(extensions);
  return completion.length > typed.length ? completion : null;
}
