"use client";

import { useQuery } from "@tanstack/react-query";
import { getLawyerRequests, updateRequestStatus } from "@/services/hireRequests";
import { useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

export default function LawyerHiringHistoryPage() {
  const { user } = useContext(AuthContext);

  const { data: requests = [], refetch, isLoading } = useQuery({
    queryKey: ["lawyerRequests", user?.email],
    queryFn: () => getLawyerRequests(user!.email!),
    enabled: !!user?.email,
  });

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateRequestStatus(id, status);
      toast.success(`Request ${status} successfully`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  if (isLoading) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 w-full">
          <FaSpinner className="animate-spin text-amber-500" size={32} />
          <p className="text-slate-400 text-sm font-medium">Loading requests history...</p>
        </div>
      );
  }

  return (
    <div
      className="
      min-h-screen
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
      from-[#0f172a]
      via-[#05070f]
      to-[#020408]
      p-4
      sm:p-6
      md:p-10
      space-y-6
      md:space-y-8
      "
    >
      {/* Header Section */}
      <div className="bg-slate-900/20 backdrop-blur-md border border-slate-800/60 rounded-[2rem] p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <span
          className="
          inline-flex
          items-center
          gap-2
          px-4
          py-1.5
          rounded-full
          bg-gradient-to-r
          from-amber-500/10
          to-amber-600/5
          border
          border-amber-500/30
          text-amber-400
          text-xs
          font-semibold
          tracking-wide
          uppercase
          mb-4
          "
        >
          💼 Client Management
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          Hiring Requests <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">History</span>
        </h1>
        <p className="text-slate-400 mt-2 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
          Review incoming hiring requests, approve potential clients, and manage your legal consultations efficiently.
        </p>
      </div>

      {/* History Table Card */}
      <div
        className="
        bg-slate-900/20
        backdrop-blur-md
        border
        border-slate-800/60
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        hover:shadow-[0_20px_40px_rgba(245,158,11,0.03)]
        rounded-[2rem]
        overflow-hidden
        transition-all
        duration-500
        "
      >
        {/* Table wrapper tailored for swipe/horizontal scroll on smaller views */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full border-collapse min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                <th className="p-4 md:p-5 text-left">Client</th>
                <th className="p-4 md:p-5 text-left">Case Type</th>
                <th className="p-4 md:p-5 text-left">Date</th>
                <th className="p-4 md:p-5 text-left">Status</th>
                <th className="p-4 md:p-5 text-center">Action</th>
                <th className="p-4 md:p-5 text-center">Payment Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-900/60 text-sm whitespace-nowrap">
              {requests.map((request: any) => (
                <tr
                  key={request._id}
                  className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors duration-300"
                >
                  {/* Client Info */}
                  <td className="p-4 md:p-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-slate-200 font-bold tracking-tight text-sm sm:text-base max-w-[150px] sm:max-w-none truncate">
                        {request.userName}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedUser(request);
                          setOpenProfileModal(true);
                        }}
                        className="
                        px-2.5
                        sm:px-3
                        py-1
                        rounded-xl
                        border
                        border-amber-500/30
                        bg-amber-500/5
                        text-amber-400
                        text-xs
                        font-medium
                        hover:bg-amber-500/20
                        hover:border-amber-500/60
                        transition-all
                        duration-300
                        flex-shrink-0
                        "
                      >
                        View Profile
                      </button>
                    </div>
                  </td>

                  {/* Case Type */}
                  <td className="p-4 md:p-5 text-slate-300 font-medium">{request.caseType}</td>

                  {/* Date */}
                  <td className="p-4 md:p-5 text-slate-500 font-medium">
                    {new Date(request.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>

                  {/* Request Status */}
                  <td className="p-4 md:p-5">
                    <span
                      className={`
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${
                        request.status === "Approved" || request.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : request.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }
                      `}
                    >
                      {request.status || "Pending"}
                    </span>
                  </td>

                  {/* Actions (Accept / Reject) */}
                  <td className="p-4 md:p-5">
                    <div className="flex justify-center gap-2 sm:gap-3">
                      <button
                        disabled={request.status === "Approved" || request.status === "Paid" || request.status === "Rejected"}
                        onClick={() => handleStatus(request._id, "Approved")}
                        className="
                        px-3
                        sm:px-4
                        py-1.5
                        text-xs
                        font-bold
                        rounded-xl
                        bg-slate-900/90
                        border
                        border-emerald-500/30
                        text-emerald-400
                        shadow-md
                        shadow-emerald-950/20
                        hover:bg-emerald-500
                        hover:text-slate-950
                        hover:border-emerald-500
                        hover:shadow-emerald-500/20
                        disabled:opacity-20
                        disabled:pointer-events-none
                        disabled:cursor-not-allowed
                        transition-all
                        duration-300
                        "
                      >
                        Accept
                      </button>

                      <button
                        disabled={request.status === "Approved" || request.status === "Paid" || request.status === "Rejected"}
                        onClick={() => handleStatus(request._id, "Rejected")}
                        className="
                        px-3
                        sm:px-4
                        py-1.5
                        text-xs
                        font-bold
                        rounded-xl
                        bg-slate-900/90
                        border
                        border-rose-500/30
                        text-rose-400
                        shadow-md
                        shadow-rose-950/20
                        hover:bg-rose-500
                        hover:text-slate-950
                        hover:border-rose-500
                        hover:shadow-rose-500/20
                        disabled:opacity-20
                        disabled:pointer-events-none
                        disabled:cursor-not-allowed
                        transition-all
                        duration-300
                        "
                      >
                        Reject
                      </button>
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td className="p-4 md:p-5 text-center">
                    {request.status === "Paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ✅ Paid
                      </span>
                    ) : request.status === "Approved" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
                        Waiting For Payment
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-950/60 text-slate-500 border border-slate-900">
                        Not Accepted
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 sm:p-16 text-center text-slate-500 font-medium italic">
                    No hiring requests found at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Profile Modal */}
      {openProfileModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="
            relative
            w-full
            max-w-lg
            max-h-[90vh]
            overflow-y-auto
            rounded-[2rem]
            md:rounded-[2.5rem]
            bg-slate-900/95
            backdrop-blur-xl
            border
            border-slate-800
            shadow-[0_25px_60px_rgba(0,0,0,0.7)]
            p-5
            sm:p-6
            md:p-8
            "
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="pr-4">
                <p className="text-amber-400 text-[10px] tracking-[4px] uppercase font-bold">
                  ✨ Client Profile
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1 tracking-tight break-all">
                  {selectedUser?.userName}
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Legal Consultation Identity Details
                </p>
              </div>

              <button
                onClick={() => setOpenProfileModal(false)}
                className="
                h-9
                w-9
                flex
                items-center
                justify-center
                rounded-xl
                bg-slate-950
                border
                border-slate-800
                text-slate-400
                hover:bg-rose-500/10
                hover:border-rose-500/30
                hover:text-rose-400
                transition-all
                duration-300
                flex-shrink-0
                "
              >
                ✕
              </button>
            </div>

            {/* Meta Data Grid */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/60 pb-3 gap-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">📧 Email Address</span>
                <span className="text-amber-400 text-sm font-medium text-left break-all">{selectedUser?.userEmail}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/60 pb-3 gap-1">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">🆔 Case Reference</span>
                <span className="text-slate-400 text-xs break-all text-left font-mono max-w-full sm:max-w-[200px]">{selectedUser?._id}</span>
              </div>

              <div className="flex justify-between items-center pt-1 gap-2">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">⚖️ Case Type</span>
                <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 text-xs font-bold break-all">
                  {selectedUser?.caseType}
                </span>
              </div>
            </div>

            {/* Client Statement/Message */}
            <div className="mt-5 rounded-2xl border border-amber-500/10 bg-amber-500/[0.01] p-4">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>📝 Client Brief Statement</span>
              </p>
              <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap bg-slate-950/60 p-3 rounded-xl border border-slate-800 max-h-[150px] overflow-y-auto">
                {selectedUser?.message || "No custom message provided by the client."}
              </p>
            </div>

            {/* Status Section */}
            <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Current Status
              </span>
              <span
                className={`
                px-4
                py-1
                rounded-full
                text-xs
                font-bold
                border
                ${
                  selectedUser?.status === "Approved" || selectedUser?.status === "Paid"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : selectedUser?.status === "Rejected"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }
                `}
              >
                {selectedUser?.status || "Pending"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}