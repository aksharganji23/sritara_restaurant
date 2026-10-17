export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-cream sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, description, children, id }: { title?: string; description?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} aria-labelledby={title && id ? `${id}-title` : undefined} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      {title && (
        <h2 id={id ? `${id}-title` : undefined} className="text-lg font-bold text-cream">
          {title}
        </h2>
      )}
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}
