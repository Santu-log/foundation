import React, { useEffect, useState } from "react";
import { Plus, Trash2, Check, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", review: "", rating: 5 });
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = () => {
    setLoading(true);
    api.get("/testimonials/admin/all").then(({ data }) => setTestimonials(data.testimonials)).finally(() => setLoading(false));
  };

  useEffect(fetchTestimonials, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append("photo", photoFile);
      await api.post("/testimonials/admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Testimonial added");
      setModalOpen(false);
      setForm({ name: "", review: "", rating: 5 });
      fetchTestimonials();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const approve = async (id) => {
    try {
      await api.put(`/testimonials/admin/${id}`, { isApproved: true });
      fetchTestimonials();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await api.delete(`/testimonials/admin/${id}`);
      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Testimonials</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : testimonials.length === 0 ? (
        <EmptyState message="No testimonials yet." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t._id} className="admin-card">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="flex gap-2">
                  {!t.isApproved && <button onClick={() => approve(t._id)} className="text-green-600"><Check className="w-4 h-4" /></button>}
                  <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">"{t.review}"</p>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{t.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {t.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Testimonial">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Review</label>
            <textarea required rows={3} className="input" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} />
          </div>
          <div>
            <label className="label">Rating</label>
            <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
            </select>
          </div>
          <div>
            <label className="label">Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="text-sm" />
          </div>
          <button disabled={saving} className="btn-primary w-full">{saving ? "Saving..." : "Add Testimonial"}</button>
        </form>
      </Modal>
    </div>
  );
}
