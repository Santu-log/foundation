import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import EventCard from "../components/EventCard.jsx";
import { Spinner, EmptyState } from "../components/Ui.jsx";

const categories = [
  "All",
  "Blood Donation",
  "Tree Plantation",
  "Health Camp",
  "Education",
  "Food Distribution",
  "Awareness",
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
    api
      .get(`/events${params}`)
      .then(({ data }) => setEvents(data.events))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="section">
      <h1 className="section-title">Events</h1>
      <p className="section-subtitle">Join our upcoming community drives and initiatives.</p>

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
      ) : events.length === 0 ? (
        <EmptyState message="No events found in this category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
