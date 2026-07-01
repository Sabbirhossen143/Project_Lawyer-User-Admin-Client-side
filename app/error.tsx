"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Error Found
      </h1>

      <p className="mt-4 text-red-500">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 border px-4 py-2"
      >
        Try Again
      </button>
    </div>
  );
}