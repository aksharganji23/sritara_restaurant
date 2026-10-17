"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login, type AdminState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<AdminState, FormData>(login, {});
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok === false) inputRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="mt-4 space-y-4">
      <div>
        <label htmlFor="password" className="font-semibold text-cream">Admin password</label>
        <div className="relative mt-1.5">
          <input
            ref={inputRef}
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={state.ok === false ? true : undefined}
            aria-describedby={state.message ? "login-error" : undefined}
            className="w-full rounded-lg border border-field bg-surface-2 px-3 py-3 pr-12 text-cream focus:border-gold aria-[invalid=true]:border-danger"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:text-cream"
          >
            {show ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        </div>
        {state.message && (
          <p id="login-error" role="alert" className="mt-2 text-sm text-danger">{state.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 py-3 font-bold text-gold-deep disabled:opacity-70"
      >
        {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
