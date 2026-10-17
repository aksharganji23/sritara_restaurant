"use client";
import { createContext, startTransition, useActionState, useContext, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { AdminState } from "@/app/admin/actions";

type Action = (prev: AdminState, fd: FormData) => Promise<AdminState>;

const ErrorsContext = createContext<Record<string, string>>({});

/** Form bound to a server action, with an announced status message and per-field errors. */
export function AdminForm({
  action,
  children,
  className = "",
  submitLabel = "Save changes",
  resetOnSuccess = false,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) formRef.current?.reset();
    if (state.ok === false) {
      const firstError = state.errors && Object.keys(state.errors)[0];
      const el = firstError ? formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`) : null;
      (el ?? statusRef.current)?.focus();
    }
  }, [state, resetOnSuccess]);

  return (
    <ErrorsContext.Provider value={state.errors ?? {}}>
      {/* Submitted manually so a failed save doesn't wipe what was typed (React 19 auto-resets forms). */}
      <form
        ref={formRef}
        action={formAction}
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => formAction(fd));
        }}
      >
        {children}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <SubmitButton label={submitLabel} pending={pending} />
          <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
            {state.message && (
              <p className={`flex items-center gap-2 text-sm font-semibold ${state.ok ? "text-leaf" : "text-danger"}`}>
                {state.ok ? <CheckCircle2 aria-hidden="true" className="size-4" /> : <AlertCircle aria-hidden="true" className="size-4" />}
                {state.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </ErrorsContext.Provider>
  );
}

export function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-bold text-gold-deep transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
    >
      {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
      {pending ? "Saving…" : label}
    </button>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-field bg-surface-2 px-3 py-2.5 text-cream placeholder:text-muted focus:border-gold aria-[invalid=true]:border-danger [color-scheme:dark]";

type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  required?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

export function Field({ label, name, hint, required, className = "", ...rest }: FieldProps) {
  const id = useId();
  const error = useContext(ErrorsContext)[name];
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-cream">
        {label} {required && <span aria-hidden="true" className="text-gold">*</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
      <input id={id} name={name} required={required} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={inputClass} {...rest} />
      {error && <p id={`${id}-err`} className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  hint,
  className = "",
  ...rest
}: { label: string; name: string; hint?: string; className?: string } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">) {
  const id = useId();
  const error = useContext(ErrorsContext)[name];
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-cream">{label}</label>
      {hint && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
      <textarea id={id} name={name} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={inputClass} {...rest} />
      {error && <p id={`${id}-err`} className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  name,
  children,
  className = "",
  ...rest
}: { label: string; name: string; className?: string } & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name">) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-cream">{label}</label>
      <select id={id} name={name} className={inputClass} {...rest}>
        {children}
      </select>
    </div>
  );
}

export function Checkbox({ label, name, hint, defaultChecked }: { label: string; name: string; hint?: string; defaultChecked?: boolean }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} className="mt-1 size-5 shrink-0 cursor-pointer accent-[#e9b44c]" aria-describedby={hint ? `${id}-hint` : undefined} />
      <div>
        <label htmlFor={id} className="cursor-pointer font-semibold text-cream">{label}</label>
        {hint && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
      </div>
    </div>
  );
}

/** Small form for one-click actions (move, delete, status). Asks before destructive ones. */
export function ActionButton({
  action,
  fields,
  label,
  srLabel,
  confirmText,
  tone = "default",
  children,
}: {
  action: (fd: FormData) => Promise<void>;
  fields: Record<string, string | number>;
  label?: string;
  srLabel?: string;
  confirmText?: string;
  tone?: "default" | "danger" | "primary";
  children?: React.ReactNode;
}) {
  const styles = {
    default: "border border-field text-cream hover:border-gold hover:text-gold",
    danger: "border border-danger/70 text-danger hover:bg-danger/10",
    primary: "bg-gold font-bold text-gold-deep hover:opacity-90",
  }[tone];
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <PendingButton className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${styles}`} srLabel={srLabel}>
        {children}
        {label}
      </PendingButton>
    </form>
  );
}

function PendingButton({ className, srLabel, children }: { className: string; srLabel?: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`} aria-label={srLabel}>
      {pending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : children}
    </button>
  );
}
