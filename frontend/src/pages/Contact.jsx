import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setSettings(data.settings));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="section-title">Get in Touch</h1>
        <p className="section-subtitle">
          Have a question, partnership idea, or just want to say hello? We'd love to hear from you.
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-primary-600" /> {settings?.address || "Howrah, West Bengal, India"}
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-5 h-5 text-primary-600" /> {settings?.phone || "+91-00000-00000"}
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-5 h-5 text-primary-600" /> {settings?.email || "contact@sadhanafoundation.org"}
          </div>
        </div>
        {settings?.mapEmbedUrl && (
          <iframe
            title="location-map"
            src={settings.mapEmbedUrl}
            className="w-full h-64 rounded-xl border-0"
            loading="lazy"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-4 h-fit">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">Subject</label>
          <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea required rows={5} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button disabled={submitting} className="btn-primary w-full">
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
