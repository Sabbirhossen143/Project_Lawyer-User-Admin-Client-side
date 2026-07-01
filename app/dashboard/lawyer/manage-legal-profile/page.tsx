"use client";

import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { AuthContext } from "@/contexts/AuthContext";
import { getLawyerByEmail, updateLawyer } from "@/services/lawyers";

export default function ManageLegalProfilePage() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    experience: "",
    fee: "",
    bio: "",
    image: "",
  });

  const {
    data: lawyer,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["lawyerProfile", user?.email],
    queryFn: () => getLawyerByEmail(user!.email!),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (lawyer) {
      setFormData({
        name: lawyer.name ?? "",
        specialty: lawyer.specialty ?? "",
        experience: lawyer.experience ?? "",
        fee: lawyer.fee ?? "",
        bio: lawyer.bio ?? "",
        image: lawyer.image ?? "",
      });
    }
  }, [lawyer]);

  const mutation = useMutation({
    mutationFn: (data: any) => updateLawyer(lawyer._id, data),
    onSuccess: async () => {
      toast.success("Profile Updated Successfully");
      refetch();
    },
    onError: (error: any) => {
      console.log("UPDATE ERROR:", error);
      toast.error("Update Failed");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      experience: Number(formData.experience || 0),
      fee: Number(formData.fee || 0),
    });
  };

  const [uploading, setUploading] = useState(false);
  const IMGBB_API_KEY =
process.env.NEXT_PUBLIC_IMGBB_API_KEY!;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataImg = new FormData();
      formDataImg.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formDataImg,
      });

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image: data.data.url,
        }));
        toast.success("Image Uploaded Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center p-4">
        <div className="text-amber-400 text-sm sm:text-base font-bold tracking-widest animate-pulse">LOADING PROFILE...</div>
      </div>
    );

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
        <div className="bg-slate-900/20 backdrop-blur-md border border-slate-800/60 rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
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
            ⚖️ Legal Profile
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Manage Legal <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            Update your professional information, specialization, consultation fee, and biography to enhance your professional information.
          </p>
        </div>

        {/* Main Profile Form */}
        <form
          onSubmit={handleSubmit}
          className="
          bg-slate-900/20
          backdrop-blur-md
          border
          border-slate-800/60
          rounded-[2rem]
          md:rounded-[2.5rem]
          p-5
          sm:p-6
          md:p-10
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          space-y-6
          md:space-y-8
          "
        >
          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-amber-400/90 text-xs font-bold uppercase tracking-wider pl-1">Full Name</label>
              <input
                type="text"
                value={formData.name ?? ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 sm:p-4 text-white text-sm outline-none transition-all duration-300 focus:border-amber-500 focus:bg-slate-950 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              />
            </div>

            {/* Email (Disabled) */}
            <div className="space-y-2">
              <label className="text-amber-400/60 text-xs font-bold uppercase tracking-wider pl-1">Email Address</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full rounded-xl bg-slate-900/40 border border-slate-800/40 p-3.5 sm:p-4 text-slate-500 text-sm cursor-not-allowed font-medium truncate"
              />
            </div>

            {/* Specialization */}
            <div className="space-y-2">
              <label className="text-amber-400/90 text-xs font-bold uppercase tracking-wider pl-1">Specialization</label>
              <input
                type="text"
                value={formData.specialty ?? ""}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 sm:p-4 text-white text-sm outline-none transition-all duration-300 focus:border-amber-500 focus:bg-slate-950 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="text-amber-400/90 text-xs font-bold uppercase tracking-wider pl-1">Years of Experience</label>
              <input
                type="number"
                value={formData.experience ?? ""}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 sm:p-4 text-white text-sm outline-none transition-all duration-300 focus:border-amber-500 focus:bg-slate-950 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              />
            </div>

            {/* Fee */}
            <div className="space-y-2">
              <label className="text-amber-400/90 text-xs font-bold uppercase tracking-wider pl-1">Consultation Fee (৳)</label>
              <input
                type="number"
                value={formData.fee ?? ""}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 sm:p-4 text-white text-sm outline-none transition-all duration-300 focus:border-amber-500 focus:bg-slate-950 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              />
            </div>

            {/* Image Upload Input */}
            <div className="space-y-2">
              <label className="text-amber-400/90 text-xs font-bold uppercase tracking-wider pl-1">
                Profile Image
              </label>
              <div className="relative w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-1.5 flex items-center transition-all duration-300 focus-within:border-amber-500 focus-within:shadow-[0_0_15px_rgba(245,158,11,0.1)] overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />
                <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-md flex-shrink-0">
                  {uploading ? "Uploading..." : "Choose File"}
                </div>
                <span className="text-slate-400 text-xs pl-3 truncate max-w-[140px] sm:max-w-[180px]">
                  {formData.image ? "Image attached structure" : "No file selected"}
                </span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <label className="text-amber-400/90 text-xs font-bold uppercase tracking-wider pl-1">Professional Biography</label>
            <textarea
              rows={5}
              value={formData.bio ?? ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-2xl bg-slate-950/60 border border-slate-800/80 p-4 text-white text-sm resize-none outline-none transition-all duration-300 focus:border-amber-500 focus:bg-slate-950 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            />
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              { label: "Experience", val: `${formData.experience || 0}`, unit: "Years Active", borderColor: "border-amber-500/20", txtColor: "text-amber-400" },
              { label: "Consultation Fee", val: `৳ ${formData.fee || 0}`, unit: "Per Session", borderColor: "border-emerald-500/20", txtColor: "text-emerald-400" },
              { label: "Specialization", val: formData.specialty || "Not Configured", unit: "Legal Field", borderColor: "border-blue-500/20", txtColor: "text-blue-400", isLong: true }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-slate-950/40 border ${stat.borderColor} rounded-2xl p-5 shadow-inner flex flex-col justify-between min-w-0 ${
                  idx === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider truncate">{stat.label}</h3>
                <h2 className={`font-black mt-3 truncate tracking-tight ${stat.isLong ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"} ${stat.txtColor}`}>
                  {stat.val}
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">{stat.unit}</p>
              </div>
            ))}
          </div>

          {/* Live Interactive Preview Box */}
          <div
            className="
            rounded-3xl
            bg-gradient-to-b
            from-slate-950/80
            to-slate-950/40
            border
            border-amber-500/10
            p-5
            sm:p-6
            md:p-8
            shadow-inner
            relative
            overflow-hidden
            "
          >
            <div className="absolute top-0 right-0 px-3 py-1 sm:px-4 sm:py-1.5 rounded-bl-2xl bg-amber-500/10 border-l border-b border-amber-500/20 text-amber-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
              Live Preview
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-8 mt-4 md:mt-0">
              {/* Avatar segment */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl opacity-40" />
                <img
                  src={formData.image && formData.image.trim() !== "" ? formData.image : "/images/default-lawyer.png"}
                  alt="Profile Avatar"
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-amber-500/40 p-1.5 bg-slate-950 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Dynamic text details segment */}
              <div className="space-y-3 text-center md:text-left w-full min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight break-words">
                  {formData.name || "Your Professional Identity"}
                </h2>
                <p className="text-amber-400 text-xs sm:text-sm font-semibold tracking-wide break-words">
                  {formData.specialty ? `⚖️ ${formData.specialty}` : "Practice Field Not Configured"}
                </p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-slate-950/20 border border-slate-900 p-3 sm:p-3.5 rounded-xl break-words text-left">
                  {formData.bio || "Your structural professional bio timeline statement will render dynamically inside this segment layout configuration placeholder."}
                </p>

                {/* Sub-preview details meta footer */}
                <div className="flex justify-center md:justify-start gap-6 sm:gap-8 pt-1">
                  <div>
                    <p className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Experience</p>
                    <h4 className="text-slate-200 text-xs sm:text-sm font-bold mt-0.5">{formData.experience || 0} Years</h4>
                  </div>
                  <div className="border-l border-slate-800/80" />
                  <div>
                    <p className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Consultation Premium</p>
                    <h4 className="text-emerald-400 text-xs sm:text-sm font-bold mt-0.5">৳ {formData.fee || 0}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Button */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={mutation.isPending || uploading}
              className="
              w-full
              sm:w-64
              py-3.5
              rounded-xl
              bg-slate-950
              border
              border-amber-500/40
              text-amber-400
              text-xs
              font-bold
              uppercase
              tracking-widest
              shadow-lg
              shadow-amber-950/20
              hover:bg-amber-500
              hover:text-slate-950
              hover:border-amber-500
              hover:shadow-amber-500/20
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:pointer-events-none
              transition-all
              duration-300
              "
            >
              {mutation.isPending ? "Syncing Workspace..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}