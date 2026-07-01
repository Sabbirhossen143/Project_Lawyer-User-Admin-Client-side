"use client";

import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/contexts/AuthContext";
import { getUserComments, deleteComment, updateComment } from "@/services/comments";
import toast from "react-hot-toast";

export default function CommentsPage() {
  const [editModal, setEditModal] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [updatedText, setUpdatedText] = useState("");
  const { user } = useContext(AuthContext);

  const { data: comments = [], refetch } = useQuery({
    queryKey: ["user-comments", user?.email],
    enabled: !!user?.email,
    queryFn: () => getUserComments(user?.email || ""),
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
          My Comments
        </h1>
        <p className="text-slate-400 mt-2">Manage your lawyer reviews and comments.</p>
      </div>

      {comments.length === 0 ? (
        <div className="bg-[#0B1220]/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 text-center">
          <h2 className="text-white text-2xl font-bold">No Comments Found</h2>
          <p className="text-slate-400 mt-2">Your comments will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comments.map((comment: any) => (
            <div key={comment._id} className="bg-[#0B1220]/50 backdrop-blur-md border border-amber-500/10 rounded-3xl p-5 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white truncate">{comment.lawyerName}</h3>
                <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {new Date(comment.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-300 text-xs leading-5 min-h-[80px]">
                {comment.comment}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setEditModal(comment); setUpdatedText(comment.comment); }}
                  className="flex-1 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all font-bold text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal(comment)}
                  className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal - Optimized for Small Screens */}
{editModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
    <div className="w-full max-w-sm bg-[#0B1220] border border-amber-500/30 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
      <h2 className="text-xl font-black text-white mb-4">Edit Comment</h2>
      
      <textarea
        value={updatedText}
        onChange={(e) => setUpdatedText(e.target.value)}
        rows={4}
        className="w-full p-4 rounded-2xl bg-slate-900/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
      />

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setEditModal(null)}
          className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await updateComment(editModal._id, updatedText);
            toast.success("Comment Updated");
            await refetch();
            setEditModal(null);
          }}
          className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-all"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

{/* Delete Modal - Optimized for Small Screens */}
{deleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div className="w-full max-w-[320px] bg-[#0B1220] border border-red-500/20 rounded-[2rem] p-6 text-center shadow-2xl">
      <div className="text-3xl mb-4">🗑</div>
      <h2 className="text-lg font-black text-white mb-2">Delete Comment?</h2>
      <p className="text-slate-400 text-xs mb-6 px-2">This action cannot be undone.</p>

      <div className="flex gap-2">
        <button
          onClick={() => setDeleteModal(null)}
          className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await deleteComment(deleteModal._id);
            toast.success("Comment Deleted");
            await refetch();
            setDeleteModal(null);
          }}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
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