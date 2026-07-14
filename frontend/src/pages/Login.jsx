import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginUser(form.email, form.password);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-md">
      <h1 className="section-title text-center">Welcome Back</h1>
      <p className="section-subtitle text-center mx-auto">Log in to track your donations, events, and volunteer status.</p>
      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="label">Email</label>
          <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input required type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-primary-600">Forgot password?</Link>
        </div>
        <button disabled={submitting} className="btn-primary w-full">
          {submitting ? "Logging in..." : "Log In"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary-600 font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}
