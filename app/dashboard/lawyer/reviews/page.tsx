"use client";

import { useContext, useMemo, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getLawyerByEmail } from "@/services/lawyers";
import { getCommentsByLawyer } from "@/services/comments";

const REVIEWS_PER_PAGE = 6;

export default function LawyerReviewsPage() {
  const { user } = useContext(AuthContext);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data: lawyer, isLoading: lawyerLoading } = useQuery({
    queryKey: ["lawyer", user?.email],
    queryFn: () => getLawyerByEmail(user!.email!),
    enabled: !!user?.email,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["lawyerReviews", lawyer?._id],
    queryFn: () => getCommentsByLawyer(lawyer!._id),
    enabled: !!lawyer?._id,
  });

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(comments.length / REVIEWS_PER_PAGE));

  const currentReviews = useMemo(() => {
    const start = (page - 1) * REVIEWS_PER_PAGE;
    return comments.slice(start, start + REVIEWS_PER_PAGE);
  }, [comments, page]);

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum: number, item: any) => sum + (item.rating || 5), 0) /
          comments.length
        ).toFixed(1)
      : "0.0";

  if (lawyerLoading || commentsLoading) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center p-4">
        <div className="text-amber-400 font-bold tracking-widest animate-pulse text-sm sm:text-base">LOADING REVIEWS...</div>
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
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
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
            ⭐ Performance Rating
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Client Reviews & <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Feedback</span>
          </h1>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            Monitor client feedback, core metrics, and recommendations left by clients who engaged your professional legal expert.
          </p>
        </div>

        {/* Lawyer Identity & Stats Grid */}
        <div className="space-y-5 md:space-y-6">
          <div className="text-center space-y-2 px-2">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight break-words max-w-full">
                {lawyer?.name}
              </h2>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wide flex-shrink-0">
                ✔ Verified Lawyer
              </span>
            </div>
            <p className="text-amber-400 text-xs sm:text-sm font-semibold tracking-wide break-words">
              ⚖️ {lawyer?.specialty}
            </p>
          </div>

          {/* Analytical Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-amber-500/30 min-w-0">
              <p className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider truncate max-w-full">Total Feedback Submissions</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">{comments.length}</h2>
              <p className="text-slate-500 text-xs mt-1 font-medium">Accumulated Reviews</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-amber-500/30 min-w-0">
              <p className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider truncate max-w-full">Average Review Rating</p>
              <h2 className="text-3xl sm:text-4xl font-black text-amber-400 mt-2 tracking-tight flex items-center gap-2">
                {averageRating} <span className="text-xl sm:text-2xl text-amber-500">★</span>
              </h2>
              <p className="text-slate-500 text-xs mt-1 font-medium">Out of 5.0 Global Scale</p>
            </div>
          </div>
        </div>

        {/* Section Divider/Title */}
        <div className="pt-4 border-t border-slate-900 px-1">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">All Testimonials</h3>
          <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Historical cataloging of verified client briefs.</p>
        </div>

        {/* Empty State Layout */}
        {comments.length === 0 && (
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="text-3xl sm:text-4xl">✨</div>
            <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">No Reviews Cataloged Yet</h4>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Client workspace testimonials and score ratings will populate inside this viewport grid arrangement framework automatically.
            </p>
          </div>
        )}

        {/* Reviews Presentation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {currentReviews.map((review: any) => (
            <div
              key={review._id}
              className="
              bg-slate-900/50
              backdrop-blur-md
              border
              border-slate-800/90
              rounded-[2rem]
              p-5
              flex
              flex-col
              justify-between
              space-y-4
              shadow-[0_15px_35px_rgba(0,0,0,0.5)]
              hover:border-amber-500/40
              hover:bg-slate-900/70
              hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)]
              transition-all
              duration-500
              min-w-0
              "
            >
              <div className="space-y-4">
                {/* Header Sub-segment */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <img
                      src={review.userPhoto && review.userPhoto.trim() !== "" ? review.userPhoto : "/images/default-user.png"}
                      alt={review.userName}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-amber-500/40 p-0.5 bg-slate-950 flex-shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate">{review.userName}</h4>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div className="flex gap-0.5 text-amber-400 text-[10px] sm:text-xs">
                      {Array.from({ length: Math.min(5, review.rating || 5) }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-850 text-emerald-400 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Main Client Comment View */}
                <div className="bg-slate-950/60 border border-amber-500/5 p-3.5 sm:p-4 rounded-xl shadow-inner min-h-[96px] flex items-center overflow-hidden">
                  <p className="text-slate-300 text-xs italic leading-relaxed line-clamp-4 w-full break-words">
                    "{review.comment}"
                  </p>
                </div>
              </div>

              {/* Action Trigger Row */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsOpen(true);
                  }}
                  className="text-xs font-bold text-amber-400/80 hover:text-amber-400 tracking-wide flex items-center gap-1 transition-colors duration-300"
                >
                  View Details <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Pagination Elements */}
        {comments.length > REVIEWS_PER_PAGE && (
          <div className="flex flex-wrap justify-center items-center gap-2 pt-4 sm:pt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-900 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all duration-300"
            >
              Previous
            </button>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border text-xs font-bold transition-all duration-300 ${
                    page === idx + 1
                      ? "bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-900 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}

        {/* Expanded Focus Identity Modal */}
        {isOpen && selectedReview && (
          <div
            className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="
              relative
              w-full
              max-w-md
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
              space-y-5
              md:space-y-6
              "
            >
              {/* Modal Close Layout */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div className="pr-4">
                  <p className="text-amber-400 text-[10px] tracking-[4px] uppercase font-bold">✨ Feedback Scope</p>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">Review Details</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all duration-300 flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Core User Identity Module */}
              <div className="flex flex-col items-center text-center space-y-2">
                <img
                  src={selectedReview.userPhoto && selectedReview.userPhoto.trim() !== "" ? selectedReview.userPhoto : "/images/default-user.png"}
                  alt={selectedReview.userName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-500/40 p-1 bg-slate-950 shadow-md"
                />
                <div className="w-full min-w-0 px-2">
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight break-words">{selectedReview.userName}</h4>
                  <p className="text-slate-400 text-[11px] sm:text-xs font-mono break-all mt-0.5">{selectedReview.userEmail}</p>
                </div>
              </div>

              {/* Micro Metric Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-slate-800 bg-slate-850/60 text-center">
                <div className="space-y-1">
                  <p className="text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Date</p>
                  <p className="text-slate-200 text-xs font-semibold">
                    {new Date(selectedReview.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-1 border-l border-slate-800/80">
                  <p className="text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Review Score</p>
                  <div className="text-amber-400 text-xs flex justify-center gap-0.5">
                    {Array.from({ length: Math.min(5, selectedReview.rating || 5) }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Area Frame Block */}
              <div className="space-y-2 rounded-2xl border border-amber-500/10 bg-amber-500/[0.01] p-4">
                <h5 className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>📝 Review</span>
                </h5>
                <p className="text-slate-200 text-xs leading-relaxed italic bg-slate-950/80 p-3 sm:p-3.5 rounded-xl border border-slate-800 whitespace-pre-wrap break-words max-h-[160px] overflow-y-auto text-left">
                  "{selectedReview.comment}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}