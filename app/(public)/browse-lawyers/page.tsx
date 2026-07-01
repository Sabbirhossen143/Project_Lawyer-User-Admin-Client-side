"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLawyers } from "@/services/lawyers";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BrowseLawyersPage() {

  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [specialty, setSpecialty] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);

  const {
  data: lawyers = [],
  isLoading,
  isError,
  } = useQuery({
  queryKey: ["lawyers"],
  queryFn: getLawyers,
  });

  const specialties: string[] = [
  "all",
  ...(Array.from(
    new Set(
      lawyers
        .map((l: any) => l.specialty)
        .filter(Boolean)
    )
  ) as string[]),
];
  const filteredLawyers = lawyers.filter((l: any) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.specialty.toLowerCase().includes(search.toLowerCase());
    return specialty === "all" ? matchesSearch : matchesSearch && l.specialty === specialty;
  });

  const searchParams = useSearchParams();

useEffect(() => {
  const searchValue =
    searchParams.get("search") || "";

  setSearch(searchValue);
}, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: any) => { if (filterRef.current && !filterRef.current.contains(e.target)) setOpenFilter(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-80 rounded-3xl bg-slate-800 animate-pulse"
        />
      ))}
    </div>
  );
  }

  if (isError) {
  return (
    <div className="text-center py-20 text-red-400">
      Failed to load lawyers.
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#121929] to-[#0B1220] py-10 px-4 md:py-16 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-16">
          <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-3 md:mb-4 tracking-tight">Our Legal Experts</h1>
          <p className="text-slate-400 text-sm md:text-lg">Connect with highly qualified professionals</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 mb-8 md:flex-row md:gap-4 md:mb-12">
          <input
            type="text"
            value={search}
            placeholder="Search by name or specialty..."
            className="w-full p-3 md:p-4 rounded-2xl bg-[#0B1220] border border-slate-700 text-white focus:border-amber-500 outline-none transition-all text-xs md:text-base"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div ref={filterRef} className="relative w-full md:w-64">
            <button onClick={() => setOpenFilter(!openFilter)} className="w-full px-5 py-3 md:py-4 rounded-2xl bg-[#0B1220] border border-amber-500/20 text-slate-200 flex justify-between items-center hover:border-amber-500/50 text-xs md:text-sm">
              {specialty === "all" ? "All Specialties" : specialty}
              <span className="text-amber-500 text-xs">▼</span>
            </button>
            {openFilter && (
              <div className="absolute top-full mt-2 w-full bg-[#0B1220] border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                {specialties.map((item) => (
                  <button 
  key={item as string} 
  onClick={() => { setSpecialty(item); setOpenFilter(false); }} 
  className="w-full text-left px-5 py-3 hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 text-xs md:text-sm"
>
  {item === "all" ? "All Specialties" : item}
</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredLawyers.length === 0 && (
  <div className="text-center py-20">
    <h3 className="text-2xl font-bold text-white">
      No lawyers found
    </h3>
    <p className="text-slate-400 mt-2">
      Try another search or filter.
    </p>
  </div>
)}

        {/* Lawyer Grid  */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {filteredLawyers.map((lawyer: any, index: number) => (
    <div 
      key={index} 
      className="group bg-[#0B1220] border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
    >
      <div className="relative h-40 sm:h-52 md:h-64 overflow-hidden">
        {lawyer.isBusy && (
          <div className="absolute top-3 left-3 z-10 bg-red-500/90 backdrop-blur text-white px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider">
            Busy
          </div>
        )}
        <img 
          src={lawyer.image || "/images/default-lawyer.png"} 
          alt={lawyer.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="text-sm md:text-xl font-bold text-white mb-1 truncate">{lawyer.name}</h3>
        <p className="text-amber-500 text-[10px] md:text-sm font-medium mb-3 md:mb-4 uppercase tracking-widest">
          {lawyer.specialty}
        </p>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center text-slate-400 text-[10px] md:text-sm mb-4 md:mb-5 gap-1 md:gap-0">
          <span>{lawyer.experience} Years Exp.</span>
          <span className="text-white font-bold text-xs md:text-base">৳{lawyer.fee}/hr</span>
        </div>
        
        <Link 
          href={`/lawyers/${lawyer._id}`} 
          className="block w-full text-center py-2 md:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-xs md:text-sm hover:shadow-lg transition-all"
        >
          View Profile
        </Link>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}