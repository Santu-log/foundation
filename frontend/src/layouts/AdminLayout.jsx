import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Images,
  HandCoins,
  Users,
  Newspaper,
  MessageSquareQuote,
  Mail,
  Settings,
  LogOut,
  Heart,
  HeartHandshake,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/donations", label: "Donations", icon: HandCoins },
  { to: "/admin/volunteers", label: "Volunteers", icon: Users },
  { to: "/admin/causes", label: "Causes", icon: HeartHandshake },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/messages", label: "Contact Messages", icon: Mail },
  { to: "/admin/homepage", label: "Homepage CMS", icon: Settings },
  { to: "/admin/profile", label: "Profile", icon: UserCircle },
];

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-6 h-16 text-white font-bold border-b border-gray-800">
          <Heart className="w-5 h-5 fill-primary-500 text-primary-500" />
          Admin Panel
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary-600 text-white" : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-3">

            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-400">
                Logged in as
              </p>

              <p className="text-sm text-white font-semibold truncate">
                {admin?.name}
              </p>
            </div>

          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 lg:p-8">
          <div className="mb-5 flex justify-end">
            <LanguageToggle />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
