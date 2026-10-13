import type { Metadata } from "next";
import PortalShell from "@/views/user/shell/PortalShell";

export const metadata: Metadata = {
  title: "Investor portal · Nirapod Business",
};

//the investor portal is an app-style shell (tab bar / sidebar) rather than
//the marketing site's navbar and footer
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
