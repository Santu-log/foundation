import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-md">
      <h1 className="section-title text-center">Reset Password</h1>
      <p className="section-subtitle text-center mx-auto">Enter your email and we'll send you a reset link.</p>
      {sent ? (
        <div className="card p-8 text-center text-gray-600">
          If an account exists for {email}, a password reset link has been sent.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button disabled={submitting} className="btn-primary w-full">
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
