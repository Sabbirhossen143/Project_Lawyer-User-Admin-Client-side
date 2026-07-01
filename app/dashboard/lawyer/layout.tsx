"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaHistory,
  FaFolderOpen,
  FaStar,
  FaWallet,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLawyerByEmail } from "@/services/lawyers";
import { AuthContext } from "@/contexts/AuthContext";

const lawyerLinks = [
  {
    name: "Dashboard",
    href: "/dashboard/lawyer",
    icon: <FaHome className="text-lg" />,
  },
  {
    name: "Hiring History",
    href: "/dashboard/lawyer/hiring-history",
    icon: <FaHistory className="text-lg" />,
  },
  {
    name: "Manage Services",
    href: "/dashboard/lawyer/manage-legal-profile",
    icon: <FaFolderOpen className="text-lg" />,
  },
  {
    name: "Reviews",
    href: "/dashboard/lawyer/reviews",
    icon: <FaStar className="text-lg" />,
  },
  {
    name: "Payment History",
    href: "/dashboard/lawyer/payment-history",
    icon: <FaWallet className="text-lg" />,
  },
];

export default function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutUser } = useAuth();
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch lawyer data for profile image in the topbar
  const { data: lawyer } = useQuery({
    queryKey: ["lawyer", user?.email],
    queryFn: () => getLawyerByEmail(user!.email!),
    enabled: !!user?.email,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("access-token");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E293B] antialiased">
      
      {/* Responsive Top Navbar (Visible on Mobile & Tablet, Hidden on Large Screens) */}
      <header className="lg:hidden w-full h-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={
              lawyer?.image && lawyer.image.trim() !== ""
                ? lawyer.image
                : "/images/default-lawyer.png"
            }
            alt="Lawyer"
            className="w-10 h-10 rounded-full object-cover border border-amber-500/40 p-0.5 bg-slate-950/40"
          />
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>⚖️</span> Legal Chambers
            </h2>
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block">
              Lawyer Panel
            </span>
          </div>
        </div>

        {/* 3 Dots / Menu Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-lg hover:border-amber-500/40 active:scale-95 transition-all"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Backdrop Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Premium Sidebar Layout */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 lg:relative
        w-72
        h-full
        bg-slate-900/95 lg:bg-slate-900/60
        backdrop-blur-xl
        border-r
        border-slate-800/80
        p-6
        flex
        flex-col
        justify-between
        flex-shrink-0
        shadow-[4px_0_24px_rgba(0,0,0,0.3)]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          {/* Header/Branding */}
          <div className="mb-10 px-2 flex flex-col gap-1">
            <div className="flex items-center justify-between lg:justify-start gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-slate-950 p-2 rounded-xl border border-slate-800 shadow-inner">⚖️</span>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Legal Chambers
                  </h2>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mt-0.5">
                    Lawyer Panel
                  </span>
                </div>
              </div>
              
              {/* Close button inside sidebar for mobile panels */}
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="lg:hidden text-slate-400 hover:text-rose-400 text-xl"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {lawyerLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)} // Closes menu when navigating on mobile
                  className={`
                  group
                  relative
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3.5
                  rounded-xl
                  font-medium
                  text-sm
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.25)] scale-[1.02]"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-amber-400"
                  }
                  `}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <span className={`transition-colors duration-300 ${isActive ? "text-slate-950" : "text-slate-400 group-hover:text-amber-400"}`}>
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </div>

                  {/* Left border accent for inactive hovered links */}
                  {!isActive && (
                    <span className="absolute left-0 w-1 h-0 bg-amber-500 rounded-r-full transition-all duration-300 group-hover:h-1/2" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Session Control */}
        <div className="space-y-4">
          {/* Internal Professional Badge */}
          <div className="bg-slate-950/60 border border-slate-800/60 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Session Status</span>
            </div>
            <span className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold uppercase">Secure</span>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={handleLogout}
              className="
              w-full
              flex
              items-center
              justify-center
              gap-3
              px-4
              py-3.5
              rounded-xl
              border
              border-rose-500/20
              bg-rose-500/[0.02]
              text-rose-400
              text-sm
              font-semibold
              hover:bg-rose-500
              hover:text-white
              hover:border-rose-600
              hover:shadow-[0_4px_15px_rgba(244,63,94,0.15)]
              transition-all
              duration-300
              "
            >
              <FaSignOutAlt className="text-base" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container Layer */}
      <main
        className="
        flex-1
        h-full
        overflow-y-auto
        relative
        z-10
        bg-transparent
        "
      >
        {children}
      </main>
    </div>
  );
}