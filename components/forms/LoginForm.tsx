"use client";

import Link from "next/link";
import { FaBalanceScale } from "react-icons/fa";
import axiosPublic from "@/lib/axios";
import { FaGoogle } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginForm() {

const router = useRouter();

const {
  loginUser,
  googleLogin,
} = useAuth();


  const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const form = e.currentTarget;

  const email =
    (
      form.elements.namedItem(
        "email"
      ) as HTMLInputElement
    ).value;

  const password =
    (
      form.elements.namedItem(
        "password"
      ) as HTMLInputElement
    ).value;

  try {

    // Firebase Login
    await loginUser(
      email,
      password
    );

    toast.success("Welcome Back!");

    // JWT Request
    const res =
      await axiosPublic.post(
        "/auth/jwt",
        {
          email,
        }
      );

    localStorage.setItem(
      "access-token",
      res.data.token
    );

    const roleRes =
  await axiosPublic.get(
    `/users/role/${email}`
  );

const role =
  roleRes.data.role;

if (role === "admin") {
  router.push(
    "/dashboard/admin"
  );
} else if (
  role === "lawyer"
) {
  router.push(
    "/dashboard/lawyer"
  );
} else {
  router.push("/");
}

  } catch (error: any) {

  if (
    error.code ===
    "auth/invalid-credential"
  ) {
    toast.error(
      "Invalid Email or Password"
    );
  }

  else if (
    error.code ===
    "auth/user-not-found"
  ) {
    toast.error(
      "Email Not Found"
    );
  }

  else if (
    error.code ===
    "auth/wrong-password"
  ) {
    toast.error(
      "Wrong Password"
    );
  }

  else {
    toast.error(
      error.message
    );
  }

  console.log(error);
}
};

const handleGoogleLogin =
  async () => {

    const result =
      await googleLogin();

    const email = result.user.email;

if (!email) return;

    const res =
      await axiosPublic.post(
        "/auth/jwt",
        {
          email,
        }
      );

    localStorage.setItem(
      "access-token",
      res.data.token
    );

    const roleRes =
  await axiosPublic.get(
    `/users/role/${email}`
  );

const role =
  roleRes.data.role;

if (role === "admin") {
  router.push(
    "/dashboard/admin"
  );
} else if (
  role === "lawyer"
) {
  router.push(
    "/dashboard/lawyer"
  );
} else {
  router.push("/");
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
  p-6 
  md:p-8 
  shadow-2xl 
  transition-all 
  duration-500
">

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <FaBalanceScale
            size={34}
            className="text-amber-400"
          />

          <h2 className="text-4xl font-bold text-white">
            Login
          </h2>
        </div>

        <p className="text-slate-300 mt-3">
          Welcome back to your account
        </p>
      </div>

      <form
  onSubmit={handleLogin}
  className="space-y-4"
>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="
w-full
bg-white/5
border
border-white/10
rounded-xl
px-4
py-3
text-white
placeholder:text-slate-400
focus:outline-none
focus:border-amber-400
hover:border-white/20
transition-all
duration-300
"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="
w-full
bg-white/5
border
border-white/10
rounded-xl
px-4
py-3
text-white
placeholder:text-slate-400
focus:outline-none
focus:border-amber-400
hover:border-white/20
transition-all
duration-300
"
        />

        <button
          type="submit"
          className="
w-full
py-3
rounded-xl
bg-gradient-to-r
from-amber-500
to-yellow-500
hover:from-amber-600
hover:to-yellow-600
transition-all
duration-300
font-semibold
text-white
"
        >
          Login
        </button>

        <button
  type="button"
  onClick={handleGoogleLogin}
  className="
  w-full
  py-3
  rounded-xl
  border
  border-white/20
  text-white
  hover:bg-white/10
  transition-all
  duration-300
  flex
  items-center
  justify-center
  gap-2
  "
>
  <FaGoogle />
  Continue With Google
</button>

        <div className="text-center">
          <p className="text-slate-300">
            Don't have an account?
            <Link
              href="/register"
              className="ml-2 text-amber-400 font-semibold hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
}