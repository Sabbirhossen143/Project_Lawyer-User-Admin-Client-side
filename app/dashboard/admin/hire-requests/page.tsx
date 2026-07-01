"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosPublic from "@/lib/axios";
import { 
  FaFileContract, 
  FaRegClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaTrashAlt, 
  FaSearch, 
  FaFolder, 
  FaCoins, 
  FaSuitcase,
  FaExclamationTriangle
} from "react-icons/fa";

export default function HireRequestsPage() {
  // Search state variables
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state variables
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Premium Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "delete" | null;
    id: string | null;
    title: string;
    message: string;
    actionColor: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: "",
    message: "",
    actionColor: ""
  });

  // Fetching Data with refetch
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["hire-requests"],
    queryFn: async () => {
      const res = await axiosPublic.get("/hire-requests");
      return res.data;
    },
  });

  // Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axiosPublic.patch(`/hire-requests/${id}`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      refetch();
      if (selectedRequest && selectedRequest._id === variables.id) {
        setSelectedRequest((prev: any) => prev ? { ...prev, status: variables.status } : null);
      }
      closeConfirmModal();
    },
    onError: (error) => console.error("Error updating status:", error),
  });

  // Delete Request Mutation
  const deleteRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosPublic.delete(`/hire-requests/${id}`);
      return res.data;
    },
    onSuccess: () => {
      refetch();
      setSelectedRequest(null);
      closeConfirmModal();
    },
    onError: (error) => console.error("Error deleting request:", error),
  });

  // --- Premium Confirmation Trigger Functions ---
  const triggerApproveConfirm = (id: string) => {
    setConfirmModal({
      isOpen: true,
      type: "approve",
      id,
      title: "Approve Hire Request",
      message: "Are you sure you want to approve this hire request? This will progress the client workflow forward.",
      actionColor: "bg-emerald-500 hover:bg-emerald-600 text-slate-950 focus:ring-emerald-500/30"
    });
  };

  const triggerRejectConfirm = (id: string) => {
    setConfirmModal({
      isOpen: true,
      type: "reject",
      id,
      title: "Reject Hire Request",
      message: "Are you sure you want to reject this hire request? The client will see this log updated as rejected.",
      actionColor: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/30"
    });
  };

  const triggerDeleteConfirm = (id: string) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      id,
      title: "Delete Request Permanently",
      message: "Warning: This action is irreversible. It will wipe this log completely from the management console database.",
      actionColor: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-600/30"
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleExecuteAction = () => {
    if (!confirmModal.id || !confirmModal.type) return;

    if (confirmModal.type === "approve") {
      updateStatusMutation.mutate({ id: confirmModal.id, status: "approved" });
    } else if (confirmModal.type === "reject") {
      updateStatusMutation.mutate({ id: confirmModal.id, status: "rejected" });
    } else if (confirmModal.type === "delete") {
      deleteRequestMutation.mutate(confirmModal.id);
    }
  };

  // --- Calculations for Summary Cards ---
  const totalRequests = requests.length;
  
  const pendingRequests = requests.filter(
    (r: any) => r.status?.toLowerCase() === "pending"
  ).length;

  const approvedRequests = requests.filter(
    (r: any) => r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "paid" || r.status?.toLowerCase() === "completed"
  ).length;

  const rejectedRequests = requests.filter(
    (r: any) => r.status?.toLowerCase() === "rejected"
  ).length;

  // --- Client Side Search Filter ---
  const filteredRequests = requests.filter((request: any) => {
    const clientName = request.userName?.toLowerCase() || "";
    const lawyerName = request.lawyerName?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return clientName.includes(query) || lawyerName.includes(query);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-xl sm:text-2xl mt-0.5">
            <FaFileContract className="text-amber-500 animate-pulse" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hire Requests Management
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Monitor stats, inspect full request details, approve/reject workflow, or delete logs.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            placeholder="Search user or lawyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition shadow-inner"
          />
        </div>
      </div>

      {/* --- Summary Cards Section (Updated grid-cols-2 for small screen) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { title: "Total Requests", count: totalRequests, icon: <FaFolder />, style: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { title: "Pending", count: pendingRequests, icon: <FaRegClock />, style: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { title: "Approved / Paid", count: approvedRequests, icon: <FaCheckCircle />, style: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { title: "Rejected", count: rejectedRequests, icon: <FaTimesCircle />, style: "text-red-400 bg-red-500/10 border-red-500/20" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3 sm:p-5 flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 shadow-lg hover:border-white/10 transition duration-300">
            <div className={`h-9 w-9 sm:h-12 sm:w-12 rounded-xl border flex items-center justify-center text-sm sm:text-lg shrink-0 ${item.style}`}>
              {item.icon}
            </div>
            <div className="min-w-0 w-full">
              <p className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">{item.title}</p>
              <h3 className={`text-lg sm:text-2xl font-black mt-0.5 ${idx === 0 ? "text-slate-100" : idx === 1 ? "text-amber-400" : idx === 2 ? "text-emerald-400" : "text-red-400"}`}>{item.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Glass Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md shadow-xl w-full">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[950px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-white/[0.01]">
                <th className="px-4 sm:px-6 py-4 font-bold">Client</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Lawyer</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Case Type</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Fee</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Date</th>
                <th className="px-4 sm:px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 sm:px-6 py-12 text-center text-slate-500 font-medium text-xs sm:text-sm">
                    No match or hire requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request: any) => {
                  const currentStatus = request.status?.toLowerCase() || "pending";

                  return (
                    <tr key={request._id} className="text-slate-300 hover:bg-white/[0.02] transition group">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 text-xs sm:text-sm group-hover:text-amber-400 transition truncate max-w-[150px] sm:max-w-none">
                            {request.userName || "Unknown Client"}
                          </p>
                          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono truncate max-w-[150px] sm:max-w-none">
                            {request.userEmail}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4">
                        <p className="font-semibold text-slate-200 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{request.lawyerName || "N/A"}</p>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono truncate max-w-[150px] sm:max-w-none">{request.lawyerEmail}</p>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-[11px] sm:text-xs font-medium text-slate-300 capitalize">
                          {request.caseType || "General"}
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4 font-bold text-emerald-400 whitespace-nowrap">
                        ৳ {(request.fee || 0).toLocaleString()}
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {currentStatus === "approved" || currentStatus === "paid" || currentStatus === "completed" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                            <FaCheckCircle className="text-[10px] sm:text-[11px]" />
                            {request.status}
                          </span>
                        ) : currentStatus === "rejected" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 capitalize">
                            <FaTimesCircle className="text-[10px] sm:text-[11px]" />
                            {request.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize">
                            <FaRegClock className="text-[10px] sm:text-[11px]" />
                            {request.status || "pending"}
                          </span>
                        )}
                      </td>

                      <td className="px-4 sm:px-6 py-4 text-slate-400 text-[11px] sm:text-xs font-medium whitespace-nowrap">
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}
                      </td>

                      {/* --- Actions --- */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="p-2 text-xs rounded-lg bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
                            title="View Details"
                          >
                            <FaEye size={12} />
                          </button>

                          {currentStatus === "pending" && (
                            <>
                              <button
                                onClick={() => triggerApproveConfirm(request._id)}
                                className="px-2.5 py-1.5 text-[11px] sm:text-xs rounded-lg font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 hover:border-transparent active:scale-95 transition-all cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => triggerRejectConfirm(request._id)}
                                className="px-2.5 py-1.5 text-[11px] sm:text-xs rounded-lg font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-transparent active:scale-95 transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => triggerDeleteConfirm(request._id)}
                            className="p-2 text-xs rounded-lg bg-red-500/5 text-red-400/80 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                            title="Delete Request"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Premium Details Modal Wrapper --- */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedRequest(null)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-[#090d22]/95 border border-white/10 rounded-2xl p-5 md:p-8 shadow-2xl text-slate-200 transform transition-all duration-300 scale-100 opacity-100 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-4 sm:pr-6">
            <button 
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition z-10 cursor-pointer"
            >
              ✕
            </button>

            <div className="border-b border-white/10 pb-4 mb-5">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <FaSuitcase className="text-amber-500" />
                Hire Request Details
              </h3>
              <p className="text-slate-500 text-[10px] sm:text-xs mt-1 font-mono break-all">ID: {selectedRequest._id}</p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                
                {/* Block 1: Client Info */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 truncate">Client Info</span>
                  <p className="font-bold text-slate-200 text-xs sm:text-base truncate">{selectedRequest.userName || "Unknown Client"}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-0.5 truncate">{selectedRequest.userEmail}</p>
                </div>

                {/* Block 2: Lawyer Info */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 truncate">Lawyer Info</span>
                  <p className="font-bold text-slate-200 text-xs sm:text-base truncate">{selectedRequest.lawyerName || "N/A"}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-0.5 truncate">{selectedRequest.lawyerEmail}</p>
                </div>

                {/* Block 3: Case Category */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 truncate">Case Category</span>
                  <p className="font-bold text-xs sm:text-sm text-slate-200 capitalize truncate">{selectedRequest.caseType || "General"}</p>
                </div>

                {/* Block 4: Proposed Fee */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 truncate">Proposed Fee</span>
                  <p className="font-extrabold text-xs sm:text-sm text-emerald-400 flex items-center gap-1 truncate">
                    <FaCoins className="text-[10px] sm:text-xs text-emerald-500 shrink-0" />
                    ৳{(selectedRequest.fee || 0).toLocaleString()}
                  </p>
                </div>

                {/* Description Element block takes up 2 full space tracks underneath */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4 col-span-2 space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Client Description / Message</span>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1.5 bg-black/20 rounded-lg p-3 border border-white/[0.02] scrollbar-thin scrollbar-thumb-white/5">
                    {selectedRequest.message || "No specific message statement attached to this proposal request."}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-5 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs text-slate-500">Workflow Status:</span>
                <span className="capitalize text-[10px] sm:text-xs font-black bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-amber-400">
                  {selectedRequest.status}
                </span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {selectedRequest.status?.toLowerCase() === "pending" && (
                  <>
                    <button
                      onClick={() => triggerApproveConfirm(selectedRequest._id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition cursor-pointer whitespace-nowrap"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => triggerRejectConfirm(selectedRequest._id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition cursor-pointer whitespace-nowrap"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => triggerDeleteConfirm(selectedRequest._id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer whitespace-nowrap"
                >
                  Delete Log
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- Global Premium Action Confirmation Modal --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={closeConfirmModal}
          ></div>

          <div className="relative w-full max-w-md bg-[#0c102b] border border-white/10 rounded-2xl p-5 sm:p-6 text-slate-200 transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 border ${confirmModal.type === "approve" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                <FaExclamationTriangle size={18} className={confirmModal.type === "approve" ? "" : "animate-bounce"} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                  {confirmModal.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={closeConfirmModal}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-lg active:scale-95 focus:outline-none focus:ring-2 cursor-pointer ${confirmModal.actionColor}`}
              >
                {confirmModal.type === "approve" ? "Confirm Approval" : confirmModal.type === "reject" ? "Confirm Rejection" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}