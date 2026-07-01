"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useContext } from "react"; 
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/contexts/AuthContext"; 
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaHistory,
  FaComments,
  FaArrowLeft,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logoutUser } = useAuth();
  const { user } = useContext(AuthContext); 
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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

  const links = [
    { name: "Dashboard", href: "/dashboard/user", icon: <FaHome size={16} /> },
    { name: "Profile", href: "/dashboard/user/profile", icon: <FaUser size={16} /> },
    { name: "Hiring History", href: "/dashboard/user/hiring-history", icon: <FaHistory size={16} /> },
    { name: "Manage Requests", href: "/dashboard/user/manage-requests", icon: <FaClipboardList size={16} /> },
    { name: "Comments", href: "/dashboard/user/comments", icon: <FaComments size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020617] text-slate-100 antialiased selection:bg-amber-500/30">
      
      {/* --- Desktop Sidebar --- */}
      <aside className="w-72 hidden lg:flex flex-col justify-between border-r border-white/[0.06] bg-[#020617]/40 backdrop-blur-2xl sticky top-0 h-screen z-50">
        <div>
          <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
            <Link 
              href="/" 
              className="p-2.5 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition active:scale-95 shadow-md"
            >
              <FaArrowLeft size={12} />
            </Link>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              ⚖️ LegalEase
            </h1>
          </div>

          <div className="p-4 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">
              User Panel
            </p>
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group
                  ${active ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/10" : "text-slate-400 hover:text-white hover:bg-white/[0.04]"}`}
                >
                  {active && <span className="absolute left-0 w-1 h-5 bg-slate-950 rounded-r-md" />}
                  <span className={`${active ? "text-slate-950" : "text-slate-400 group-hover:text-amber-400 transition"}`}>
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06] space-y-1">
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition">
            <FaHome size={16} className="text-slate-400" />
            Go to Website
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/10 transition active:scale-[0.98]">
            <FaSignOutAlt size={16} />
            Logout Account
          </button>
        </div>
      </aside>

      {/* --- Mobile/Tablet Header --- */}
      <header className="lg:hidden sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#020617]/80 backdrop-blur-xl px-4 sm:px-6 py-4 flex justify-between items-center">
        
        {/* Left Side Content: Home button & Logo only */}
        <div className="flex items-center gap-2.5">
          <Link 
            href="/" 
            className="p-2 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 bg-white/[0.03] border border-white/[0.08] rounded-xl transition flex items-center justify-center shadow-md cursor-pointer"
            title="Go to Home"
          >
            <FaHome size={18} />
          </Link>
          
          <div>
            <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              ⚖️ LegalEase
            </h1>
          </div>
        </div>

        {/* ✨ Right Side Content: Menu toggle button placed perfectly here */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-xl transition cursor-pointer"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#020617]/95 backdrop-blur-2xl z-40 p-4 border-b border-white/[0.06] overflow-y-auto space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">User Panel</p>
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold" : "text-slate-400 hover:bg-white/[0.04]"}`}
                >
                  <span className={active ? "text-slate-950" : "text-amber-500"}>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            <button onClick={() => { router.push("/"); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-white/[0.04] transition">
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
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}