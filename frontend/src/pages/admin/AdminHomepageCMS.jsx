import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner } from "../../components/Ui.jsx";

export default function AdminHomepageCMS() {
  const [settings, setSettings] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setSettings(data.settings));
  }, []);

  const update = (path, value) => {
    setSettings((prev) => {
      const clone = structuredClone(prev);
      const keys = path.split(".");
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("heroTitle", settings.heroTitle || "");
      fd.append("heroSubtitle", settings.heroSubtitle || "");
      fd.append("ngoIntro", settings.ngoIntro || "");
      fd.append("history", settings.history || "");
      fd.append("mission", settings.mission || "");
      fd.append("vision", settings.vision || "");
      fd.append("founderMessage", settings.founderMessage || "");
      fd.append("address", settings.address || "");
      fd.append("phone", settings.phone || "");
      fd.append("email", settings.email || "");
      fd.append("mapEmbedUrl", settings.mapEmbedUrl || "");
      fd.append("stats", JSON.stringify(settings.stats));
      fd.append("socialLinks", JSON.stringify(settings.socialLinks));
      fd.append("values", JSON.stringify(settings.values || []));
      if (heroFile) fd.append("heroImage", heroFile);

      const { data } = await api.put("/settings/admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSettings(data.settings);
      toast.success("Homepage updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Homepage CMS</h1>
      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        <section className="admin-card space-y-4">
          <h3 className="font-semibold">Hero Banner</h3>
          <div>
            <label className="label">Hero Title</label>
            <input className="input" value={settings.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
          </div>
          <div>
            <label className="label">Hero Subtitle</label>
            <textarea rows={2} className="input" value={settings.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} />
          </div>
          <div>
            <label className="label">Hero Background Image</label>
            <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files[0])} className="text-sm" />
          </div>
        </section>

        <section className="admin-card space-y-4">
          <h3 className="font-semibold">About Section</h3>
          <div>
            <label className="label">NGO Introduction</label>
            <textarea rows={3} className="input" value={settings.ngoIntro} onChange={(e) => update("ngoIntro", e.target.value)} />
          </div>
          <div>
            <label className="label">History</label>
            <textarea rows={3} className="input" value={settings.history} onChange={(e) => update("history", e.target.value)} />
          </div>
          <div>
            <label className="label">Founder's Message</label>
            <textarea rows={3} className="input" value={settings.founderMessage} onChange={(e) => update("founderMessage", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Mission</label>
              <textarea rows={3} className="input" value={settings.mission} onChange={(e) => update("mission", e.target.value)} />
            </div>
            <div>
              <label className="label">Vision</label>
              <textarea rows={3} className="input" value={settings.vision} onChange={(e) => update("vision", e.target.value)} />
            </div>
          </div>
        </section>

        <section className="admin-card space-y-4">
          <h3 className="font-semibold">Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Villages Served</label>
              <input type="number" className="input" value={settings.stats.villagesServed} onChange={(e) => update("stats.villagesServed", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Volunteers</label>
              <input type="number" className="input" value={settings.stats.volunteers} onChange={(e) => update("stats.volunteers", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">People Helped</label>
              <input type="number" className="input" value={settings.stats.peopleHelped} onChange={(e) => update("stats.peopleHelped", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Events Organized</label>
              <input type="number" className="input" value={settings.stats.eventsOrganized} onChange={(e) => update("stats.eventsOrganized", Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Funds Raised (₹)</label>
              <input type="number" className="input" value={settings.stats.fundsRaised} onChange={(e) => update("stats.fundsRaised", Number(e.target.value))} />
            </div>
          </div>
        </section>

        <section className="admin-card space-y-4">
          <h3 className="font-semibold">Footer & Contact</h3>
          <div>
            <label className="label">Address</label>
            <input className="input" value={settings.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input className="input" value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={settings.email} onChange={(e) => update("email", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Google Map Embed URL</label>
            <input className="input" value={settings.mapEmbedUrl} onChange={(e) => update("mapEmbedUrl", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Facebook</label>
              <input className="input" value={settings.socialLinks?.facebook || ""} onChange={(e) => update("socialLinks.facebook", e.target.value)} />
            </div>
            <div>
              <label className="label">Instagram</label>
              <input className="input" value={settings.socialLinks?.instagram || ""} onChange={(e) => update("socialLinks.instagram", e.target.value)} />
            </div>
            <div>
              <label className="label">Twitter / X</label>
              <input className="input" value={settings.socialLinks?.twitter || ""} onChange={(e) => update("socialLinks.twitter", e.target.value)} />
            </div>
            <div>
              <label className="label">YouTube</label>
              <input className="input" value={settings.socialLinks?.youtube || ""} onChange={(e) => update("socialLinks.youtube", e.target.value)} />
            </div>
          </div>
        </section>

        <button disabled={saving} className="btn-primary w-full">{saving ? "Saving..." : "Save Homepage Settings"}</button>
      </form>
    </div>
  );
}
