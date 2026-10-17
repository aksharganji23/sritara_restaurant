import { redirect } from "next/navigation";
import { isAdmin, adminConfigured, MIN_PASSWORD_LENGTH } from "@/lib/admin/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 text-gold">
          <Logo className="size-10" />
          <p className="font-display text-2xl text-cream">Restaurant admin</p>
        </div>
        <h1 className="mt-8 text-xl font-bold text-cream">Sign in</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <div role="alert" className="mt-4 rounded-xl border border-danger/60 bg-danger/10 p-4 text-sm text-cream">
            The admin password isn&apos;t set up. Add <code className="text-gold">ADMIN_PASSWORD</code> (at least{" "}
            {MIN_PASSWORD_LENGTH} characters) to <code className="text-gold">.env.local</code>, or to Render → Environment, then
            restart.
          </div>
        )}
      </div>
    </main>
  );
}
