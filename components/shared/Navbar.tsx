"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBalanceScale, FaTimes, FaSearch, FaBars } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // ড্রপডাউনের বাইরের ক্লিকের জন্য রেফারেন্স
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  
  const { user, logoutUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // বাইরের ক্লিকে মেনু ক্লোজ করার লজিক
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/browse-lawyers?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("access-token");
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    router.replace("/");
  };

  const getButtonStyle = (path: string) => `
    px-6 py-2.5 rounded-full border font-medium transition-all duration-300
    ${pathname === path 
      ? "border-amber-500/50 bg-amber-500/20 text-amber-400" 
      : "border-slate-700 bg-white/5 text-white hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400"}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2">
          <FaBalanceScale className="text-amber-500" size={28} />
          <h1 className="text-2xl font-bold text-white">Legal<span className="text-amber-500">Ease</span></h1>
        </Link>

        {/* Desktop & Medium Screen Centered Links */}
        <div className="hidden md:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className={getButtonStyle("/")}>Home</Link>
          <Link href="/browse-lawyers" className={getButtonStyle("/browse-lawyers")}>Browse Lawyers</Link>
          {user && <Link href="/dashboard/user" className={`hidden xl:flex ${getButtonStyle("/dashboard/user")}`}>Dashboard</Link>}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Desktop/Medium Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <FaSearch className="absolute left-3 text-slate-500" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search lawyers..." className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500 w-40 lg:w-60" />
          </form>

          {/* User Profile Logic */}
          <div className="relative" ref={profileRef}>
            {!user ? (
              <div className="hidden lg:flex gap-3">
                <Link href="/login" className={getButtonStyle("/login")}>Login</Link>
                <Link href="/register" className={getButtonStyle("/register")}>Register</Link>
              </div>
            ) : (
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center">
                <img src={user.photoURL || "/default-avatar.png"} alt="User" className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover" />
              </button>
            )}
            
            {profileMenuOpen && user && (
              <div className="absolute right-0 mt-3 w-56 bg-[#0B1220] border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 z-50">
                <p className="text-white font-bold">{user.displayName || "User"}</p>
                <p className="text-slate-400 text-sm mb-2">{user.email}</p>
                <Link href="/dashboard/user" onClick={() => setProfileMenuOpen(false)} className="text-white hover:text-amber-500">Dashboard</Link>
                <Link href="/dashboard/user/profile" onClick={() => setProfileMenuOpen(false)} className="text-white hover:text-amber-500">My Profile</Link>
                <Link href="/dashboard/user/manage-requests" onClick={() => setProfileMenuOpen(false)} className="text-white hover:text-amber-500">My Requests</Link>
                <button onClick={handleLogout} className="w-full text-center mt-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-900/50 transition-colors hover:bg-red-500/20">Logout</button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden" ref={mobileRef}>
            <button className="text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            
            {mobileMenuOpen && (
              <div className="absolute top-20 right-4 w-[280px] animate-in slide-in-from-top-5 duration-300 z-50">
                <div className="rounded-3xl border border-white/10 bg-[#0B1220]/95 backdrop-blur-2xl shadow-2xl p-6 flex flex-col gap-3">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className={getButtonStyle("/") + " text-center"}>Home</Link>
                  <Link href="/browse-lawyers" onClick={() => setMobileMenuOpen(false)} className={getButtonStyle("/browse-lawyers") + " text-center"}>Browse Lawyers</Link>
                  <form onSubmit={handleSearch} className="relative mt-2">
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search lawyers..." className="w-full rounded-2xl bg-slate-900 border border-slate-700 pl-4 pr-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                  </form>
                  {!user && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)} className={getButtonStyle("/login") + " text-center"}>Login</Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)} className={getButtonStyle("/register") + " text-center"}>Register</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}