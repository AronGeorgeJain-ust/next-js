"use client";

import PropTypes from "prop-types";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const authRoutes = new Set(["/login", "/register"]);

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.has(pathname);
  const [collapsed, setCollapsed] = useState(false);

  if (isAuthRoute) return children;

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar collapsed={collapsed} onToggleCollapse={toggle} />

      <Sidebar collapsed={collapsed} onToggleCollapse={toggle} />

      <main
        style={{
          marginTop: "4rem",
          marginLeft: collapsed ? "0" : "16rem",
          transition: "margin-left 0.3s ease",
          minHeight: "calc(100vh - 4rem)",
          backgroundColor: "#f1f5f9",
        }}
      >
        {children}
      </main>
    </div>
  );
}

AppShell.propTypes = {
  children: PropTypes.node.isRequired,
};
