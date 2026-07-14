import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const presetAmounts = [100, 500, 1000, 5000];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Donate() {
  const [searchParams] = useSearchParams();
  const causeId = searchParams.get("cause") || "";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [causes, setCauses] = useState([]);
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    causeId,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/causes").then(({ data }) => setCauses(data.causes));
  }, []);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 1) return toast.error("Please enter a valid amount");

    setSubmitting(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Unable to load payment gateway. Check your connection.");
        setSubmitting(false);
        return;
      }

      const { data } = await api.post("/donations/create-order", {
        ...form,
        amount: finalAmount,
      });

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: "Sadhana Foundation",
        description: "Donation",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post("/donations/verify", {
              ...response,
              donationId: data.donationId,
            });
            navigate(`/donate/thank-you?donationId=${data.donationId}`);
          } catch (err) {
            toast.error("Payment verification failed. Contact support if amount was deducted.");
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#ea580c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-xl">
      <h1 className="section-title">Make a Donation</h1>
      <p className="section-subtitle">
        Your contribution directly supports education, food, health, and welfare programs for those who need it most.
      </p>

      <form onSubmit={handleDonate} className="card p-8 space-y-6">
        <div>
          <label className="label">Choose an Amount (₹)</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetAmounts.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => { setAmount(a); setCustomAmount(""); }}
                className={`py-2 rounded-lg text-sm font-medium border-2 ${
                  amount === a && !customAmount
                    ? "bg-primary-600 border-primary-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-primary-300"
                }`}
              >
                ₹{a}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            placeholder="Or enter custom amount"
            className="input"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Donate towards (optional)</label>
          <select className="input" value={form.causeId} onChange={(e) => setForm({ ...form, causeId: e.target.value })}>
            <option value="">General Fund</option>
            {causes.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Phone</label>
          <input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <button disabled={submitting} className="btn-primary w-full text-lg">
          {submitting ? "Processing..." : `Donate ₹${finalAmount || 0}`}
        </button>
        <p className="text-xs text-gray-400 text-center">Secured by Razorpay. You'll receive a receipt via email.</p>
      </form>
    </div>
  );
}
