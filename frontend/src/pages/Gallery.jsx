import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../services/api.js";
import { Spinner, EmptyState } from "../components/Ui.jsx";

const categories = [
  "All",
  "Education",
  "Food Distribution",
  "Medical Camps",
  "Plantation",
  "Volunteers",
  "Awareness Programs",
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
    api
      .get(`/gallery${params}`)
      .then(({ data }) => setImages(data.images))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="section">
      <h1 className="section-title">Gallery</h1>
      <p className="section-subtitle">A visual journey through our events and community work.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === c ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : images.length === 0 ? (
        <EmptyState message="No images in this category yet." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <button
              key={img._id}
              onClick={() => setLightbox(img)}
              className="aspect-square rounded-xl overflow-hidden group relative"
            >
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white" onClick={() => setLightbox(null)}>
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full">
            <img src={lightbox.imageUrl} alt={lightbox.caption} className="w-full max-h-[80vh] object-contain rounded-lg" />
            {lightbox.caption && <p className="text-white text-center mt-4">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
