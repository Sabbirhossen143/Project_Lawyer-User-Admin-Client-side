"use client";

import { useQuery } from "@tanstack/react-query";
import { getLawyers } from "@/services/lawyers";

export default function TopLegalExperts() {
  const { data = [] } = useQuery({
    queryKey: ["lawyers"],
    queryFn: getLawyers,
  });

  const topLawyers = [...data]
    .sort((a: any, b: any) => (b.hires || 0) - (a.hires || 0))
    .slice(0, 3);

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-white mb-16">
          Top Rated <span className="text-amber-500">Legal Experts</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topLawyers.map((lawyer: any) => (
            <div
              key={lawyer._id}
              className="group relative bg-slate-900 p-8 rounded-[2rem] border border-slate-800 hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <div className="relative w-28 h-28 mx-auto mb-6">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-full h-full rounded-full object-cover border-4 border-slate-800 group-hover:border-amber-500 transition-colors"
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-1">{lawyer.name}</h3>
                <p className="text-amber-500 font-medium mb-4">{lawyer.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}