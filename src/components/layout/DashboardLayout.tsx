import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BackgroundEffects from "../BackgroundEffects";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-black text-white overflow-hidden">
      <BackgroundEffects />

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        hidden={hidden}
        mobileOpen={mobileOpen}
        setCollapsed={setCollapsed}
        setHidden={setHidden}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={`transition-all duration-300 ${
          hidden ? "md:ml-0" : collapsed ? "md:ml-[110px]" : "md:ml-[290px]"
        }`}
      >
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          onHideSidebar={() => setHidden(!hidden)}
        />

        <main className="p-6 relative z-10">{children}</main>
      </div>
    </div>
  );
}