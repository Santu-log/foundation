import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HandCoins, CalendarDays, Users, Images, Newspaper, UserCircle } from "lucide-react";
import api from "../../services/api.js";
import { StatCard, Spinner } from "../../components/Ui.jsx";

const monthLabel = (year, month) =>
  new Date(year, month - 1).toLocaleString("default", { month: "short", year: "2-digit" });

export default function AdminDashboardHome() {
  const [overview, setOverview] = useState(null);
  const [donationChart, setDonationChart] = useState([]);
  const [volunteerChart, setVolunteerChart] = useState([]);
  const [eventChart, setEventChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard/overview"),
      api.get("/admin/dashboard/charts/donations"),
      api.get("/admin/dashboard/charts/volunteers"),
      api.get("/admin/dashboard/charts/events"),
    ])
      .then(([o, d, v, e]) => {
        setOverview(o.data.overview);
        setDonationChart(d.data.data.map((x) => ({ month: monthLabel(x._id.year, x._id.month), total: x.total })));
        setVolunteerChart(v.data.data.map((x) => ({ month: monthLabel(x._id.year, x._id.month), count: x.count })));
        setEventChart(e.data.data.map((x) => ({ name: x.event.slice(0, 12), registered: x.registered })));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard icon={HandCoins} label="Total Donations" value={`₹${overview.totalDonations.toLocaleString("en-IN")}`} color="primary" />
        <StatCard icon={CalendarDays} label="Total Events" value={overview.totalEvents} color="blue" />
        <StatCard icon={Users} label="Total Volunteers" value={overview.totalVolunteers} color="accent" />
        <StatCard icon={Images} label="Gallery Images" value={overview.galleryImages} color="amber" />
        <StatCard icon={Newspaper} label="Blog Posts" value={overview.blogPosts} color="rose" />
        <StatCard icon={UserCircle} label="Registered Users" value={overview.registeredUsers} color="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <h3 className="font-semibold mb-4">Monthly Donations (₹)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={donationChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#ea580c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <h3 className="font-semibold mb-4">Volunteer Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={volunteerChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card lg:col-span-2">
          <h3 className="font-semibold mb-4">Event Participation (Recent 12)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eventChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="registered" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
