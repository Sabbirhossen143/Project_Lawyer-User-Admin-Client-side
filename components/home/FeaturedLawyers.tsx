"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLawyers } from "@/services/lawyers";

export default function FeaturedLawyers() {
  const { data = [] } = useQuery({
    queryKey: ["lawyers"],
    queryFn: getLawyers,
  });

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Our Featured Experts
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Connect with top-rated legal professionals tailored to your specific needs.
          </p>
        </div>

        {/* Responsive Grid: 1 column mobile, 2 tablet, 3-4 desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data
  .sort(() => Math.random() - 0.5)
  .slice(0, 6)
  .map((lawyer: any, index: number) => (
            <div
              key={index}
              className="group relative flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Image with hover zoom effect */}
              <div className="h-60 overflow-hidden">
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {lawyer.name}
                </h3>
                <p className="text-amber-500 font-medium text-sm mb-4 uppercase tracking-wider">
                  {lawyer.specialty}
                </p>

                <div className="mt-auto space-y-2 mb-6">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Experience:</span>
                    <span className="text-slate-200">{lawyer.experience} Years</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Consultation Fee:</span>
                    <span className="text-amber-400 font-semibold">৳{lawyer.fee}</span>
                  </div>
                </div>

                <Link
                  href={`/lawyers/${lawyer._id}`}
                  className="block text-center w-full py-3 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300 font-semibold"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}