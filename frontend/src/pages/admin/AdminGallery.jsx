import React, { useEffect, useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

const categories = ["Education", "Food Distribution", "Medical Camps", "Plantation", "Volunteers", "Awareness Programs"];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState(categories[0]);
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    api.get("/gallery").then(({ data }) => setImages(data.images)).finally(() => setLoading(false));
  };

  useEffect(fetchImages, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return toast.error("Select at least one image");
    setSaving(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("images", f));
      fd.append("category", category);
      fd.append("caption", caption);
      await api.post("/gallery/admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Images uploaded");
      setModalOpen(false);
      setFiles([]);
      setCaption("");
      fetchImages();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (img) => {
    try {
      await api.put(`/gallery/admin/${img._id}`, { isFeatured: !img.isFeatured });
      fetchImages();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/gallery/admin/${id}`);
      toast.success("Image deleted");
      fetchImages();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Gallery</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload Images
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : images.length === 0 ? (
        <EmptyState message="No images uploaded yet." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img._id} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <span className="text-white text-xs">{img.category}</span>
                <div className="flex gap-2">
                  <button onClick={() => toggleFeatured(img)} className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                    <Star className={`w-4 h-4 ${img.isFeatured ? "fill-amber-400 text-amber-400" : "text-white"}`} />
                  </button>
                  <button onClick={() => handleDelete(img._id)} className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Images">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="label">Images (JPG, PNG, WEBP)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="text-sm" />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Caption (optional)</label>
            <input className="input" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          <button disabled={saving} className="btn-primary w-full">{saving ? "Uploading..." : "Upload"}</button>
        </form>
      </Modal>
    </div>
  );
}
