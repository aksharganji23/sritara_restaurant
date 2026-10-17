"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarCheck, ExternalLink, Image as ImageIcon, LayoutDashboard, LogOut, Menu as MenuIcon, Settings, UtensilsCrossed, X } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { Logo } from "../Logo";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/photos", label: "Photos", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-4 lg:py-6">
        <Link href="/admin" className="flex items-center gap-2 text-gold">
          <Logo className="size-8" />
          <span className="font-display text-lg text-cream">Admin</span>
        </Link>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-field text-cream lg:hidden"
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden="true" className="size-5" /> : <MenuIcon aria-hidden="true" className="size-5" />}
        </button>
      </div>
      <nav id="admin-nav" aria-label="Admin" className={`${open ? "block" : "hidden"} px-3 pb-4 lg:block`}>
        <ul className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium ${
                    active ? "bg-gold text-gold-deep" : "text-muted hover:bg-surface-2 hover:text-cream"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 space-y-1 border-t border-line pt-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted hover:bg-surface-2 hover:text-cream">
            <ExternalLink aria-hidden="true" className="size-5" /> View website<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-muted hover:bg-surface-2 hover:text-cream">
              <LogOut aria-hidden="true" className="size-5" /> Sign out
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
