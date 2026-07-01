"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import axiosPublic from "@/lib/axios";
import { 
  FaCog, 
  FaGlobe, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaPercentage, 
  FaSave,
  FaCloudUploadAlt,
  FaImage
} from "react-icons/fa";

interface SettingsInput {
  platformName: string;
  supportEmail: string;
  contactNumber: string;
  platformFee: number;
  logoUrl?: string;
}

// imgBB API Key
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SettingsInput>({
    defaultValues: {
      platformName: "Lawyer Hiring Platform",
      supportEmail: "support@lawyerhire.com",
      contactNumber: "+8801XXXXXXXXX",
      platformFee: 10,
      logoUrl: ""
    },
  });

  // imgBB তে ইমেজ আপলোড ফাংশন
  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );
    return response.data.data.url;
  };

  // ইমেজ চেঞ্জ হ্যান্ডলার
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ক্লায়েন্ট সাইড প্রিভিউ
    setImagePreview(URL.createObjectURL(file));

    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadToImgBB(file);
      setValue("logoUrl", uploadedUrl); // react-hook-form এ ভ্যালু সেট
      toast.success("Image processed and ready to sync!");
    } catch (error) {
      toast.error("Failed to upload image to imgBB");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: SettingsInput) => {
    try {
      await axiosPublic.put("/system-settings", data); 
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast.success("Configuration updated successfully!");
    } catch (error) {
      toast.error("Failed to update configurations");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 selection:bg-amber-500/20 animate-in fade-in duration-500 relative w-full max-w-full overflow-x-hidden">
      
      {/* Header Panel */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
            <FaCog size={20} className="animate-[spin_6s_linear_infinite]" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              System Settings
            </h1>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm">
              Configure system configurations, core transactional rules, and global metadata variables.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form Panel */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          
          {/* PREMIUM IMAGE UPLOAD SECTION */}
          <div className="space-y-3 w-full">
            <label className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
              <FaImage size={12} className="text-amber-500 shrink-0" /> Platform Logo / Avatar
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-[#090d1f]/40 border border-white/5 rounded-2xl w-full">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center group shadow-inner shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FaCloudUploadAlt size={26} className="text-slate-500" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                <label className="inline-block px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl border border-white/10 cursor-pointer transition active:scale-95">
                  Choose New Asset
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
                <p className="text-slate-500 text-[10px] sm:text-[11px] leading-relaxed">Supports PNG, JPG or WEBP. Managed via high-speed imgBB CDN network.</p>
              </div>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Platform Name */}
            <div className="space-y-2 w-full">
              <label className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                <FaGlobe size={12} className="text-slate-500 shrink-0" /> Platform Name
              </label>
              <input
                type="text"
                {...register("platformName", { required: true })}
                className="w-full bg-[#090d1f]/40 border border-white/10 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-2.5 sm:py-3 px-4 text-xs sm:text-sm text-white outline-none transition duration-300 shadow-inner"
              />
            </div>

            {/* Support Email */}
            <div className="space-y-2 w-full">
              <label className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                <FaEnvelope size={12} className="text-slate-500 shrink-0" /> Support Email Address
              </label>
              <input
                type="email"
                {...register("supportEmail", { required: true })}
                className="w-full bg-[#090d1f]/40 border border-white/10 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-2.5 sm:py-3 px-4 text-xs sm:text-sm text-white outline-none transition duration-300 shadow-inner font-mono"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2 w-full">
              <label className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                <FaPhoneAlt size={11} className="text-slate-500 shrink-0" /> Helpline Contact Number
              </label>
              <input
                type="text"
                {...register("contactNumber", { required: true })}
                className="w-full bg-[#090d1f]/40 border border-white/10 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-2.5 sm:py-3 px-4 text-xs sm:text-sm text-white outline-none transition duration-300 shadow-inner font-mono"
              />
            </div>

            {/* Platform Fee */}
            <div className="space-y-2 w-full">
              <label className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                <FaPercentage size={11} className="text-slate-500 shrink-0" /> Global Platform Fee
              </label>
              <input
                type="number"
                {...register("platformFee", { required: true, min: 0, max: 100 })}
                className="w-full bg-[#090d1f]/40 border border-white/10 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 rounded-xl py-2.5 sm:py-3 px-4 text-xs sm:text-sm text-white outline-none transition duration-300 shadow-inner font-mono"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-white/5 pt-5 flex justify-end w-full">
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 active:scale-95 shadow-lg shadow-amber-500/10 cursor-pointer outline-none border-none"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSave size={13} />
              )}
              {isSubmitting ? "Updating..." : "Save Architecture Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}