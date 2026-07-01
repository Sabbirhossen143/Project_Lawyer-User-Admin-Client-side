"use client";

import { Toaster } from "react-hot-toast";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      <Toaster
  position="top-center"
  containerStyle={{
    top: 90,
  }}
  toastOptions={{
    duration: 3000,
    style: {
      background: "#0B1220",
      color: "#fff",
      border:
        "1px solid rgba(245,158,11,.3)",
      padding: "16px 20px",
      borderRadius: "16px",
    },
  }}
/>
    </>
  );
}