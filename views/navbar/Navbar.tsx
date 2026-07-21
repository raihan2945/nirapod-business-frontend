"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { Button as AntButton, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";
import { userLoggedOut } from "@/state/features/auth/authSlice";
import { cn } from "@/lib/utils";

interface NavbarProps {
  variant?: "transparent" | "fixed";
}

//single source of truth - desktop and mobile render from this, so the two
//menus can no longer drift apart
const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/investor-signup", label: "Apply for Investment" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ variant = "transparent" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.auth?.id);
  useGetUserByIdQuery(userId);
  const userProfile = useSelector((state: RootState) => state?.user?.data);

  //solid whenever this page always wants a solid bar, or once scrolled away
  //from the hero
  const isSolid = variant === "fixed" || isScrolled;

  const logout = () => {
    dispatch(userLoggedOut());
    window.location.reload();
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    handleScroll(); //sync on mount, e.g. when landing mid-page on refresh
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //close the mobile menu whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  //don't let the page scroll behind the open mobile menu
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  //where the primary button points, based on who is signed in
  const account =
    userProfile?.role === "admin"
      ? { href: "/admin/dashboard", label: "Dashboard" }
      : userProfile?.role === "user"
        ? { href: "/user/profile", label: "Profile" }
        : { href: "/login/login-user", label: "Login" };

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isSolid ? "bg-[#31AD5C] shadow-lg" : "bg-transparent",
      )}
    >
      {/* scrim keeps white text legible over a photo while transparent */}
      {!isSolid && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 to-transparent"
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Nirapod Business home">
            <img
              src={isSolid ? "/images/logoDark.png" : "/images/logoLight.png"}
              alt="Nirapod Business"
              className="h-10 w-36 object-contain object-left"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 text-[15px] font-medium text-white transition-colors",
                  "after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-white after:transition-transform after:duration-200",
                  isActive(link.href)
                    ? "after:scale-x-100"
                    : "after:scale-x-0 hover:text-white/80",
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={account.href}
              className={cn(
                "ml-3 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition",
                isSolid
                  ? "bg-white text-[#237d42] hover:bg-white/90"
                  : "bg-[#31AD5C] text-white hover:bg-[#2a9550]",
              )}
            >
              {account.label}
            </Link>

            {userProfile && (
              <Popconfirm
                title="Logout"
                description="Are you sure to logout?"
                onConfirm={logout}
                okText="Yes"
                cancelText="No"
              >
                <AntButton
                  aria-label="Log out"
                  style={{ marginLeft: 8 }}
                  icon={<LogOut className="h-4 w-4" />}
                />
              </Popconfirm>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-white transition hover:bg-white/10 lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="mt-2 overflow-hidden rounded-xl bg-[#2a9550] shadow-xl lg:hidden"
          >
            <div className="space-y-1 px-2 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-[15px] font-medium text-white transition",
                    isActive(link.href) ? "bg-white/20" : "hover:bg-white/10",
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center gap-2 px-1 pt-3">
                <Link
                  href={account.href}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#237d42] transition hover:bg-white/90"
                >
                  {account.label}
                </Link>

                {userProfile && (
                  <Popconfirm
                    title="Logout"
                    description="Are you sure to logout?"
                    onConfirm={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <AntButton
                      aria-label="Log out"
                      icon={<LogOut className="h-4 w-4" />}
                    />
                  </Popconfirm>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
