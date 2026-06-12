"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, User } from "lucide-react";

export default function Navbar({ collapsed, onToggleCollapse }) {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "4rem",
        zIndex: 50,
        background: "linear-gradient(to right, #0c4a6e, #0891b2, #1e293b)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
      }}
      className="flex items-center justify-between px-4 text-white"
    >
      {/* Left — hamburger + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "0.75rem",
            width: "2.25rem",
            height: "2.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          <Menu size={18} />
        </button>

        <span className="text-lg font-semibold tracking-wide">POS</span>
        <span
          className="hidden md:block text-sm"
          style={{ color: "rgba(186,230,253,0.85)" }}
        >
          Point of Sale
        </span>
      </div>

      {/* Right — username, profile, logout */}
      <div className="flex items-center gap-2">
        {username && (
          <span
            className="hidden md:block text-sm"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Hello, {username}
          </span>
        )}

        <Link
          href="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "0.75rem",
            padding: "0.4rem 0.75rem",
            color: "#fff",
            fontSize: "0.875rem",
            textDecoration: "none",
          }}
        >
          <User size={16} />
          <span className="hidden sm:inline">Profile</span>
        </Link>

        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            backgroundColor: "#ef4444",
            border: "none",
            borderRadius: "0.75rem",
            padding: "0.4rem 0.75rem",
            color: "#fff",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};