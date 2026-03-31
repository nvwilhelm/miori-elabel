"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    exact: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Produkte",
    href: "/admin/products",
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: "Neues Produkt",
    href: "/admin/products/new",
    exact: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  logoutAction: () => Promise<void>;
}

export default function AdminSidebar({ logoutAction }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    if (href === "/admin/products/new") return pathname.startsWith(href);
    if (href === "/admin/products") {
      return pathname.startsWith(href) && !pathname.startsWith("/admin/products/new");
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-[var(--admin-sidebar)] flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/admin" className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-[var(--admin-accent)]">
            miori
          </span>
          <span className="text-[10px] font-medium text-[var(--admin-sidebar-text)] uppercase tracking-widest">
            E-Label
          </span>
        </Link>
      </div>

      {/* Trenner */}
      <div className="mx-4 mb-4 border-t border-[var(--admin-sidebar-hover)]" />

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150
                ${active
                  ? "bg-[var(--admin-sidebar-active)] text-white border-l-[3px] border-[var(--admin-accent)] pl-[13px]"
                  : "text-[var(--admin-sidebar-text)] hover:bg-[var(--admin-sidebar-hover)] hover:text-[var(--admin-sidebar-text-active)] border-l-[3px] border-transparent pl-[13px]"
                }
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="px-4 py-4 border-t border-[var(--admin-sidebar-hover)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--admin-accent)] flex items-center justify-center text-white text-sm font-semibold shrink-0">
            N
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--admin-sidebar-text-active)] truncate">
              Nic
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-1.5 rounded-md text-[var(--admin-sidebar-text)] hover:text-[var(--admin-sidebar-text-active)] hover:bg-[var(--admin-sidebar-hover)] transition-colors"
              title="Abmelden"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
