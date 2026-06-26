"use client";

import PropTypes from "prop-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import api from "@/services/api";

export default function Sidebar({
  collapsed = false,
  onToggleCollapse = () => {},
}) {
  const pathname = usePathname();

  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchNodes = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await api.get("/node/listnodeforroles", { headers });
        const data = response.data;

        if (!mounted) return;

        if (Array.isArray(data)) setNodes(data);
        else if (Array.isArray(data?.nodes)) setNodes(data.nodes);
        else if (Array.isArray(data?.content)) setNodes(data.content);
        else setNodes([]);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside
      style={{
        backgroundColor: "#0f172a",
        transform: collapsed ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.3s ease",
        top: 0,
        paddingTop: "4rem",
        height: "100vh",
        position: "fixed",
        left: 0,
        width: "16rem",
        zIndex: 40,
      }}
      className="text-white flex flex-col shadow-2xl"
    >
      <div className="flex-1 overflow-y-auto space-y-1.5 px-4 py-4">
        {loading && (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 rounded-xl"
                style={{ backgroundColor: "rgba(51,65,85,0.5)" }}
              />
            ))}
          </div>
        )}

        {error && (
          <div
            className="text-red-200 text-sm p-3 rounded-xl"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          >
            {error}
          </div>
        )}

        {!loading && !error && nodes.length === 0 && (
          <div className="text-sm px-2" style={{ color: "#94a3b8" }}>
            No menu items available
          </div>
        )}

        {!loading &&
          !error &&
          nodes.map((node, index) => {
            const title =
              node.identifier ||
              node.name ||
              node.label ||
              node.path ||
              `Item ${index + 1}`;
            const path = node.path || "#";
            const isActive = pathname === path;

            return (
              <Link
                key={node.identifier || index}
                href={path}
                title={title}
                style={
                  isActive
                    ? { backgroundColor: "#06b6d4", color: "#ffffff" }
                    : { color: "#cbd5e1" }
                }
                className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive ? "shadow-md" : "hover:translate-x-1"
                }`}
              >
                {title}
              </Link>
            );
          })}
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
};
