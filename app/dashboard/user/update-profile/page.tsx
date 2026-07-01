"use client";

import useAuth from "@/hooks/useAuth";
import { updateUser } from "@/services/users";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaArrowLeft, FaCamera, FaUser, FaSave, FaSpinner } from "react-icons/fa";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  
  // States (Hacks/Hooks এর পর ডিক্লেয়ার করা হয়েছে প্রোপার লাইফসাইকেলের জন্য)
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  return (
    <div className="min-h-[85vh] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 w-full max-w-full overflow-x-hidden animate-fade-in">
      
      <div className="max-w-xl mx-auto bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.12] transition-all duration-500 rounded-3xl p-5 sm:p-8 shadow-2xl relative group">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-all duration-700 pointer-events-none"></div>

        {/* --- Header Section --- */}
        <div className="mb-8 border-b border-white/[0.06] pb-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] text-slate-400 hover:border-amber-500/30 hover:text-amber-400 hover:bg-amber-500/5 text-xs font-bold tracking-wide transition-all duration-300"
          >
            <FaArrowLeft size={10} />
            Back
          </button>

          <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Update Profile
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1.5">
            Modify your credentials and digital avatar identity.
          </p>
        </div>

        {/* --- Form Section --- */}
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return toast.error("Name cannot be empty");

            try {
              await updateProfile(auth.currentUser!, {
                displayName: name,
                photoURL: photo,
              });

              await updateUser(user!.email!, {
                name,
                photoURL: photo,
              });

              setUser({
                ...auth.currentUser!,
              });

              toast.success("Profile updated successfully 🎉");
              router.push("/dashboard/user/profile");
            } catch (error) {
              console.error(error);
              toast.error("Failed to update profile");
            }
          }}
        >  

          {/* Interactive Profile Picture Upload Section */}
          <div className="flex flex-col items-center justify-center gap-4 bg-white/[0.01] border border-white/[0.04] p-5 rounded-2xl">
            <label className="text-slate-400 text-xs font-black uppercase tracking-widest self-start">
              Profile Avatar
            </label>
            
            <div className="relative group/avatar">
              {/* Profile Frame with Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full blur opacity-30 group-hover/avatar:opacity-50 transition duration-500"></div>
              <div className="relative h-28 w-28 rounded-full p-0.5 bg-gradient-to-tr from-amber-500/50 to-white/[0.08] overflow-hidden shadow-2xl">
                <img
                  src={photo || "/images/profile.png"}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover bg-[#090d1f]"
                />
                
                {/* Upload Overlay Layout */}
                <label className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={async (e) => {
                      const image = e.target.files?.[0];
                      if (!image) return;

                      try {
                        setUploading(true);
                        const formData = new FormData();
                        formData.append("image", image);

                        const res = await fetch(
                          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                          {
                            method: "POST",
                            body: formData,
                          }
                        );

                        const data = await res.json();
                        if (data?.data?.url) {
                          setPhoto(data.data.url);
                          toast.success("Avatar uploaded successfully Image");
                        } else {
                          throw new Error();
                        }
                      } catch (error) {
                        toast.error("Image upload failed");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  {uploading ? (
                    <FaSpinner className="text-amber-400 animate-spin" size={18} />
                  ) : (
                    <>
                      <FaCamera className="text-amber-400 mb-1" size={16} />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                    </>
                  )}
                </label>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Hover and click on the avatar to upload</p>
          </div>

          {/* Full Name Input Box */}
          <div className="space-y-2">
            <label className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaUser size={11} className="opacity-70" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your legal full name"
              className="w-full px-4 py-3.5 rounded-xl bg-[#020617]/50 border border-white/[0.08] text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 text-sm font-medium"
            />
          </div>

          {/* Action Save Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-slate-800 disabled:to-slate-900 text-slate-950 disabled:text-slate-600 font-black text-sm tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.15)] disabled:shadow-none hover:shadow-[0_4px_25px_rgba(245,158,11,0.35)] disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin" size={14} />
                Uploading Media...
              </>
            ) : (
              <>
                <FaSave size={14} />
                Update Profile
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}