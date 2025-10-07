"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ className = "w-full mb-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow flex items-center justify-center transition" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={() => router.back()}
      style={{ maxWidth: 480 }}
    >
      <span className="mr-2 text-lg">←</span> Back
    </button>
  );
}
