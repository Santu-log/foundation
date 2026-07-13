import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, MapPin, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { Spinner } from "../components/Ui.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "" });

  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then(({ data }) => setEvent(data.event))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/events/${id}/register`, form);
      toast.success("Registered successfully! See you there.");
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner className="min-h-[50vh]" />;
  if (!event) return <div className="section text-center text-gray-400">Event not found.</div>;

  const closed = event.status === "registration_closed" || event.status === "completed";
  const full = event.registrationLimit > 0 && event.registeredUsers.length >= event.registrationLimit;

  return (
    <div className="section grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <div className="h-72 rounded-2xl overflow-hidden bg-gray-100 mb-6">
          {event.image ? (
            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <CalendarDays className="w-16 h-16" />
            </div>
          )}
        </div>
        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{event.category}</span>
        <h1 className="text-3xl font-bold mt-2 mb-4">{event.name}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />{format(new Date(event.date), "dd MMMM yyyy")}{event.time ? ` • ${event.time}` : ""}</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.venue}</div>
          <div className="flex items-center gap-2"><UserIcon className="w-4 h-4" />Organized by {event.organizer}</div>
        </div>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
      </div>

      <div>
        <div className="card p-6 sticky top-24">
          <h3 className="font-semibold text-lg mb-4">Register for this Event</h3>
          {closed || full ? (
            <p className="text-sm text-gray-500">
              {full ? "Registration limit reached." : "Registration is closed for this event."}
            </p>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Email</label>
                <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button disabled={submitting} className="btn-primary w-full">
                {submitting ? "Registering..." : "Register Now"}
              </button>
            </form>
          )}
          {event.registrationLimit > 0 && (
            <p className="text-xs text-gray-400 mt-4">
              {event.registeredUsers.length} / {event.registrationLimit} spots filled
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
