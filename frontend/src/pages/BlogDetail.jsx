import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import api from "../services/api.js";
import { Spinner } from "../components/Ui.jsx";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/blogs/${slug}`)
      .then(({ data }) => setBlog(data.blog))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!blog) return <div className="section text-center text-gray-400">Article not found.</div>;

  return (
    <article className="section max-w-3xl">
      <Link to="/blogs" className="inline-flex items-center gap-1 text-sm text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </Link>
      <span className="text-xs font-semibold text-primary-600 uppercase">{blog.category}</span>
      <h1 className="text-3xl font-bold mt-2 mb-3">{blog.title}</h1>
      <p className="text-sm text-gray-400 mb-6">{format(new Date(blog.createdAt), "dd MMMM yyyy")} • {blog.views} views</p>
      {blog.coverImage && (
        <img src={blog.coverImage} alt={blog.title} className="w-full rounded-2xl mb-8 max-h-96 object-cover" />
      )}
      <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />
      {blog.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {blog.tags.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">#{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}
