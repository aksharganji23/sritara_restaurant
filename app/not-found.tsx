import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[90vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-8xl text-gold">404</p>
      <h1 className="mt-4 font-display text-3xl text-cream">This dish isn&apos;t on the menu</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-8 rounded-full bg-gold px-7 py-3 font-bold text-gold-deep">Back to home</Link>
    </main>
  );
}
