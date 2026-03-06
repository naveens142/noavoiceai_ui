import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Wrench,
  BookOpen,
  Megaphone,
  Phone,
  PhoneCall,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  EyeOff,
} from "lucide-react";

interface Props {
  collapsed: boolean;
  hidden: boolean;
  mobileOpen: boolean;
  setCollapsed: (val: boolean) => void;
  setHidden: (val: boolean) => void;
  setMobileOpen: (val: boolean) => void;
}

export default function Sidebar({
  collapsed,
  hidden,
  mobileOpen,
  setCollapsed,
  setHidden,
  setMobileOpen,
}: Props) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Agents", icon: Bot, path: "/agents" },
    { name: "Tools", icon: Wrench, path: "/tools" },
    { name: "Knowledge Base", icon: BookOpen, path: "/knowledge" },
    { name: "Campaigns", icon: Megaphone, path: "/campaigns" },
    { name: "Phone Numbers", icon: Phone, path: "/numbers" },
    { name: "Call Logs", icon: PhoneCall, path: "/calls" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      className={`
        fixed top-4 bottom-4 left-4 z-50
        transition-all duration-300
        ${hidden ? "-translate-x-[110%]" : "translate-x-0"}
        ${mobileOpen ? "translate-x-0" : ""}
        ${collapsed ? "w-[80px]" : "w-[260px]"}
        bg-white/5 backdrop-blur-xl border border-cyan-400/20
        rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.15)]
        flex flex-col
        md:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <Bot className="text-cyan-400" size={28} />
          {!collapsed && (
            <span className="text-lg font-bold tracking-wide text-cyan-300">
              NoaVoiceAI
            </span>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-400 hover:text-cyan-400 transition"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mb-4 text-gray-400 hover:text-cyan-400 transition"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200
                ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                    : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
                }
              `}
            >
              <Icon size={20} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Hide Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setHidden(true)}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition text-sm"
        >
          <EyeOff size={16} />
          {!collapsed && <span>Hide Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}