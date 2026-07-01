"use client";

import { motion } from "framer-motion";
import TopLegalExperts from "@/components/home/TopLegalExperts";
import LegalCategories from "@/components/home/LegalCategories";
import useAuth from "@/hooks/useAuth";
import FeaturedLawyers from "@/components/home/FeaturedLawyers";

export default function HomePage() {

  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 selection:bg-amber-500/30">
      
      {/* Hero Section */}
      <section className="relative container mx-auto px-6 py-24 md:py-32">
        <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Trusted Legal Service Platform
          </div>

          <h1 className="mt-8 text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            Find & Hire<span className="text-amber-500"> Expert Legal</span> Counsel
          </h1>

          <p className="mt-6 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Connect with experienced lawyers, manage cases, and get professional legal services from anywhere in Bangladesh.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
  <a href="/browse-lawyers" className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25">
    Browse Lawyers
  </a>
  
  {!user ? (
    <a href="/register" className="px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 text-white font-semibold transition-all duration-300">
      Join as Professional
    </a>
  ) : (
    
    <a href="/dashboard/user" className="px-8 py-4 rounded-2xl border border-amber-500/50  text-amber-400 font-semibold transition-all duration-300 hover:bg-amber-500/20">
      Go to Dashboard
    </a>
  )}
</div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "500+", desc: "Expert Lawyers" },
              { title: "10K+", desc: "Happy Clients" },
              { title: "98%", desc: "Success Rate" },
              { title: "24/7", desc: "Premium Support" },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl hover:border-amber-500/30 transition-all text-center">
                <h3 className="text-3xl font-extrabold text-white">{item.title}</h3>
                <p className="text-slate-400 mt-1 text-xs uppercase tracking-wider">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Search Expert", desc: "Browse through our vetted list of professional lawyers." },
            { step: "02", title: "Book Consultation", desc: "Easily schedule your meeting online in just a few clicks." },
            { step: "03", title: "Solve Case", desc: "Get professional legal guidance and resolve your issues." },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-800 bg-slate-900/30">
              <span className="text-amber-500 font-bold text-lg">{item.step}</span>
              <h3 className="text-xl font-bold text-white mt-2">{item.title}</h3>
              <p className="text-slate-400 mt-2 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Lawyers Section */}
      <FeaturedLawyers />
      <TopLegalExperts />
      <LegalCategories />

      {/* Final CTA Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="bg-amber-500 rounded-[2rem] p-12 text-center shadow-2xl shadow-amber-500/20">
          <h2 className="text-3xl md:text-4xl font-bold text-black">Ready to Start Your Case?</h2>
          <p className="text-black/80 mt-4 max-w-lg mx-auto">Get professional help today and secure your peace of mind with the best legal minds in the country.</p>
          <a href="/register" className="mt-8 inline-block px-8 py-4 rounded-xl bg-black text-white font-bold hover:bg-slate-900 transition-all">
            Get Started Now
          </a>
        </div>
      </section>

    </main>
  );
}