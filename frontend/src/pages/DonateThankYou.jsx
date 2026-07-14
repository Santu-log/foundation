import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import api from "../services/api.js";
import { Spinner } from "../components/Ui.jsx";

export default function DonateThankYou() {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get("donationId");
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!donationId) return setLoading(false);
    api
      .get(`/donations/${donationId}/receipt`)
      .then(({ data }) => setDonation(data.donation))
      .finally(() => setLoading(false));
  }, [donationId]);

  if (loading) return <Spinner className="min-h-[50vh]" />;

  return (
    <div className="section max-w-lg text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thank You for Your Generosity!</h1>
      <p className="text-gray-600 mb-8">Your donation makes a real difference in someone's life.</p>

      {donation && (
        <div className="card p-6 text-left space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Donor</span><span className="font-medium">{donation.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-medium">₹{donation.amount}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Cause</span><span className="font-medium">{donation.cause?.title || "General Fund"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Receipt No.</span><span className="font-medium">{donation.receiptNumber}</span></div>
        </div>
      )}

      <Link to="/" className="btn-primary mt-8 inline-flex">Back to Home</Link>
    </div>
  );
}
