import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api.js";
import { Spinner } from "../components/Ui.jsx";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get(`/auth/verify-email/${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="section max-w-md text-center">
      {status === "loading" && <Spinner />}
      {status === "success" && (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-3">Email Verified!</h1>
          <p className="text-gray-600 mb-6">Your email has been verified successfully.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-3">Verification Failed</h1>
          <p className="text-gray-600 mb-6">This link is invalid or has expired.</p>
        </>
      )}
      {status !== "loading" && <Link to="/login" className="btn-primary">Go to Login</Link>}
    </div>
  );
}
