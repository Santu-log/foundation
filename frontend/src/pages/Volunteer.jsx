import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  age: "",
  occupation: "",
  skills: "",
  availability: "flexible",
};

export default function Volunteer() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    name: user?.name || "",
    email: user?.email || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/volunteers", form);
      setDone(true);
      toast.success("Application submitted!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-2xl">
      <h1 className="section-title">Become a Volunteer</h1>
      <p className="section-subtitle">
        Give your time and skills to causes that matter. Fill out the form below and our team will reach out.
      </p>

      {done ? (
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Thank you for applying!</h3>
          <p className="text-gray-600">We've received your application and will review it shortly. You'll be notified by email once approved.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input required name="name" className="input" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Email</label>
              <input required type="email" name="email" className="input" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input required name="phone" className="input" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Age</label>
              <input required type="number" min="15" name="age" className="input" value={form.age} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="label">Address</label>
            <input required name="address" className="input" value={form.address} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Occupation</label>
            <input name="occupation" className="input" value={form.occupation} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Skills (comma-separated)</label>
            <input name="skills" placeholder="e.g. First Aid, Teaching, Photography" className="input" value={form.skills} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Availability</label>
            <select name="availability" className="input" value={form.availability} onChange={handleChange}>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <button disabled={submitting} className="btn-primary w-full">
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
}
