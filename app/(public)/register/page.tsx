import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[128px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center z-10">
        {/* Left Side: Brand Content */}
        <div className="text-white space-y-8 text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium tracking-wide">
            #1 Legal Services Platform
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Hire The <span className="text-amber-500">Best Lawyers</span> In Bangladesh
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Connect with experienced legal experts, manage cases, and get trusted legal support from anywhere.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0 pt-4">
            {[{title: "500+", desc: "Lawyers"}, {title: "5K+", desc: "Clients"}, {title: "10K+", desc: "Cases"}].map((stat, i) => (
              <div key={i}>
                <h2 className="text-2xl font-bold text-white">{stat.title}</h2>
                <p className="text-slate-500 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}