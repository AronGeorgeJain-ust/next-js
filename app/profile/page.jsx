"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: "",
    role: "",
    name: "",
  });

  useEffect(() => {
    if (globalThis.window) {
      setProfile({
        username: globalThis.window.localStorage.getItem("username") || "",
        role: globalThis.window.localStorage.getItem("userRoles") || "",
        name: globalThis.window.localStorage.getItem("name") || "",
      });
    }
  }, []);

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your account information and profile settings.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Username
            </p>
            <p className="mt-2 text-lg font-medium text-slate-900">
              {profile.username || "Not available"}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Role
            </p>
            <p className="mt-2 text-lg font-medium text-slate-900">
              {profile.role || "Not available"}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Email
            </p>
            <p className="mt-2 text-lg font-medium text-slate-900">
              {profile.email || "Not available"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Keep your profile up to date
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your user settings when your contact or role changes.
            </p>
          </div>

          <Link
            href="/user"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
