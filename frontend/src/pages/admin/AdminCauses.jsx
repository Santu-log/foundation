import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

const emptyForm = { title: "", description: "", goalAmount: 0 };

export default function AdminCauses() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCauses = () => {
    setLoading(true);
    api.get("/causes/admin/all").then(({ data }) => setCauses(data.causes)).finally(() => setLoading(false));
  };

  useEffect(fetchCauses, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (cause) => {
    setEditing(cause);
    setForm({ title: cause.title, description: cause.description, goalAmount: cause.goalAmount });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await api.put(`/causes/admin/${editing._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Cause updated");
      } else {
        await api.post("/causes/admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Cause created");
      }
      setModalOpen(false);
      fetchCauses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this cause?")) return;
    try {
      await api.delete(`/causes/admin/${id}`);
      toast.success("Cause deleted");
      fetchCauses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Causes</h1>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Cause
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : causes.length === 0 ? (
        <EmptyState message="No causes yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {causes.map((c) => (
            <div key={c._id} className="admin-card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{c.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.description}</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-primary-600" style={{ width: `${c.progressPercent || 0}%` }} />
              </div>
              <p className="text-xs text-gray-400">₹{c.raisedAmount.toLocaleString("en-IN")} / ₹{c.goalAmount.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Cause" : "Add Cause"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Goal Amount (₹)</label>
            <input type="number" min="0" className="input" value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: e.target.value })} />
          </div>
          <div>
            <label className="label">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
          </div>
          <button disabled={saving} className="btn-primary w-full">{saving ? "Saving..." : editing ? "Update Cause" : "Create Cause"}</button>
        </form>
      </Modal>
    </div>
  );
}
