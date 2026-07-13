import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import { Spinner } from "../components/Ui.jsx";

export default function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setSettings(data.settings));
  }, []);

  if (!settings) return <Spinner className="min-h-[50vh]" />;

  return (
    <div>
      <section className="bg-primary-700 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">About Sadhana Foundation</h1>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto px-4">
          {settings.ngoIntro || "Empowering communities since our founding."}
        </p>
      </section>

      <div className="section grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Our History</h2>
          <p className="text-gray-600 leading-relaxed">{settings.history || "Our journey began with a simple mission: to serve."}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3">Founder's Message</h2>
          <p className="text-gray-600 leading-relaxed">{settings.founderMessage || "Every act of kindness creates ripples of change."}</p>
        </div>
      </div>

      <div className="section bg-gray-50 grid md:grid-cols-2 gap-8">
        <div className="card p-8">
          <h3 className="text-xl font-semibold mb-2 text-primary-700">Our Mission</h3>
          <p className="text-gray-600">{settings.mission}</p>
        </div>
        <div className="card p-8">
          <h3 className="text-xl font-semibold mb-2 text-accent-600">Our Vision</h3>
          <p className="text-gray-600">{settings.vision}</p>
        </div>
      </div>

      {settings.values?.length > 0 && (
        <div className="section">
          <h2 className="section-title text-center">Our Values</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {settings.values.map((v) => (
              <span key={v} className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {settings.teamMembers?.length > 0 && (
        <div className="section bg-gray-50">
          <h2 className="section-title text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {settings.teamMembers.map((m, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-3">
                  {m.photo && <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />}
                </div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-gray-500">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
