"use client";

import Link from "next/link";

const categories = [
  "Criminal", "Corporate", "Family", "Property", "Immigration", "Tax"
];

export default function LegalCategories() {
  return (
    <section className="py-20 bg-[#020617]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-white mb-16">
          Browse by <span className="text-amber-500">Categories</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/browse-lawyers?specialty=${encodeURIComponent(category)}`}
              className="group flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
            >
              <span className="text-slate-300 group-hover:text-white font-medium text-center">
                {category}
              </span>
              <span className="text-amber-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}