"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChartPie,
  Globe,
  House,
  Loader2,
  LogOut,
  Newspaper,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/state/store";
import apiSlice from "@/state/features/api/api";
import { userLoggedOut } from "@/state/features/auth/authSlice";
import { useMe } from "../lib/hooks";
import { Avatar, ErrorState } from "../ui/primitives";
import { ToastProvider } from "../ui/overlay";

const LOGIN = "/login/login-user";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/user", label: "Home", icon: House },
  { href: "/user/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/user/portfolio", label: "Portfolio", icon: ChartPie },
  { href: "/user/wallet", label: "Wallet", icon: Wallet },
  { href: "/user/profile", label: "Profile", icon: UserRound },
];

const MORE: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/user/returns", label: "Return schedule", icon: CalendarDays },
  { href: "/blogs", label: "Insights & news", icon: Newspaper },
  { href: "/", label: "Visit website", icon: Globe },
];

const isActive = (pathname: string, href: string) => (href === "/user" ? pathname === "/user" : pathname === href || pathname.startsWith(`${href}/`));

//clears the session everywhere; a full navigation also drops cached user data
export function useLogout() {
  const dispatch: AppDispatch = useDispatch();
  return () => {
    dispatch(userLoggedOut());
    dispatch(apiSlice.util.resetApiState());
    window.location.href = "/";
  };
}

function Splash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-np-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logoDark.png" alt="Nirapod Business" className="h-12 w-auto" />
      <Loader2 className="size-6 animate-spin text-np-primary" />
    </div>
  );
}

export default function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const logout = useLogout();

  //redux-persist restores the token asynchronously - wait before deciding
  const rehydrated = useSelector((s: RootState) => s._persist?.rehydrated);
  const token = useSelector((s: RootState) => s.auth?.access_token);
  const { user, isError, error, refetch } = useMe();
  const unauthorized = (error as { status?: unknown } | undefined)?.status === 401;

  useEffect(() => {
    if (!rehydrated) return;
    if (!token) {
      router.replace(LOGIN);
    } else if (unauthorized) {
      dispatch(userLoggedOut());
      router.replace(LOGIN);
    } else if (user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [rehydrated, token, unauthorized, user?.role, router, dispatch]);

  if (!rehydrated || !token || unauthorized || user?.role === "admin") return <Splash />;
  if (!user) {
    return isError ? (
      <div className="flex min-h-screen items-center justify-center bg-np-bg">
        <ErrorState message="We couldn't load your account." onRetry={refetch} />
      </div>
    ) : (
      <Splash />
    );
  }

  //the bottom bar belongs to the five tab roots; deeper screens get a back header
  const onTabRoot = TABS.some((t) => t.href === pathname);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-np-bg text-np-text">
        {/* desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-np-border bg-white lg:flex">
          <Link href="/user" className="flex h-20 items-center px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logoDark.png" alt="Nirapod Business" className="h-10 w-auto" />
          </Link>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Investor portal">
            {TABS.map((t) => {
              const active = isActive(pathname, t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold transition-colors",
                    active ? "bg-np-primary-soft text-np-primary-dark" : "text-np-muted hover:bg-np-surface-muted hover:text-np-text",
                  )}
                >
                  <t.icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                  {t.label}
                </Link>
              );
            })}

            <p className="px-4 pb-2 pt-6 text-[11px] font-semibold tracking-wide text-np-subtle">MORE</p>
            {MORE.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive(pathname, t.href) && t.href !== "/" ? "bg-np-primary-soft text-np-primary-dark" : "text-np-muted hover:bg-np-surface-muted hover:text-np-text",
                )}
              >
                <t.icon className="size-[18px]" />
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-np-border p-3">
            <Link href="/user/profile" className="flex items-center gap-3 rounded-2xl p-2 hover:bg-np-surface-muted">
              <Avatar name={user.fullName} photo={user.photo} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.fullName}</p>
                <p className="truncate text-xs text-np-muted">{user.email}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-np-danger hover:bg-np-danger-soft"
            >
              <LogOut className="size-[18px]" />
              Log out
            </button>
          </div>
        </aside>

        <main className={cn("lg:pl-64", onTabRoot ? "pb-28 lg:pb-12" : "pb-12")}>
          <div className="mx-auto w-full max-w-5xl px-4 xl:max-w-7xl 2xl:max-w-[1440px] sm:px-6 lg:px-10">{children}</div>
        </main>

        {/* phone / tablet tab bar */}
        {onTabRoot && (
          <nav
            aria-label="Investor portal"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-np-border bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-np-up backdrop-blur lg:hidden"
          >
            <div className="mx-auto grid h-16 max-w-xl grid-cols-5">
              {TABS.map((t) => {
                const active = isActive(pathname, t.href);
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-np-primary-dark" : "text-np-subtle")}
                  >
                    <span className={cn("flex h-7 w-12 items-center justify-center rounded-full transition-all", active && "-translate-y-0.5 bg-np-primary-soft")}>
                      <t.icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} />
                    </span>
                    {t.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </ToastProvider>
  );
}
