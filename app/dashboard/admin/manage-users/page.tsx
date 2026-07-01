"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosPublic from "@/lib/axios";
import toast from "react-hot-toast";

import {
  FaSearch,
  FaTrash,
  FaUserShield,
  FaUsers,
  FaUser,
  FaGavel,
  FaTimes,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChevronDown,
  FaIdCard
} from "react-icons/fa";

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userEmail: string | null;
    userName: string | null;
  }>({
    isOpen: false,
    userEmail: null,
    userName: null,
  });

  // ==========================
  // Fetch Users
  // ==========================
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["manage-users"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users");
      return res.data;
    },
  });

  // ==========================
  // Update Role
  // ==========================
  const updateRoleMutation = useMutation({
    mutationFn: async ({
      email,
      role,
    }: {
      email: string;
      role: string;
    }) => {
      const res = await axiosPublic.patch(
        `/users/role/${email}`,
        { role }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["manage-users"],
      });
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  // ==========================
  // Delete User
  // ==========================
  const deleteMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await axiosPublic.delete(
        `/users/${email}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["manage-users"],
      });
      closeDeleteModal();
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  // --- Delete Modal Handlers ---
  const triggerDeleteConfirm = (email: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      userEmail: email,
      userName: name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      userEmail: null,
      userName: null
    });
  };

  const handleExecuteDelete = () => {
    if (deleteModal.userEmail) {
      deleteMutation.mutate(deleteModal.userEmail);
    }
  };

  // ==========================
  // Search Filter
  // ==========================
  const filteredUsers = useMemo(() => {
    return users.filter((user: any) =>
      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // Role Badge Function for High Fidelity Design
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg whitespace-nowrap">
            <FaUserShield size={12} /> Admin
          </span>
        );
      case "lawyer":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg whitespace-nowrap">
            <FaGavel size={12} /> Lawyer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg whitespace-nowrap">
            <FaUser size={12} /> User
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 selection:bg-amber-500/20 animate-in fade-in duration-300 relative w-full max-w-full overflow-x-hidden">
      
      {/* ================================= */}
      {/* Header Panel */}
      {/* ================================= */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
              <FaUsers size={20} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
                Manage Accounts
              </h1>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm max-w-xl">
                Control client privileges, configure system roles, and revoke accesses.
              </p>
            </div>
          </div>

          {/* Premium Search Box */}
          <div className="relative w-full md:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#090d1f]/40 focus:bg-[#090d1f]/90 border border-white/[0.06] focus:border-amber-500/40 rounded-xl py-2.5 sm:py-3 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition duration-300 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* Metrics Performance Counters (Updated Responsive Layout) */}
      {/* ================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          { title: "Total Registered Users", count: users.length, style: "bg-blue-500/10 border-blue-500/20 text-blue-400", mobileRowSpan: "col-span-2 sm:col-span-1" },
          { title: "Verified Lawyers", count: users.filter((u: any) => u.role === "lawyer").length, style: "bg-purple-500/10 border-purple-500/20 text-purple-400", mobileRowSpan: "col-span-1" },
          { title: "System Admins", count: users.filter((u: any) => u.role === "admin").length, style: "bg-amber-500/10 border-amber-500/20 text-amber-400", mobileRowSpan: "col-span-1" }
        ].map((metric, index) => (
          <div key={index} className={`rounded-2xl p-5 sm:p-6 border ${metric.style} ${metric.mobileRowSpan} shadow-lg backdrop-blur-sm relative overflow-hidden group`}>
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.02] text-white font-black text-7xl sm:text-9xl pointer-events-none select-none group-hover:scale-110 transition duration-500">
              {metric.count}
            </div>
            <h3 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold opacity-80">{metric.title}</h3>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1.5 sm:mt-2 tracking-tight">{metric.count}</h2>
          </div>
        ))}
      </div>

      {/* ================================= */}
      {/* Interactive Table Grid */}
      {/* ================================= */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden w-full">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Profile Name</th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Profile</th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Email</th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Current Role</th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Change Role</th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Delete Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 text-xs sm:text-sm">
                    No corresponding user profiles registered under this criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/[0.02] transition duration-200 group"
                  >
                    {/* User Profile Cell */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-inner uppercase overflow-hidden group-hover:border-amber-500/30 transition shrink-0">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.name ? user.name.substring(0, 2) : "US"
                          )}
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-slate-200 tracking-tight group-hover:text-amber-400 transition truncate max-w-[140px] sm:max-w-none">{user.name || "N/A"}</span>
                      </div>
                    </td>

                    {/* View Profile Action Control */}
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className="px-2.5 sm:px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 rounded-lg border border-amber-500/20 transition-all text-[11px] sm:text-xs font-semibold cursor-pointer outline-none active:scale-95 whitespace-nowrap"
                      >
                        View
                      </button>
                    </td>

                    {/* Email */}
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-400 font-mono">{user.email}</td>

                    {/* Current Custom Badge */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>

                    {/* Premium Custom Dropdown Instead of HTML Select */}
                    <td className="px-4 sm:px-6 py-4">
                      {(() => {
                        return (
                          <div className="relative inline-block w-40 sm:w-44 text-left">
                            <details className="dropdown group border-none outline-none">
                              {/* Dropdown Trigger Button */}
                              <summary className="w-full bg-[#0a0f26]/90 border border-white/10 hover:border-amber-500/30 text-[11px] sm:text-xs font-bold text-slate-300 rounded-xl pl-3 pr-8 py-2 sm:py-2.5 outline-none cursor-pointer list-none flex items-center justify-between transition-all duration-300 shadow-lg group-open:ring-1 group-open:ring-amber-500/20 group-open:border-amber-500/50">
                                <span className="flex items-center gap-1.5 capitalize truncate">
                                  {user.role === "admin" && "🎖️ Administrator"}
                                  {user.role === "lawyer" && "⚖️ Expert Lawyer"}
                                  {user.role === "user" && "👤 Standard Client"}
                                </span>
                                <FaChevronDown size={10} className="text-slate-500 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-1" />
                              </summary>

                              {/* Premium Dropdown Options Menu */}
                              <ul className="absolute right-0 sm:left-0 z-50 mt-2 w-full bg-[#0d1530] border border-white/10 rounded-xl p-1.5 shadow-2xl backdrop-blur-xl list-none flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                                {/* Option 1: User */}
                                <li>
                                  <button
                                    onClick={(e) => {
                                      updateRoleMutation.mutate({ email: user.email, role: "user" });
                                      e.currentTarget.closest("details")?.removeAttribute("open");
                                    }}
                                    className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                      user.role === "user" 
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                    }`}
                                  >
                                    👤 Standard Client
                                  </button>
                                </li>

                                {/* Option 2: Lawyer */}
                                <li>
                                  <button
                                    onClick={(e) => {
                                      updateRoleMutation.mutate({ email: user.email, role: "lawyer" });
                                      e.currentTarget.closest("details")?.removeAttribute("open");
                                    }}
                                    className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                      user.role === "lawyer" 
                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                    }`}
                                  >
                                    ⚖️ Expert Lawyer
                                  </button>
                                </li>

                                {/* Option 3: Admin */}
                                <li>
                                  <button
                                    onClick={(e) => {
                                      updateRoleMutation.mutate({ email: user.email, role: "admin" });
                                      e.currentTarget.closest("details")?.removeAttribute("open");
                                    }}
                                    className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                      user.role === "admin" 
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                    }`}
                                  >
                                    🎖️ Administrator
                                  </button>
                                </li>
                              </ul>
                            </details>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Delete Action Control */}
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <button
                        onClick={() => triggerDeleteConfirm(user.email, user.name || "User")}
                        className="p-2 bg-red-500/5 hover:bg-red-500 text-red-400/80 hover:text-white border border-red-500/10 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                        title="Delete User"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =============================== */}
      {/* Premium Luxury Popup View Modal */}
      {/* =============================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Scroll Optimization with Premium Custom Tailwind Scrollbar utility classes */}
          <div className="relative w-full max-w-xl bg-[#0a0f26]/95 border border-white/10 text-slate-200 rounded-2xl p-5 md:p-8 shadow-2xl transform transition-all duration-300 scale-100 opacity-100 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-4 sm:pr-6">
            
            {/* Sole Close Control Trigger Anchor (Top Right Side Only) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition group z-10 cursor-pointer"
            >
              <FaTimes size={14} className="group-hover:rotate-90 transition duration-300" />
            </button>

            <div className="flex flex-col items-center pb-5 border-b border-white/10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-500/30 p-1 bg-amber-500/5 shadow-xl shrink-0">
                {selectedUser?.photoURL ? (
                  <img
                    src={selectedUser.photoURL}
                    alt={selectedUser?.name || "User"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-white/[0.04] text-amber-400 font-bold flex items-center justify-center text-xl sm:text-2xl uppercase rounded-xl">
                    {selectedUser?.name?.slice(0, 2) || "US"}
                  </div>
                )}
              </div>

              <div className="text-center mt-4 space-y-1 w-full px-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Verified Profile Statement
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white break-words">
                  {selectedUser?.name || "N/A"}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm font-mono break-all">
                  {selectedUser?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5">
              <div className="bg-white/[0.02] border border-white/5 p-3.5 sm:p-4 rounded-xl flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
                  <FaIdCard size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Database ID</span>
                  <h3 className="font-mono text-[11px] sm:text-xs text-slate-300 mt-0.5 truncate select-all">
                    {selectedUser?._id}
                  </h3>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 sm:p-4 rounded-xl flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
                  <FaCalendarAlt size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Join Date</span>
                  <h3 className="font-bold text-slate-200 mt-0.5 text-xs sm:text-sm truncate">
                    {selectedUser?.createdAt 
                      ? new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : "Not Tracked"}
                  </h3>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3 sm:col-span-2 justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0">
                    <FaUserShield size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Security Level</span>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-200 capitalize mt-0.5">
                      System Authorization
                    </h3>
                  </div>
                </div>
                <div className="self-start sm:self-auto pl-11 sm:pl-0">
                  {getRoleBadge(selectedUser?.role)}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =============================== */}
      {/* Premium Delete Confirmation Modal */}
      {/* =============================== */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={closeDeleteModal}
          ></div>

          <div className="relative w-full max-w-md bg-[#0c102b] border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-200 transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                <FaExclamationTriangle size={18} className="animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                  Purge Profile Account
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Are you absolutely sure you want to completely purge execution data for <span className="text-slate-200 font-semibold">{deleteModal.userName}</span>? This will permanently restrict access logs for <span className="text-red-400 font-mono break-all text-[11px] sm:text-xs block mt-1">{deleteModal.userEmail}</span>.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={closeDeleteModal}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-600/30 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}