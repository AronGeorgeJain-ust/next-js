"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { validateForm } from "@/components/common/ValidationPage";

export default function LoginPage() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const validationErrors = validateForm(credentials);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(
        "http://localhost:8080/api/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();
      const token = data?.token;
      const roles = data?.roles || [];

      if (!response.ok || !token || token === "Error") {
        setMessage(
          data?.message ||
            data?.error ||
            "Invalid username or password"
        );
        setMessageType("error");
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("username", credentials.username);
        localStorage.setItem("userRoles", JSON.stringify(roles));

        setMessage("Login successful");

        setTimeout(() => {
          router.push("/home");
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to your POS account
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm font-medium text-center ${
              messageType === "error"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="text-sm text-gray-600 font-medium">
              Email
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-500">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-600 font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}