"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import Dropdown from "@/components/dropdown/Dropdown";
import { validateForm } from "@/components/common/ValidationPage";

export default function RegisterForm({ roles = [] }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    phoneNo: "",
    password: "",
    roles: [],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      setMessage(data?.message || "Registration successful");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      setMessage("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Account
        </h2>

        {message && (
          <div className="mb-3 text-center text-blue-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          {/* Email */}
          <input
            name="username"
            placeholder="Email"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username}</p>
          )}

          <Dropdown
            name="roles"
            label="Role"
            placeholder="Select Roles"
            options={roles}
            disableFetch
            multiple
            optionValue={(item) => item}
            optionLabel={(item) => item}
            value={form.roles}
            onChange={handleChange}
          />
          {errors.roles && (
            <p className="text-red-500">{errors.roles}</p>
          )}

          <input
            name="phoneNo"
            placeholder="Phone"
            value={form.phoneNo}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
          {errors.phoneNo && (
            <p className="text-red-500">{errors.phoneNo}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-3 rounded pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

RegisterForm.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};