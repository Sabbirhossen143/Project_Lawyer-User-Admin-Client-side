"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "@/lib/axios";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaGavel,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaChartLine,
  FaFileContract,
  FaBars,
  FaTimes
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: <FaChartLine size={16} />,
  },
  {
    name: "Manage Users",
    href: "/dashboard/admin/manage-users",
    icon: <FaUsers size={16} />,
  },
  {
    name: "Manage Lawyers",
    href: "/dashboard/admin/manage-lawyers",
    icon: <FaGavel size={16} />,
  },
  {
    name: "Hire Requests",
    href: "/dashboard/admin/hire-requests",
    icon: <FaFileContract size={16} />,
  },
  {
    name: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: <FaMoneyBillWave size={16} />,
  },
  {
    name: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: <FaChartLine size={16} />,
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const res = await axiosPublic.get("/system-settings");
      return res.data;
    },
  });

  const router = useRouter();
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("access-token");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020617] text-slate-100 antialiased selection:bg-amber-500/30">
      
      {/* --- Desktop Sidebar --- */}
      <aside className="w-72 hidden lg:flex flex-col justify-between border-r border-white/[0.06] bg-[#020617]/40 backdrop-blur-2xl sticky top-0 h-screen z-50">
        <div>
          <div className="p-6 border-b border-white/[0.06] flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              ⚖️ Admin Panel
            </h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              {settings?.platformName || "Lawyer Hiring Platform"}
            </p>
          </div>

          <div className="p-4 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">
              Core Features
            </p>
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group
                  ${active ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10" : "text-slate-400 hover:text-white hover:bg-white/[0.04]"}`}
                >
                  {active && <span className="absolute left-0 w-1 h-5 bg-slate-950 rounded-r-md" />}
                  <span className={`${active ? "text-slate-950" : "text-slate-400 group-hover:text-amber-400 transition"}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06] space-y-1">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition">
            <FaHome size={16} className="text-slate-400" />
            Go to Website
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/10 transition active:scale-[0.98]">
            <FaSignOutAlt size={16} />
            Logout Account
          </button>
        </div>
      </aside>

      {/* --- Mobile/Tablet Header & Mobile Drawer Dropdown --- */}
      <header className="lg:hidden sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#020617]/80 backdrop-blur-xl px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-xl transition"
          >
            {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
          <div>
            <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              ⚖️ Admin Panel
            </h1>
          </div>
        </div>

        {/* Top Header Avatar Integration */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.02] border border-white/[0.05] pl-2 pr-3 py-1 rounded-full shadow-inner">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#090d1f] border border-white/10 flex items-center justify-center overflow-hidden shadow-md">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs">
                A
              </div>
            )}
          </div>
          <div className="text-left hidden xs:block">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-200 leading-none">Admin</h4>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Content */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#020617]/95 backdrop-blur-2xl z-40 p-4 border-b border-white/[0.06] overflow-y-auto space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Core Features</p>
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold" : "text-slate-400 hover:bg-white/[0.04]"}`}
                >
                  <span className={active ? "text-slate-950" : "text-amber-500"}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-white/[0.04] transition">
              <FaHome size={16} /> Go to Website
            </button>
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 transition">
              <FaSignOutAlt size={16} /> Logout Account
            </button>
          </div>
        </div>
      )}

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-40 border-b border-white/[0.05] bg-[#020617]/60 backdrop-blur-xl">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">System Workspace</h2>
            <div className="flex items-center gap-3 bg-white/[0.02] border-2 border-white/[0.05] pl-3 pr-4 py-1.5 rounded-full shadow-inner">
              <div className="h-8 w-8 rounded-full bg-[#090d1f] border-2 border-white/10 flex items-center justify-center overflow-hidden">
                {settings?.logoUrl ? <img src={settings.logoUrl} alt="Admin Avatar" className="w-full h-full object-cover" /> : <div className="h-full w-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm">A</div>}
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-200 leading-3">System Admin</h4>
                <span className="text-[10px] text-slate-400 font-medium">Superuser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}