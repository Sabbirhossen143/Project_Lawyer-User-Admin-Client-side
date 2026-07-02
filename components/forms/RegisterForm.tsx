"use client";

import { useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import axiosPublic from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  FaGavel,
  FaUserTie,
  FaUser,
} from "react-icons/fa";


export default function RegisterForm() {
const { createUser, updateUserProfile, logoutUser,} = useAuth();
const [role, setRole] = useState("user");
const router = useRouter();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async (
e: React.FormEvent<HTMLFormElement>
) => {
e.preventDefault();


setError("");
setLoading(true);

const form = e.currentTarget;

const name = (
  form.elements.namedItem("name") as HTMLInputElement
).value;

const email = (
  form.elements.namedItem("email") as HTMLInputElement
).value;

const password = (
  form.elements.namedItem("password") as HTMLInputElement
).value;

const confirmPassword = (
  form.elements.namedItem("confirmPassword") as HTMLInputElement
).value;


try {
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    setLoading(false);
    return;
  }

  if (password.length < 6) {
    toast.error(
  "Password must be at least 6 characters"
  );
    setLoading(false);
    return;
  }

  const result = await createUser(
    email,
    password
  );

  await updateUserProfile(name, "");

  const userInfo = {
    name,
    email,
    role,
    photoURL: "",
    createdAt: new Date(),
  };

  await axiosPublic.post(
    "/users",
    userInfo
  );

  if (role === "lawyer") {
  const lawyerInfo = {
    name,
    email,
    specialty: "",
    experience: 0,
    fee: 0,
    bio: "",
    image: "",
    role: "lawyer",
    createdAt: new Date(),
  };

  await axiosPublic.post(
    "/lawyers",
    lawyerInfo
  );
}

await logoutUser();

  toast.success(
  `Welcome ${name}! Registration Successful`
);

  form.reset();
  router.push("/login");
} catch (err: any) {

  if (
    err.code ===
    "auth/email-already-in-use"
  ) {
    toast.error(
      "Email already exists"
    );
  } else {
    toast.error(
      err.message
    );
  }
} finally {
  setLoading(false);
}


};

return ( 

<div className="
  w-full
  max-w-md
  backdrop-blur-2xl
  bg-[#0B1220]/50
  border
  border-slate-800
  rounded-[2rem]
  p-5
  md:p-8
  shadow-2xl
  transition-all
  duration-500
">
   
   <div className="mb-6 sm:mb-8 text-center">
  <div className="flex items-center justify-center gap-2">
    <FaGavel
      size={28}
      className="text-amber-400"
    />

    <h2 className="text-2xl sm:text-4xl font-bold text-white">
      Create Account
    </h2>
  </div>

  <p className="text-slate-400 mt-2 text-sm sm:text-base">
    Start hiring lawyers today
  </p>
</div>

  <form
    onSubmit={handleRegister}
    className="space-y-3"
  >
    <input
      name="name"
      type="text"
      placeholder="Full Name"
      required
      className="
w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all
"
    />

    <input
      name="email"
      type="email"
      placeholder="Email"
      required
      className="
w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all
"
    />

    <input
      name="password"
      type="password"
      placeholder="Password"
      required
      className="
w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all
"
    />

    <input
      name="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      required
      className="
w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all
"
    />

    <div>
  <label className="block text-slate-300 mb-3 text-sm font-medium">
    Select Account Type
  </label>

  <div className="grid grid-cols-2 gap-3 sm:gap-3">

    <button
      type="button"
      onClick={() => setRole("user")}
      className={`
      py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl border transition-all text-xs sm:text-sm
      ${
        role === "user"
          ? "border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }
      `}
    >
      <div className="flex items-center justify-center gap-2">
        <FaUser
          className={`
          text-lg
          ${
            role === "user"
              ? "text-amber-400"
              : "text-slate-400"
          }
          `}
        />

        <span
          className={`
          text-sm
          font-medium
          ${
            role === "user"
              ? "text-white"
              : "text-slate-300"
          }
          `}
        >
          User
        </span>
      </div>
    </button>

    <button
      type="button"
      onClick={() => setRole("lawyer")}
      className={`
      py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl border transition-all text-xs sm:text-sm
      ${
        role === "lawyer"
          ? "border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }
      `}
    >
      <div className="flex items-center justify-center gap-2">
        <FaUserTie
          className={`
          text-lg
          ${
            role === "lawyer"
              ? "text-amber-400"
              : "text-slate-400"
          }
          `}
        />

        <span
          className={`
          text-sm
          font-medium
          ${
            role === "lawyer"
              ? "text-white"
              : "text-slate-300"
          }
          `}
        >
          Lawyer
        </span>
      </div>
    </button>

  </div>
</div>

 {error && (
  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
    <p className="text-red-400 text-sm">
      {error}
    </p>
  </div>
)}   

    <button
  type="submit"
  disabled={loading}
  className="
  w-full 
    py-3.5 
    rounded-xl 
    bg-gradient-to-r 
    from-amber-500 
    to-yellow-500 
    text-sm 
    sm:text-base 
    font-semibold 
    text-white 
    transition-all 
    duration-300
    hover:from-amber-600 
    hover:to-yellow-600 
    hover:shadow-lg 
    hover:shadow-amber-500/30
    active:scale-[0.98]
  "
>
  {loading
    ? "Creating Account..."
    : "Create Account"}
</button>

<div className="text-center mt-2">
  <p className="text-slate-300">
    Already have an account?{" "}

    <Link
  href="/login"
  className="text-amber-400 hover:text-amber-300 hover:underline font-semibold"
>
  Login Now
</Link>

  </p>
</div>


  </form>
</div>


);
}