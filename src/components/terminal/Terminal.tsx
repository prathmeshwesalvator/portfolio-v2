"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useMode } from "@/components/mode/ModeProvider";
import { scrollToSection } from "@/lib/scroll";
import {
  completeCommand,
  echoLine,
  isSafeTerminalUrl,
  runCommand,
  TERMINAL_INPUT_MAX_LENGTH,
  TERMINAL_MAX_LINES,
  TERMINAL_OPEN_EVENT,
  WELCOME_LINE,
  type OutputLine,
  type TerminalEffect,
} from "@/lib/terminal";

/*
 * Optional terminal easter egg. Opens on the `portfolio:terminal-open` window
 * event (footer) or the backtick key — never on its own.
 *
 * Deliberately dark in BOTH modes, so it uses a fixed palette instead of the
 * mode tokens. Contrast on #0b0b0e: text #e7e7ea 16.6:1 · muted #8a8a94 5.7:1 ·
 * prompt #b49cff 8.5:1 · success #34d399 10.3:1 · error #f87171 7.1:1.
 */

interface TranscriptEntry {
  id: number;
  line: OutputLine;
}

const HISTORY_LIMIT = 50;
const PROMPT = "~ $";
const EDITABLE_SELECTOR = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target instanceof HTMLElement && target.isContentEditable) return true;
  return target.closest(EDITABLE_SELECTOR) !== null;
}

/** Locks page scroll (keeping a classic scrollbar's gutter so nothing shifts). Returns the restore function. */
function lockPageScroll(): () => void {
  const root = document.documentElement;
  const previousOverflow = root.style.overflow;
  const previousGutter = root.style.getPropertyValue("scrollbar-gutter");
  if (window.innerWidth > root.clientWidth) {
    root.style.setProperty("scrollbar-gutter", "stable");
  }
  root.style.overflow = "hidden";
  return () => {
    root.style.overflow = previousOverflow;
    if (previousGutter) root.style.setProperty("scrollbar-gutter", previousGutter);
    else root.style.removeProperty("scrollbar-gutter");
  };
}

function openUrl(url: string, newTab: boolean) {
  if (!isSafeTerminalUrl(url)) return;
  if (newTab) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.location.assign(url);
  }
}

export function Terminal() {
  const { mode, switchMode } = useMode();
  const titleId = useId();
  const inputId = useId();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Transcript survives open/close for the lifetime of the page.
  const [entries, setEntries] = useState<readonly TranscriptEntry[]>(() => [{ id: 0, line: WELCOME_LINE }]);
  const [command, setCommand] = useState("");

  const nextIdRef = useRef(1);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number | null>(null);
  const draftRef = useRef("");
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const unlockScrollRef = useRef<(() => void) | null>(null);
  const afterCloseRef = useRef<(() => void) | null>(null);
  const pendingTimerRef = useRef<number | null>(null);
  const backdropPressRef = useRef(false);

  // Open triggers: the footer's window event and the backtick key.
  useEffect(() => {
    const open = () => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      const active = document.activeElement;
      previousFocusRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
      dialog.showModal();
      unlockScrollRef.current = lockPageScroll();
      inputRef.current?.focus();
      const log = logRef.current;
      if (log) log.scrollTop = log.scrollHeight;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "`" || event.repeat || event.isComposing || event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (isEditableTarget(event.target)) return;
      // Never stack on top of (or steal keys from) another open dialog.
      if (document.querySelector("dialog[open]")) return;
      event.preventDefault();
      open();
    };

    window.addEventListener(TERMINAL_OPEN_EVENT, open);
    window.addEventListener("keydown", onKeyDown);

    const pendingTimer = pendingTimerRef;
    const unlockScroll = unlockScrollRef;
    return () => {
      window.removeEventListener(TERMINAL_OPEN_EVENT, open);
      window.removeEventListener("keydown", onKeyDown);
      if (pendingTimer.current !== null) window.clearTimeout(pendingTimer.current);
      unlockScroll.current?.();
      unlockScroll.current = null;
    };
  }, []);

  // Keep the newest line in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  const clearPendingTimer = () => {
    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
  };

  /** Closes the dialog; `afterClose` runs once it has closed (scroll unlocked, page no longer inert). */
  const closeTerminal = (afterClose?: () => void) => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    afterCloseRef.current = afterClose ?? null;
    dialog.close();
  };

  // Fires for every close path: Esc (native cancel), close button, backdrop, `exit`, effects.
  const handleClose = () => {
    clearPendingTimer();
    unlockScrollRef.current?.();
    unlockScrollRef.current = null;
    historyIndexRef.current = null;
    backdropPressRef.current = false;

    const afterClose = afterCloseRef.current;
    const previous = previousFocusRef.current;
    afterCloseRef.current = null;
    previousFocusRef.current = null;

    if (afterClose) {
      afterClose();
    } else if (previous?.isConnected) {
      previous.focus({ preventScroll: true });
    }
  };

  const appendLines = (lines: readonly OutputLine[]) => {
    const additions = lines.map((line) => ({ id: nextIdRef.current++, line }));
    setEntries((previous) => [...previous, ...additions].slice(-TERMINAL_MAX_LINES));
  };

  const runEffect = (effect: TerminalEffect) => {
    switch (effect.type) {
      case "clear":
        setEntries([]);
        return;
      case "close":
        closeTerminal();
        return;
      case "open-url":
        openUrl(effect.url, effect.newTab);
        return;
      case "switch-mode": {
        const target = effect.mode;
        closeTerminal(() => switchMode(target));
        return;
      }
      case "scroll-to": {
        const { sectionId, delayMs = 0 } = effect;
        const go = () => {
          pendingTimerRef.current = null;
          closeTerminal(() => scrollToSection(sectionId));
        };
        if (delayMs > 0) {
          pendingTimerRef.current = window.setTimeout(go, delayMs);
        } else {
          go();
        }
        return;
      }
      default: {
        const unhandled: never = effect;
        return unhandled;
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitted = command.trim();
    setCommand("");
    historyIndexRef.current = null;
    draftRef.current = "";
    clearPendingTimer();

    if (submitted) {
      const history = historyRef.current;
      if (history[history.length - 1] !== submitted) {
        history.push(submitted);
        if (history.length > HISTORY_LIMIT) history.shift();
      }
    }

    const result = runCommand(submitted, { mode });
    if (result.effect?.type === "clear") {
      setEntries([]);
      return;
    }
    appendLines([echoLine(submitted), ...result.lines]);
    if (result.effect) runEffect(result.effect);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCommand(event.target.value);
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    const history = historyRef.current;

    switch (event.key) {
      case "ArrowUp": {
        if (history.length === 0) return;
        event.preventDefault();
        const current = historyIndexRef.current;
        if (current === null) draftRef.current = command;
        const index = current === null ? history.length - 1 : Math.max(0, current - 1);
        historyIndexRef.current = index;
        setCommand(history[index]);
        return;
      }
      case "ArrowDown": {
        const current = historyIndexRef.current;
        if (current === null) return;
        event.preventDefault();
        if (current >= history.length - 1) {
          historyIndexRef.current = null;
          setCommand(draftRef.current);
        } else {
          historyIndexRef.current = current + 1;
          setCommand(history[current + 1]);
        }
        return;
      }
      case "Tab": {
        if (event.shiftKey) return;
        const completion = completeCommand(command, { mode });
        // No completion → let Tab move focus as usual.
        if (completion === null) return;
        event.preventDefault();
        setCommand(completion.slice(0, TERMINAL_INPUT_MAX_LENGTH));
        return;
      }
      default:
        return;
    }
  };

  // Backdrop clicks land on the <dialog> itself (its content fills the box).
  // Require press + release there, so a text selection dragged outside doesn't close it.
  const handleDialogPointerDown = (event: ReactPointerEvent<HTMLDialogElement>) => {
    backdropPressRef.current = event.target === event.currentTarget;
  };

  const handleDialogClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    const pressedBackdrop = backdropPressRef.current;
    backdropPressRef.current = false;
    if (pressedBackdrop && event.target === event.currentTarget) closeTerminal();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      onPointerDown={handleDialogPointerDown}
      onClick={handleDialogClick}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(42rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] animate-[rise_0.4s_cubic-bezier(0.16,1,0.3,1)_both] overflow-hidden rounded-2xl border border-[#26262d] bg-[#0b0b0e] p-0 font-mono text-[13px] leading-6 text-[#e7e7ea] shadow-[0_32px_80px_-24px_rgb(0_0_0/0.8)] [--ring:rgb(180_156_255/0.85)] [color-scheme:dark] selection:bg-[#b49cff]/30 backdrop:bg-[#050508]/70 open:flex open:flex-col sm:text-sm"
    >
      <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-[#26262d] bg-[#111115] py-1 pr-1.5 pl-4">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]/85" />
          <span className="size-3 rounded-full bg-[#febc2e]/85" />
          <span className="size-3 rounded-full bg-[#28c840]/85" />
        </div>
        <h2 id={titleId} className="min-w-0 truncate px-2 text-center text-xs font-normal text-[#8a8a94]">
          prathmesh@portfolio — zsh
        </h2>
        <button
          type="button"
          onClick={() => closeTerminal()}
          aria-label="Close terminal"
          className="grid size-10 place-items-center justify-self-end rounded-lg text-[#8a8a94] transition-colors hover:bg-white/[0.06] hover:text-[#e7e7ea]"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        tabIndex={0}
        className="max-h-[60vh] min-h-0 overflow-y-auto overscroll-contain px-4 py-3 break-words [scrollbar-color:#3a3a44_transparent] [scrollbar-width:thin] focus-visible:outline-offset-[-2px] sm:px-5 sm:py-4"
      >
        {entries.map((entry) => (
          <TerminalLine key={entry.id} line={entry.line} />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2.5 rounded-b-[15px] border-t border-[#26262d] px-4 focus-within:shadow-[inset_0_0_0_1px_rgb(180_156_255/0.7)] sm:px-5"
      >
        <label htmlFor={inputId} className="sr-only">
          Terminal command
        </label>
        <span aria-hidden="true" className="shrink-0 text-[#b49cff] select-none">
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={command}
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          maxLength={TERMINAL_INPUT_MAX_LENGTH}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder="type a command"
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-[#e7e7ea] caret-[#b49cff] outline-hidden placeholder:text-[#8a8a94] sm:text-sm"
        />
      </form>
    </dialog>
  );
}

const LINK_CLASS =
  "text-[#e7e7ea] underline decoration-[#b49cff]/60 underline-offset-[3px] transition-colors hover:text-[#b49cff] hover:decoration-[#b49cff]";

function TerminalLine({ line }: { line: OutputLine }) {
  switch (line.kind) {
    case "input":
      return (
        <div className="text-[#e7e7ea]">
          <span aria-hidden="true" className="text-[#b49cff] select-none">
            {PROMPT}
          </span>
          <span className="sr-only">Command:</span> {line.text}
        </div>
      );
    case "text":
      return <div className="text-[#e7e7ea]">{line.text}</div>;
    case "muted":
      return <div className="text-[#8a8a94]">{line.text}</div>;
    case "success":
      return <div className="text-[#34d399]">{line.text}</div>;
    case "error":
      return <div className="text-[#f87171]">{line.text}</div>;
    case "heading":
      return <div className="font-semibold text-[#e7e7ea]">{line.text}</div>;
    case "item":
      return (
        <div className="flex gap-[1ch]">
          <span aria-hidden="true" className="shrink-0 text-[#8a8a94]">
            –
          </span>
          <span className="min-w-0 flex-1">{line.text}</span>
        </div>
      );
    case "pair":
      return (
        <div className="flex gap-[2ch]">
          <span className="w-[13ch] shrink-0 text-[#b49cff]">{line.term}</span>
          <span className="min-w-0 flex-1">{line.text}</span>
        </div>
      );
    case "link": {
      const anchor = isSafeTerminalUrl(line.href) ? (
        <a
          href={line.href}
          className={LINK_CLASS}
          {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {line.label}
          {line.context ? <span className="sr-only"> ({line.context})</span> : null}
          {line.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      ) : (
        <span>{line.label}</span>
      );
      if (line.term === undefined) return <div>{anchor}</div>;
      return (
        <div className="flex gap-[2ch]">
          <span className="w-[13ch] shrink-0 text-[#b49cff]">{line.term}</span>
          <span className="min-w-0 flex-1 wrap-anywhere">{anchor}</span>
        </div>
      );
    }
    case "blank":
      return <div aria-hidden="true" className="h-6" />;
    default: {
      const unhandled: never = line;
      return unhandled;
    }
  }
}
