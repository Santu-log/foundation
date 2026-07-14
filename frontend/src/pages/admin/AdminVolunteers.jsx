import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-gray-200 text-gray-700",
};

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchVolunteers = () => {
    setLoading(true);
    const params = status ? `?status=${status}` : "";
    api.get(`/volunteers/admin/all${params}`).then(({ data }) => setVolunteers(data.volunteers)).finally(() => setLoading(false));
  };

  useEffect(fetchVolunteers, [status]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/volunteers/admin/${id}/status`, { status: newStatus });
      toast.success(`Volunteer ${newStatus}`);
      fetchVolunteers();
      setSelected(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Volunteers</h1>
        <select className="input w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : volunteers.length === 0 ? (
        <EmptyState message="No volunteer applications found." />
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3">Name</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Availability</th>
                <th className="pb-3">Applied</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v._id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <button onClick={() => setSelected(v)} className="font-medium hover:text-primary-600">{v.name}</button>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{v.email}<br/>{v.phone}</td>
                  <td className="py-3 text-gray-500 capitalize">{v.availability}</td>
                  <td className="py-3 text-gray-500">{format(new Date(v.createdAt), "dd MMM yyyy")}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="py-3 text-right space-x-2 text-xs">
                    {v.status !== "approved" && <button onClick={() => updateStatus(v._id, "approved")} className="text-green-600 font-medium">Approve</button>}
                    {v.status !== "rejected" && <button onClick={() => updateStatus(v._id, "rejected")} className="text-red-600 font-medium">Reject</button>}
                    {v.status === "approved" && <button onClick={() => updateStatus(v._id, "suspended")} className="text-gray-500 font-medium">Suspend</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Volunteer Profile">
        {selected && (
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> {selected.name}</p>
            <p><span className="text-gray-500">Email:</span> {selected.email}</p>
            <p><span className="text-gray-500">Phone:</span> {selected.phone}</p>
            <p><span className="text-gray-500">Address:</span> {selected.address}</p>
            <p><span className="text-gray-500">Age:</span> {selected.age}</p>
            <p><span className="text-gray-500">Occupation:</span> {selected.occupation || "-"}</p>
            <p><span className="text-gray-500">Skills:</span> {selected.skills?.join(", ") || "-"}</p>
            <p><span className="text-gray-500">Availability:</span> {selected.availability}</p>
            <p><span className="text-gray-500">Status:</span> {selected.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
