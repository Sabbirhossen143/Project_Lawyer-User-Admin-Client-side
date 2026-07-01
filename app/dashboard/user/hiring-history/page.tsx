"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserRequests } from "@/services/hireRequests";
import { useContext, useState, useMemo } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";
import { updateRequestStatus } from "@/services/hireRequests";
import { createTransaction } from "@/services/transactions";
import { FaChevronDown, FaHistory, FaUserTie, FaCoins, FaCalendarAlt, FaBriefcase, FaTimes, FaCheck, FaSpinner } from "react-icons/fa";

export default function MyRequestsPage() {
  const { user } = useContext(AuthContext);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [openStatus, setOpenStatus] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRequests", user?.email],
    enabled: !!user?.email,
    queryFn: () => getUserRequests(user.email),
  });

  const filteredRequests = useMemo(() => {
    let data = [...requests];
    if (statusFilter !== "All") {
      data = data.filter((item: any) => item.status === statusFilter);
    }
    data.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
    return data;
  }, [requests, statusFilter, sortOrder]);

  const handlePayment = async () => {
    try {
      setIsProcessingPay(true);
      await createTransaction({
        requestId: selectedRequest._id,
        lawyerEmail: selectedRequest.lawyerEmail,
        userEmail: user?.email,
        userName: user?.displayName,
        lawyerName: selectedRequest.lawyerName,
        amount: selectedRequest.fee,
      });

      await updateRequestStatus(selectedRequest._id, "Paid");
      toast.success("Payment Successful! 🎉");
      setOpenModal(false);
      refetch();
    } catch (error) {
      toast.error("Payment Failed");
    } finally {
      setIsProcessingPay(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 w-full">
        <FaSpinner className="animate-spin text-amber-500" size={32} />
        <p className="text-slate-400 text-sm font-medium">Loading requests history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* --- Top Navbar Section --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/[0.06] pb-6 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
              <FaHistory className="text-amber-500/80 text-2xl sm:text-3xl shrink-0" />
              Hiring History
              <span className="text-amber-400 text-xl font-bold bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/20">
                {requests.length}
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1.5">
              Monitor, audit, and complete payments for your professional appointments.
            </p>
          </div>

          {/* Filters/Sorting Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <button
                onClick={() => { setOpenStatus(!openStatus); setOpenSort(false); }}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] hover:border-white/[0.15] text-white text-xs font-bold flex justify-between items-center transition-all duration-300 shadow-md"
              >
                <span className="text-slate-400 mr-1.5">Status:</span> {statusFilter}
                <FaChevronDown className={`ml-2 text-slate-500 transition-transform duration-300 ${openStatus ? "rotate-180 text-amber-500" : ""}`} size={10} />
              </button>

              {openStatus && (
                <div className="absolute right-0 mt-2 w-full bg-[#0b0f19] border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl animate-fade-in">
                  {["All", "Pending", "Approved", "Rejected", "Paid"].map((item) => (
                    <button
                      key={item}
                      onClick={() => { setStatusFilter(item); setOpenStatus(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold transition-all ${statusFilter === item ? "bg-amber-500/10 text-amber-400" : "text-slate-300 hover:bg-white/[0.02]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Order */}
            <div className="relative flex-1 sm:flex-initial min-w-[150px]">
              <button
                onClick={() => { setOpenSort(!openSort); setOpenStatus(false); }}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] hover:border-white/[0.15] text-white text-xs font-bold flex justify-between items-center transition-all duration-300 shadow-md"
              >
                <span className="text-slate-400 mr-1.5">Sort:</span> {sortOrder === "Newest" ? "Newest First" : "Oldest First"}
                <FaChevronDown className={`ml-2 text-slate-500 transition-transform duration-300 ${openSort ? "rotate-180 text-amber-500" : ""}`} size={10} />
              </button>

              {openSort && (
                <div className="absolute right-0 mt-2 w-full bg-[#0b0f19] border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl animate-fade-in">
                  {["Newest", "Oldest"].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setSortOrder(type); setOpenSort(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold transition-all ${sortOrder === type ? "bg-amber-500/10 text-amber-400" : "text-slate-300 hover:bg-white/[0.02]"}`}
                    >
                      {type === "Newest" ? "Newest First" : "Oldest First"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Requests Render Container --- */}
        <div className="space-y-4">
          {filteredRequests.length === 0 && (
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-12 text-center shadow-xl">
              <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserTie className="text-slate-600" size={24} />
              </div>
              <h2 className="text-white text-lg font-bold">No Records Identified</h2>
              <p className="text-slate-500 text-xs mt-1.5 max-w-sm mx-auto">
                There are no legal hire requests matches your specified filter parameters.
              </p>
            </div>
          )}

          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="relative bg-[#0a0f1d] border border-white/[0.12] hover:border-amber-500/40 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.06)] transition-all duration-300 rounded-2xl p-5 sm:p-6 group overflow-hidden"
            >
              {/* Premium Inner Glow Gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] via-transparent to-transparent pointer-events-none" />
              
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 z-10">
                
                {/* Left Metadata Info Block */}
                <div className="space-y-2.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                      {request.lawyerName}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                      <FaBriefcase size={9} className="text-amber-500" />
                      {request.specialty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-400">
                    <p className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-sm">
                      <FaCoins size={12} className="opacity-80" />
                      ৳ {request.fee}
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <FaCalendarAlt size={12} className="opacity-50" />
                      Hired On: {new Date(request.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Right Action Trigger Block */}
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-white/[0.04] pt-4 sm:pt-0 sm:border-none shrink-0">
                  <div className="sm:text-right hidden sm:block mr-2">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Verification Status</p>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link
                      href={`/lawyers/${request.lawyerId}`}
                      className="px-4 py-2 rounded-xl text-xs font-black tracking-wide border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-300"
                    >
                      View Profile
                    </Link>

                    <span
                      className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wide border ${
                        request.status === "Approved" || request.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.05)]"
                          : request.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_2px_10px_rgba(244,63,94,0.05)]"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_2px_10px_rgba(249,115,22,0.05)]"
                      }`}
                    >
                      {request.status}
                    </span>

                    {request.status === "Approved" && (
                      <Link
                         href={`/dashboard/user/payment/${request._id}`}
                        className="px-4 py-2 rounded-xl text-xs font-black tracking-wide bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.35)] transform hover:-translate-y-0.5 active:translate-y-0 animate-pulse"
                      >
                        Pay Now
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* --- Premium Glassmorphic Payment Modal --- */}
      {openModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-[#0f1626] to-[#070b14] border border-white/[0.08] rounded-3xl p-6 w-full max-w-md shadow-2xl relative transform scale-100 transition-transform duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-4 mb-4">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <FaCoins className="text-emerald-400" size={16} />
                Confirm Payment
              </h2>
              <button
                onClick={() => setOpenModal(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white transition"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 mb-6 space-y-3">
              <p className="text-slate-400 text-sm leading-relaxed">
                You are authorizing a wire remittance of <span className="text-emerald-400 font-bold">৳{selectedRequest?.fee}</span> directly to:
              </p>
              <div className="border-t border-white/[0.05] pt-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <FaUserTie size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Appointed Counsel</p>
                  <p className="text-sm font-bold text-white truncate">{selectedRequest?.lawyerName}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setOpenModal(false)}
                disabled={isProcessingPay}
                className="flex-1 py-3 rounded-xl border border-white/[0.08] text-slate-400 hover:bg-white/[0.02] hover:text-white font-bold text-xs tracking-wider uppercase transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessingPay}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-slate-800 disabled:to-slate-900 text-slate-950 disabled:text-slate-600 font-black text-xs tracking-wider uppercase transition shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                {isProcessingPay ? (
                  <>
                    <FaSpinner className="animate-spin" size={12} />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheck size={11} />
                    Confirm Pay
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}