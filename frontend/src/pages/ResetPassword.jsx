import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api.js";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-md">
      <h1 className="section-title text-center">Set a New Password</h1>
      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="label">New Password</label>
          <input required type="password" minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={submitting} className="btn-primary w-full">
          {submitting ? "Saving..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
