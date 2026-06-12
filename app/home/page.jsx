"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto mt-10">
        <div className="rounded-4xl bg-white p-10 shadow-xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to Dashboard
          </h1>

          <p className="text-gray-600 mb-6">
            You are successfully logged in.
          </p>

          <div className="flex gap-4">

            <Link
              href="/profile"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
