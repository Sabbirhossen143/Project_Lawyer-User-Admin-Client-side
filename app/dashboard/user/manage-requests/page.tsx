"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getRequests, deleteRequest, } from "@/services/hireRequests";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  useState,
  useEffect,
  useRef,
} from "react";

export default function ManageRequestsPage() {

const { user } = useContext(AuthContext);
const [openFilter, setOpenFilter] =
  useState(false);

  const filterRef =
  useRef<HTMLDivElement>(null);

const [selectedRequest,
setSelectedRequest] =
useState<any>(null);

const [deleteRequestData,
setDeleteRequestData] =
useState<any>(null);

const [searchTerm, setSearchTerm] =
  useState("");

const [statusFilter, setStatusFilter] =
  useState("All");

  const {
    data: requests = [],
    isLoading,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  });


const queryClient = useQueryClient();

const myRequests = requests.filter(
  (request: any) =>
    request.userEmail === user?.email
);
  const filteredRequests =
  myRequests.filter(
    (request: any) => {

      const matchesSearch =
        request.lawyerName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        request.userEmail
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "All"
          ? true
          : request.status ===
            statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  const handleDelete =
async () => {

  if (!deleteRequestData)
    return;

  await deleteRequest(
    deleteRequestData._id
  );

  toast.success(
    "Request Deleted"
  );

  setDeleteRequestData(null);

  queryClient.invalidateQueries({
    queryKey: ["requests"],
  });
};

  useEffect(() => {
  const handleClickOutside = (
    event: MouseEvent
  ) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(
        event.target as Node
      )
    ) {
      setOpenFilter(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  if (isLoading) {
    return (
      <p className="text-white p-8">
        Loading...
      </p>
    );
  }

  return (
  <div className="p-4 md:p-8">
  {/* Header Section */}
  <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">My Requests</h1>

  {/* Search & Filter Section */}
  <div className="flex flex-col md:flex-row gap-4 mb-8">
    <input
      type="text"
      placeholder="Search lawyer..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 px-5 py-3 rounded-2xl bg-[#0B1220] border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
    />

    <div ref={filterRef} className="relative w-full md:w-56">
      <button
        onClick={() => setOpenFilter(!openFilter)}
        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-[#0B1220] border border-slate-700 text-white hover:border-amber-500/40 transition-all duration-300"
      >
        <span className={statusFilter === "All" ? "text-slate-400" : "text-amber-400"}>
          {statusFilter}
        </span>
        <span className={`text-amber-400 transition-transform duration-300 ${openFilter ? "rotate-180" : ""}`}>▼</span>
      </button>

      {openFilter && (
        <div className="absolute top-full mt-2 w-full rounded-2xl border border-slate-700 bg-[#0B1220] overflow-hidden shadow-xl z-50">
          {["All", "Pending", "Approved", "Rejected"].map((item) => (
            <button
              key={item}
              onClick={() => { setStatusFilter(item); setOpenFilter(false); }}
              className={`w-full text-left px-5 py-3 transition-all ${statusFilter === item ? "bg-amber-500/15 text-amber-400" : "text-slate-200 hover:bg-amber-500/10 hover:text-amber-400"}`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Requests List Section */}
  <div className="space-y-4">
    {filteredRequests.length === 0 && (
      <div className="bg-[#0B1220] border border-slate-700 rounded-3xl p-10 text-center">
        <h3 className="text-white text-xl font-semibold">No Requests Found</h3>
        <p className="text-slate-400 mt-2">Try another search or filter.</p>
      </div>
    )}

    {filteredRequests.map((request: any) => (
      <div
        key={request._id}
        className="bg-[#0B1220] border border-slate-700 hover:border-amber-500/30 transition-all duration-300 rounded-3xl p-5"
      >
        {/* Card Layout: Column on mobile, Row on desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">{request.lawyerName}</h3>
            <p className="text-slate-400 text-sm">{request.userEmail}</p>
            <p className="text-slate-500 text-xs mt-1 bg-slate-900 inline-block px-2 py-0.5 rounded">{request.caseType}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                request.status === "Approved" ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                request.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                "bg-orange-500/10 text-orange-400 border-orange-500/20"
              }`}
            >
              {request.status}
            </span>

            <button
              onClick={() => setSelectedRequest(request)}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/50 text-white hover:border-amber-500/50 transition"
            >
              Details
            </button>

            {request.status === "Pending" && (
              <button
                onClick={() => setDeleteRequestData(request)}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>


{selectedRequest && (
  <div
    onClick={() => setSelectedRequest(null)}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-xl bg-[#0B1220]/90 border border-slate-700/50 rounded-[2rem] p-6 shadow-2xl backdrop-blur-2xl max-h-[85vh] overflow-y-auto 
      scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent hover:scrollbar-thumb-amber-500/40"
    >
      {/* Header with Glass effect */}
      <div className="flex items-center justify-between mb-4 md:mb-8 sticky top-0 bg-[#0B1220]/95 backdrop-blur-sm py-2 z-10 border-b border-white/5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Request Details
          </h2>
          <p className="text-amber-500/80 text-[10px] uppercase tracking-[0.2em] font-semibold mt-1">
            Case Information
          </p>
        </div>
        <button
          onClick={() => setSelectedRequest(null)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
        >
          ✕
        </button>
      </div>

      {/* Grid Content with improved cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
  {/* Lawyer, User, Email (Email full width on mobile/desktop) */}
  {[
    { label: "Lawyer Name", value: selectedRequest.lawyerName },
    { label: "User Name", value: selectedRequest.userName },
  ].map((item, idx) => (
    <div key={idx} className="bg-[#1a2234] border border-slate-600/50 p-3 rounded-2xl hover:border-amber-500/50 transition-all shadow-lg">
  <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">{item.label}</p>
  <p className="font-semibold text-sm text-white">{item.value}</p>
</div>
  ))}

  {/* Email (Full width) */}
  <div className="md:col-span-2 bg-white/5 border border-white/5 p-3 rounded-2xl hover:border-amber-500/20 transition-colors">
    <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">User Email</p>
    <p className="font-medium text-sm text-cyan-400 break-all">{selectedRequest.userEmail}</p>
  </div>

  {/* Case Type & Status (Combined in one line) */}
  <div className="md:col-span-2 grid grid-cols-2 gap-4">
    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Case Type</p>
      <p className="font-medium text-sm text-white">{selectedRequest.caseType}</p>
    </div>
    
    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col justify-center">
      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Status</p>
      <div className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold inline-flex items-center border self-start ${
        selectedRequest.status === "Approved" ? "bg-green-500/10 text-green-400 border-green-500/20" :
        selectedRequest.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
        "bg-amber-500/10 text-amber-400 border-amber-500/20"
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
        {selectedRequest.status}
      </div>
    </div>
  </div>
</div>

      {/* Description Section */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-amber-500/80 uppercase tracking-widest mb-3">Case Description</h3>
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
          <p className="text-slate-300 leading-relaxed text-sm italic">
            "{selectedRequest.message}"
          </p>
        </div>
      </div>
    </div>
  </div>
)}



{deleteRequestData && (
  <div
    className="
    fixed
    inset-0
    bg-black/70
    flex
    items-center
    justify-center
    z-50
    "
  >
    <div
      className="
      w-full
      max-w-md
      bg-[#0B1220]
      border
      border-red-500/20
      rounded-3xl
      p-6
      "
    >
      <h3
        className="
        text-2xl
        font-bold
        text-white
        mb-3
        "
      >
        Delete Request?
      </h3>

      <p className="text-slate-400">
        This action cannot be
        undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setDeleteRequestData(
              null
            )
          }
          className="
          px-4
          py-2
          rounded-xl
          border
          border-slate-700
          text-slate-300
          hover:bg-slate-700
          "
        >
          Cancel
        </button>

        <button
          onClick={
            handleDelete
          }
          className="
          px-4
          py-2
          rounded-xl
          bg-red-500/15
          text-red-400
          border
          border-red-500/20
          hover:bg-red-500/40
          
          "
        >
          Delete
        </button>

      </div>
    </div>
  </div>
)}


    </div>
  );
}