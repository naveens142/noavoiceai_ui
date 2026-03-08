
import {
  Phone,
  Clock,
  Bot,
  PhoneCall,
  Calendar,
  MessageSquare,
  Mail,
  Timer,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold text-cyan-300">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Platform overview and usage statistics
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          icon={<Phone size={20} />}
          title="Total Calls"
          value="21"
          subtitle="+12% from last month"
        />

        <StatCard
          icon={<Clock size={20} />}
          title="Avg Call Duration"
          value="0.5"
          subtitle="Minutes per call"
        />

        <StatCard
          icon={<Bot size={20} />}
          title="Active Agents"
          value="12"
          subtitle="AI agents running"
        />

        <StatCard
          icon={<PhoneCall size={20} />}
          title="Phone Numbers"
          value="1"
          subtitle="Active numbers"
        />

      </div>

      {/* Secondary Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          icon={<Calendar size={20} />}
          title="Bookings"
          value="0"
          subtitle="+8% vs last month"
        />

        <StatCard
          icon={<MessageSquare size={20} />}
          title="SMS Sent"
          value="0"
          subtitle="Within plan limit"
        />

        <StatCard
          icon={<Mail size={20} />}
          title="Emails Sent"
          value="0"
          subtitle="Within plan limit"
        />

        <StatCard
          icon={<Timer size={20} />}
          title="Minutes Used"
          value="0.0"
          subtitle="Within plan limit"
        />

      </div>

      {/* Bottom Panels */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Quick Actions */}

        <GlassPanel title="Quick Actions" icon={<Zap size={18} />}>

          <ActionButton label="Create New Agent" />
          <ActionButton label="Add New Action" />
          <ActionButton label="Manage Phone Numbers" />

        </GlassPanel>

        {/* Recent Calls */}

        <GlassPanel title="Recent Calls">

          <div className="space-y-3">

            <CallRow time="20 hours ago" duration="13s" />
            <CallRow time="1 day ago" duration="22s" />

          </div>

        </GlassPanel>

      </div>

    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ icon, title, value, subtitle }: any) {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-to-br from-[#0f172a]/70 to-[#020617]/70 border border-cyan-500/20 backdrop-blur-md hover:border-cyan-400/40 transition">

      <div className="flex justify-between items-center mb-4">

        <span className="text-gray-400 text-sm">
          {title}
        </span>

        <div className="text-cyan-400">
          {icon}
        </div>

      </div>

      <h2 className="text-3xl font-semibold text-white">
        {value}
      </h2>

      <p className="text-xs text-gray-400 mt-1">
        {subtitle}
      </p>

    </div>
  );
}

function GlassPanel({ title, icon, children }: any) {
  return (
    <div className="rounded-xl p-6 bg-gradient-to-br from-[#0f172a]/70 to-[#020617]/70 border border-cyan-500/20 backdrop-blur-md">

      <div className="flex items-center gap-2 mb-5 text-cyan-300 font-medium">
        {icon}
        {title}
      </div>

      {children}

    </div>
  );
}

function ActionButton({ label }: any) {
  return (
    <button className="w-full text-left px-4 py-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 text-sm transition">
      {label}
    </button>
  );
}

function CallRow({ time, duration }: any) {
  return (
    <div className="flex justify-between items-center px-4 py-3 rounded-lg bg-white/5 border border-white/10">

      <span className="text-gray-300 text-sm">
        Call from • {time}
      </span>

      <span className="text-cyan-300 text-xs">
        {duration}
      </span>

    </div>
  );
}