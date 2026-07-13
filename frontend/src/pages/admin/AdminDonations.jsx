import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";

const statusColors = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = status ? `?status=${status}` : "";
    api.get(`/donations/admin/all${params}`).then(({ data }) => setDonations(data.donations)).finally(() => setLoading(false));
  }, [status]);

  const exportFile = async (type) => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`/api/donations/admin/export/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations.${type === "excel" ? "xlsx" : type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalSuccess = donations.filter((d) => d.paymentStatus === "success").reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Manage Donations</h1>
        <div className="flex gap-2">
          <button onClick={() => exportFile("csv")} className="btn-outline text-sm flex items-center gap-1.5"><Download className="w-4 h-4" /> CSV</button>
          <button onClick={() => exportFile("excel")} className="btn-outline text-sm flex items-center gap-1.5"><Download className="w-4 h-4" /> Excel</button>
          <button onClick={() => exportFile("pdf")} className="btn-outline text-sm flex items-center gap-1.5"><Download className="w-4 h-4" /> PDF</button>
        </div>
      </div>

      <div className="admin-card mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Raised (successful)</p>
          <p className="text-2xl font-bold text-primary-600">₹{totalSuccess.toLocaleString("en-IN")}</p>
        </div>
        <select className="input w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : donations.length === 0 ? (
        <EmptyState message="No donations found." />
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3">Donor</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Cause</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Receipt</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-gray-400">{d.email}</div>
                  </td>
                  <td className="py-3 font-medium">₹{d.amount}</td>
                  <td className="py-3 text-gray-500">{d.cause?.title || "General Fund"}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[d.paymentStatus]}`}>{d.paymentStatus}</span>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{d.receiptNumber || "-"}</td>
                  <td className="py-3 text-gray-500">{format(new Date(d.createdAt), "dd MMM yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
