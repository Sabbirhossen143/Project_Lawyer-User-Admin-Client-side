"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createRequest,} from "@/services/hireRequests";
import { createComment,} from "@/services/comments";
import { useState } from "react";
import toast from "react-hot-toast";
import { getCommentsByLawyer } from "@/services/comments";
import { useContext,} from "react";
import { AuthContext,} from "@/contexts/AuthContext";
import { getLawyer, getLawyers,} from "@/services/lawyer";

export default function LawyerDetailsPage() {
  
const params = useParams();
const [openModal, setOpenModal] = useState(false);
const [openCaseType, setOpenCaseType] = useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [caseType, setCaseType] = useState("");
const [message, setMessage] = useState("");
const [showReviewForm, setShowReviewForm] = useState(false);
const [rating, setRating] = useState(5);
const [commentText, setCommentText] = useState("");
const { user } = useContext(AuthContext);

  const {
  data: lawyer,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["lawyer", params.id],
  queryFn: () => getLawyer(params.id as string),
});


  const {
  data: lawyers = [],
} = useQuery({
  queryKey: ["lawyers"],
  queryFn: getLawyers,
});

  const {
  data: comments = [],
  refetch,
} = useQuery({
  queryKey: [
    "comments",
    params.id,
  ],
  enabled: !!params.id,
  queryFn: () =>
    getCommentsByLawyer(
      params.id as string
    ),
});

const averageRating =
comments.length
? (
    comments.reduce(
      (sum, item) =>
        sum + item.rating,
      0
    ) / comments.length
  ).toFixed(1)
: "0";

const relatedLawyers =
  lawyers
    .filter(
      (item: any) =>
        item._id !== lawyer?._id &&
        item.specialty ===
          lawyer?.specialty
    )
    .slice(0, 4);
  
  useEffect(() => {
  if (user?.email) {
    setEmail(user.email);
  }

  if (user?.displayName) {
    setName(user.displayName);
  }
}, [user]);


  if (isLoading) {
  return (
    <div className="min-h-screen bg-[#020617] py-20 px-6">
      <div className="max-w-5xl mx-auto animate-pulse">

        <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900 p-8">
          <div className="grid md:grid-cols-2 gap-10">

            <div className="h-[450px] rounded-3xl bg-slate-800" />

            <div>
              <div className="h-6 w-32 bg-slate-800 rounded mb-6" />
              <div className="h-12 w-72 bg-slate-800 rounded mb-4" />
              <div className="h-6 w-48 bg-slate-800 rounded mb-8" />

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="h-20 bg-slate-800 rounded-2xl" />
                <div className="h-20 bg-slate-800 rounded-2xl" />
                <div className="h-20 bg-slate-800 rounded-2xl" />
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded" />
                <div className="h-4 bg-slate-800 rounded" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
              </div>

              <div className="h-14 bg-slate-800 rounded-2xl mt-8" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

  if (isError) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-400">
          Failed to load lawyer
        </h2>
        <p className="text-slate-400 mt-2">
          Please try again later.
        </p>
      </div>
    </div>
  );
}

  return (
   <div className="min-h-screen bg-[#020617] py-10 md:py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Main Profile Card */}
        <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-800 bg-[#0f172a]/60 backdrop-blur-2xl p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-center">
            
            {/* Image Section */}
            <div className="w-full">
              <img src={lawyer.image} alt={lawyer.name} className="h-[300px] md:h-[450px] w-full object-cover rounded-2xl md:rounded-[1.8rem]" />
            </div>

            {/* Details Section */}
            <div>
              <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Verified Lawyer</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4">{lawyer.name}</h1>
              <p className="text-amber-500 text-lg md:text-xl font-medium mt-1 md:mt-2">{lawyer.specialty}</p>

              <div className="grid grid-cols-3 gap-2 md:gap-4 mt-5 md:mt-8">
                {[ { label: "Experience", value: `${lawyer.experience} Years` }, { label: "Fee", value: `৳${lawyer.fee}` }, { label: "Rating", value: averageRating } ].map((stat, i) => (
                  <div key={i} className="rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-800 p-3  text-center">
                    <h3 className="text-sm md:text-lg font-bold text-white">{stat.value}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-slate-400 mt-4 md:mt-8 leading-relaxed text-sm md:text-base">{lawyer.bio}</p>
              <button onClick={() => setOpenModal(true)} className="mt-6 md:mt-8 w-full py-3 md:py-4 rounded-xl md:rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all">
                Hire This Expert
              </button>
            </div>
          </div>
         

  <div className="mt-8 md:mt-12">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
    <div className="flex flex-wrap items-center gap-3">
      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
        Client Reviews
      </h2>
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
          {comments.length} Reviews
        </span>
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
          ⭐ {averageRating} Rating
        </span>
      </div>
    </div>

    <button
      onClick={() => setShowReviewForm(!showReviewForm)}
      className="group flex items-center justify-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300 w-full md:w-auto"
    >
      <span className="text-lg group-hover:rotate-12 transition-transform">✍️</span>
      Write a Review
    </button>
  </div>

  {showReviewForm && (
  <div className="mb-8 p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-amber-500/20 backdrop-blur-xl shadow-2xl">
    <h3 className="text-white text-xl font-bold mb-6">Leave a Review</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Review Textarea */}
      <div className="md:col-span-2">
        <label className="block text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">
          Your Feedback
        </label>
        <textarea
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="What do you think about this lawyer?"
          className="w-full rounded-2xl bg-slate-950/50 border border-slate-700 p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none"
        />
      </div>

      {/* Rating Selection */}
      <div>
        <label className="block text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">
          Rating (1-5)
        </label>
        <div className="grid grid-cols-5 md:grid-cols-1 gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-2 rounded-xl border transition-all duration-300 ${
                rating === star
                  ? "bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20"
                  : "bg-slate-950/50 text-slate-400 border-slate-700 hover:border-amber-500/50"
              }`}
            >
              {star} ⭐
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <button
      onClick={async () => {
    if (!user) {
  toast.error(
    "Please login first"
  );
  return;
}

    if (!commentText) {
      toast.error(
        "Please write a review"
      );
      return;
    }

    const commentData = {

      lawyerId: params.id,

      lawyerName: lawyer.name,

      userName:

  user?.displayName ||

  "Anonymous",

userEmail:

  user?.email || "",

  userPhoto:

    user?.photoURL ||

    "/images/profile.png",

      rating,

      comment:

        commentText,

      createdAt:

        new Date(),
    };

    await createComment(

      commentData
    );

    await refetch();
    setCommentText("");
    setRating(5);

    toast.success(

      "Review Submitted"
    );
    setShowReviewForm(false);

  }}
      className="mt-8 w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold transition-all shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
    >
      Submit Review
    </button>
  </div>
)}

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
  {comments.map((review: any) => (
    <div
      key={review._id}
      className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-4 hover:border-amber-500/30 transition-all duration-300 group"
    >
      {/* Header: User Info & Date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={review.userPhoto || "/images/comments-profile.png"}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/50 transition-all"
          />
          <div>
            <h4 className="text-white font-bold text-sm">{review.userName}</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Client</p>
          </div>
        </div>
        <span className="text-[10px] px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-medium">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Rating Line */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-amber-500 text-xs">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
        <span className="text-white font-bold text-xs">{review.rating}.0</span>
      </div>

      {/* Review Content */}
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-4 italic border-t border-slate-800 pt-2">
        "{review.comment}"
      </p>
    </div>
  ))}
</div>
</div> {/* mt-8 md:mt-12 */}
</div> {/* Main Profile Card */}

<div className="max-w-5xl mx-auto mt-10">
  {/* Section Container with Glassmorphism */}
  <div className="relative rounded-[2.5rem] border border-slate-800/50 bg-[#0f172a]/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
    
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Related Lawyers</h2>
        <p className="text-slate-500 mt-2 text-sm">Similar experts in this field</p>
      </div>
      <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
        Suggested
      </span>
    </div>

    {relatedLawyers.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedLawyers.map((item: any) => (
          <div
            key={item._id}
            className="group relative bg-slate-900/60 border border-slate-800 rounded-3xl p-4 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer"
          >
            {/* Image Wrapper */}
            <div className="relative overflow-hidden rounded-2xl mb-4 h-44">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
            </div>
            
            {/* Content */}
            <h3 className="text-white font-bold text-lg group-hover:text-amber-400 transition-colors">{item.name}</h3>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-[10px] uppercase font-bold tracking-wider group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-all">
              {item.specialty}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-16 bg-slate-900/20 rounded-[2rem] border border-dashed border-slate-800">
        <div className="text-5xl mb-4 opacity-50">⚖️</div>
        <h3 className="text-white font-bold text-lg">No Related Lawyers Found</h3>
        <p className="text-slate-500 text-sm mt-2">Currently no lawyers available in this specialization.</p>
      </div>
    )}
  </div>
</div>


{openModal && (
  <div
    onClick={() => setOpenModal(false)}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md bg-[#0B1220]/90 backdrop-blur-2xl border border-amber-500/20 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Hire Expert</h2>
          <p className="text-slate-400 text-xs mt-1">Fill details for {lawyer.name}</p>
        </div>
        <button
          onClick={() => setOpenModal(false)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Inputs */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full px-4 py-2 md:py-4 p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
        />

        <input
  value={email}
  readOnly
  placeholder="Your Email"
  className="w-full px-4 py-2 md:py-4 p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white cursor-not-allowed opacity-80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none"
/>

        {/* Case Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenCaseType(!openCaseType)}
            className="w-full flex items-center justify-between px-4 py-2 md:py-4 rounded-2xl bg-slate-900 border text-[15px] border-slate-700 text-slate-300 hover:border-amber-500/50 transition-all"
          >
            {caseType || "Select Case Type"}
            <span className={`text-amber-500 transition-transform ${openCaseType ? "rotate-180" : ""}`}>▼</span>
          </button>

          {openCaseType && (
            <div className="absolute top-full left-0 mt-2 text-[15px] w-full rounded-2xl border border-slate-700 bg-[#0B1220] overflow-hidden shadow-2xl z-50">
              {[
                { value: "Criminal Case", icon: "⚖️" },
                { value: "Corporate Case", icon: "🏢" },
                { value: "Family Case", icon: "👨‍👩‍👧" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => { setCaseType(item.value); setOpenCaseType(false); }}
                  className="w-full text-left px-5 py-3 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-all"
                >
                  {item.icon} {item.value}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Describe your case..."
          className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none"
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => { setName(""); setEmail(""); setCaseType(""); setMessage(""); }}
            className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 transition-all"
          >
            Reset
          </button>
          <button
            onClick={async () => {
              if (!name || !email || !caseType) { alert("Please fill all fields"); return; }
              const requestData = { lawyerId: lawyer._id, lawyerName: lawyer.name, lawyerEmail: lawyer.email, specialty: lawyer.specialty, fee: lawyer.fee, userName: name, userEmail: email, caseType, message, status: "Pending", createdAt: new Date() };
              await createRequest(requestData);
              setName(""); setEmail(""); setCaseType(""); setMessage(""); setOpenModal(false);
              toast.success("Request Submitted Successfully", { icon: "⚖️" });
            }}
            className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-sm"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  </div>
)}

</div>
</div>
  );
}