"use client";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { FaUser, FaEnvelope, FaUserShield, FaCheckCircle, FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 w-full max-w-full overflow-x-hidden animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* --- Header Section --- */}
        <div className="border-b border-white/[0.06] pb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1.5">
            Manage your personal identity and corporate account settings.
          </p>
        </div>

        {/* --- Premium Glassmorphic Profile Card --- */}
        <div className="relative bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden group">
          
          {/* Decorative Glowing Background Shapes */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-all duration-700 pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row gap-4 sm:gap-10 items-center z-10">
            
            {/* Left: Avatar with Pulse Glow */}
            <div className="relative shrink-0 group/avatar">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full blur-md opacity-40 group-hover/avatar:opacity-70 transition duration-500"></div>
              <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-400/40 to-transparent shadow-2xl">
                <img
                  src={user?.photoURL || "/images/profile.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-[#090d1f]"
                />
              </div>
              {/* Online/Active Status Badge */}
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-[#070b19] rounded-full animate-pulse shadow-lg"></span>
            </div>

            {/* Right: User Details & Stats */}
            <div className="flex-1 w-full text-center md:text-left min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 justify-center md:justify-start">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                  {user?.displayName || "Legal Client"}
                </h2>
                <span className="self-center shrink-0 text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full shadow-inner">
                  Premium Member
                </span>
              </div>

              <p className="text-slate-400 text-sm mt-1.5 flex items-center justify-center md:justify-start gap-2 truncate">
                <FaEnvelope className="text-amber-500/60 shrink-0" size={13} />
                <span className="truncate">{user?.email || "No email synchronized"}</span>
              </p>

              {/* --- Modern Detailed Info Grid --- */}
              <div className="mt-4 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                
                {/* Account Role Card */}
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl transition duration-300 hover:bg-white/[0.04]">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10 shrink-0">
                    <FaUserShield size={16} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</p>
                    <p className="text-sm font-bold text-white mt-0.5 truncate">User / Client</p>
                  </div>
                </div>

                {/* System Status Card */}
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl transition duration-300 hover:bg-white/[0.04]">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10 shrink-0">
                    <FaCheckCircle size={16} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Status</p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                      Active 
                    </p>
                  </div>
                </div>

              </div>

              {/* --- Premium Edit Profile CTA Button --- */}
              <div className="mt-4 md:mt-8 flex justify-center md:justify-start">
                <Link
                  href="/dashboard/user/update-profile"
                  className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-sm tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <FaEdit size={14} className="transform transition-transform group-hover:scale-110" />
                  Edit Profile
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}