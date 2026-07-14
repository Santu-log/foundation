import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import CauseCard from "../components/CauseCard.jsx";
import { Spinner, EmptyState } from "../components/Ui.jsx";

export default function Causes() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/causes")
      .then(({ data }) => setCauses(data.causes))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section">
      <h1 className="section-title">Our Causes</h1>
      <p className="section-subtitle">
        Every contribution, big or small, helps us drive lasting change in education, health, food security, and beyond.
      </p>
      {loading ? (
        <Spinner />
      ) : causes.length === 0 ? (
        <EmptyState message="No active causes right now." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {causes.map((c) => (
            <CauseCard key={c._id} cause={c} />
          ))}
        </div>
      )}
    </div>
  );
}
