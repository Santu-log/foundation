import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import api from "../services/api.js";
import { Spinner, EmptyState } from "../components/Ui.jsx";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const timeout = setTimeout(() => {
      api.get(`/blogs${params}`).then(({ data }) => setBlogs(data.blogs)).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="section">
      <h1 className="section-title">Blogs & News</h1>
      <p className="section-subtitle">Stories from the field, event updates, and awareness articles.</p>

      <input
        placeholder="Search articles..."
        className="input max-w-sm mb-8"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Spinner />
      ) : blogs.length === 0 ? (
        <EmptyState message="No articles found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Link key={b._id} to={`/blogs/${b.slug}`} className="card">
              <div className="h-44 bg-gray-100">
                {b.coverImage && <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-primary-600 uppercase">{b.category}</span>
                <h3 className="font-semibold text-lg mt-1 mb-2 line-clamp-2">{b.title}</h3>
                <p className="text-sm text-gray-500">{format(new Date(b.createdAt), "dd MMM yyyy")}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
