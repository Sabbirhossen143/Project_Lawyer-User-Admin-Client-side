"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import axiosPublic from "@/lib/axios";
import toast from "react-hot-toast";

import {
  FaGavel,
  FaSearch,
  FaTrash,
  FaTimes,
  FaSuitcase,
  FaCoins,
  FaGraduationCap,
  FaInfoCircle,
  FaExclamationTriangle
} from "react-icons/fa";

export default function ManageLawyersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom Premium Delete Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    lawyerId: string | null;
    lawyerName: string | null;
    lawyerEmail: string | null;
  }>({
    isOpen: false,
    lawyerId: null,
    lawyerName: null,
    lawyerEmail: null
  });

  // =================================
  // Fetch Lawyers
  // =================================
  const { data: lawyers = [], isLoading } = useQuery({
    queryKey: ["manage-lawyers"],
    queryFn: async () => {
      const res = await axiosPublic.get("/lawyers");
      return res.data;
    },
  });

  // =================================
  // Delete Lawyer
  // =================================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosPublic.delete(`/lawyers/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lawyer deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["manage-lawyers"],
      });
      closeDeleteModal();
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  // --- Confirmation Handlers ---
  const triggerDeleteConfirm = (id: string, name: string, email: string) => {
    setDeleteConfirmModal({
      isOpen: true,
      lawyerId: id,
      lawyerName: name,
      lawyerEmail: email
    });
  };

  const closeDeleteModal = () => {
    setDeleteConfirmModal({
      isOpen: false,
      lawyerId: null,
      lawyerName: null,
      lawyerEmail: null
    });
  };

  const handleExecuteDelete = () => {
    if (deleteConfirmModal.lawyerId) {
      deleteMutation.mutate(deleteConfirmModal.lawyerId);
    }
  };

  // =================================
  // Search Filter
  // =================================
  const filteredLawyers = useMemo(() => {
    return lawyers.filter(
      (lawyer: any) =>
        lawyer.name?.toLowerCase().includes(search.toLowerCase()) ||
        lawyer.email?.toLowerCase().includes(search.toLowerCase()) ||
        lawyer.specialization?.toLowerCase().includes(search.toLowerCase())
    );
  }, [lawyers, search]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 relative w-full max-w-full overflow-x-hidden">

      {/* =============================== */}
      {/* Header */}
      {/* =============================== */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
              <FaGavel size={20} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
                Manage Lawyers
              </h1>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm max-w-xl">
                Manage lawyer profiles, platform access and account status.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search lawyers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* =============================== */}
      {/* Stats - Updated Mobile-Friendly Grid */}
      {/* =============================== */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            title: "Total Lawyers",
            count: lawyers.length,
            style: "bg-purple-500/10 border-purple-500/20 text-purple-400",
            mobileSpan: "col-span-2 sm:col-span-1"
          },
          {
            title: "Active Lawyers",
            count: lawyers.length,
            style: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            mobileSpan: "col-span-1"
          },
          {
            title: "Lawyer Profiles",
            count: lawyers.length,
            style: "bg-amber-500/10 border-amber-500/20 text-amber-400",
            mobileSpan: "col-span-1"
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl p-5 sm:p-6 border ${item.style} ${item.mobileSpan} shadow-lg backdrop-blur-sm relative overflow-hidden group`}
          >
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.02] text-white font-black text-7xl sm:text-9xl pointer-events-none select-none group-hover:scale-105 transition duration-500">
              {item.count}
            </div>
            <h3 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold opacity-80">
              {item.title}
            </h3>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1.5 sm:mt-2 tracking-tight">
              {item.count}
            </h2>
          </div>
        ))}
      </div>

      {/* =============================== */}
      {/* Table */}
      {/* =============================== */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden w-full">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[850px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Profile
                </th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Specialization
                </th>
                <th className="px-4 sm:px-6 py-4 text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-4 text-center text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredLawyers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-xs sm:text-sm font-medium">
                    No lawyers found.
                  </td>
                </tr>
              ) : (
                filteredLawyers.map((lawyer: any) => (
                  <tr key={lawyer._id} className="text-slate-300 hover:bg-white/[0.02] transition duration-200 group">
                    {/* Name with Profile Image */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-purple-400 font-bold uppercase shadow-inner text-xs sm:text-sm group-hover:border-purple-500/30 overflow-hidden shrink-0 transition">
                          {lawyer.image ? (
                            <img 
                              src={lawyer.image} 
                              alt={lawyer.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            lawyer.name?.slice(0, 2) || "LW"
                          )}
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-200 tracking-tight group-hover:text-purple-400 transition truncate max-w-[140px] sm:max-w-none">
                            {lawyer.name}
                          </h3>
                        </div>
                      </div>
                    </td>

                    {/* Profile */}
                    <td className="px-4 sm:px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedLawyer(lawyer);
                          setIsModalOpen(true);
                        }}
                        className="px-2.5 sm:px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-slate-950 rounded-lg border border-purple-500/20 transition-all text-[11px] sm:text-xs font-semibold cursor-pointer active:scale-95 whitespace-nowrap"
                      >
                        View
                      </button>
                    </td>

                    {/* Email */}
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-400 font-mono">
                      {lawyer.email}
                    </td>

                    {/* Specialization */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10 text-[11px] sm:text-xs font-medium capitalize">
                        {lawyer.specialty || "General Law"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] sm:text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <button
                        onClick={() => triggerDeleteConfirm(lawyer._id, lawyer.name, lawyer.email)}
                        className="p-2 bg-red-500/5 text-red-400/80 border border-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                        title="Delete Lawyer"
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
      {/* Premium Luxury Fixed View Modal */}
      {/* =============================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-[#0a0f26]/95 border border-white/10 text-slate-200 rounded-2xl p-5 md:p-8 shadow-2xl transform transition-all duration-300 scale-100 opacity-100 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-4 sm:pr-6">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition group z-10 cursor-pointer"
            >
              <FaTimes size={14} className="group-hover:rotate-90 transition duration-300" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 pb-5 border-b border-white/10">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-purple-500/30 p-1 bg-purple-500/5 shadow-xl shrink-0">
                <img
                  src={selectedLawyer?.image || "https://i.ibb.co/7QpKsCX/avatar.png"}
                  alt={selectedLawyer?.name || "Lawyer Profile"}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="text-center sm:text-left space-y-1 w-full min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Verified Legal Expert
                </span>
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white truncate">
                  {selectedLawyer?.name}
                </h2>
                <p className="text-slate-400 text-[11px] sm:text-sm font-mono truncate">
                  {selectedLawyer?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5">
              
              {/* Card 1: Specialization */}
              <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3.5 min-w-0">
                <div className="p-2 sm:p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0">
                  <FaSuitcase size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">Specialization</span>
                  <h3 className="font-bold text-[11px] sm:text-sm text-slate-200 capitalize mt-0.5 truncate">
                    {selectedLawyer?.specialty || "General Law"}
                  </h3>
                </div>
              </div>

              {/* Card 2: Experience */}
              <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3.5 min-w-0">
                <div className="p-2 sm:p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
                  <FaGraduationCap size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">Experience</span>
                  <h3 className="font-bold text-[11px] sm:text-sm text-slate-200 mt-0.5 truncate">
                    {selectedLawyer?.experience || "0"} Years
                  </h3>
                </div>
              </div>

              {/* Card 3: Consultation Fee */}
              <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3.5 min-w-0">
                <div className="p-2 sm:p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                  <FaCoins size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">Consultation Fee</span>
                  <h3 className="font-bold text-[11px] sm:text-sm text-emerald-400 mt-0.5 truncate">
                    ৳ {Number(selectedLawyer?.fee || 0).toLocaleString()}
                  </h3>
                </div>
              </div>

              {/* Card 4: Account Status */}
              <div className="bg-white/[0.02] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3.5 min-w-0">
                <div className="p-2 sm:p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">Account Status</span>
                  <h3 className="text-emerald-400 font-bold mt-0.5 text-[11px] sm:text-sm flex items-center gap-1.5 truncate">
                    Active Profile
                  </h3>
                </div>
              </div>

              {/* Biography */}
              <div className="bg-white/[0.01] border border-white/5 p-3.5 sm:p-4 rounded-xl col-span-2 space-y-2">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FaInfoCircle className="text-slate-500" /> Biography Statement
                </span>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1.5 bg-black/20 rounded-lg p-3 border border-white/[0.02] scrollbar-thin scrollbar-thumb-white/5">
                  {selectedLawyer?.bio || "No legal framework or biography summary has been written for this profile statement yet."}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  triggerDeleteConfirm(selectedLawyer._id, selectedLawyer.name, selectedLawyer.email);
                }}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition cursor-pointer"
              >
                Delete Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =============================== */}
      {/* Premium Delete Confirmation Modal */}
      {/* =============================== */}
      {deleteConfirmModal.isOpen && (
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
                  Remove {deleteConfirmModal.lawyerName || "Lawyer Profile"}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Are you entirely sure you want to permanently delete this profile? This will invalidate all legal operational access logs associated with <span className="text-red-400 font-mono break-all text-[11px] sm:text-xs">{deleteConfirmModal.lawyerEmail}</span>.
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