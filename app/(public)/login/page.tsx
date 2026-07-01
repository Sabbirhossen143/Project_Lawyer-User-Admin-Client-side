import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[128px]"></div>
      </div>

      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center z-10">
        <div className="text-white space-y-6 text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium tracking-wide">
            Trusted Legal Platform
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Welcome <span className="text-amber-500">Back</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Access your dashboard, manage cases, hire lawyers, and connect with legal professionals securely.
          </p>
        </div>

        <div className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}