import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import { RequireUser, RequireAdmin } from "./components/RouteGuards.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Causes from "./pages/Causes.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Gallery from "./pages/Gallery.jsx";
import Volunteer from "./pages/Volunteer.jsx";
import Donate from "./pages/Donate.jsx";
import DonateThankYou from "./pages/DonateThankYou.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome.jsx";
import AdminEvents from "./pages/admin/AdminEvents.jsx";
import AdminGallery from "./pages/admin/AdminGallery.jsx";
import AdminDonations from "./pages/admin/AdminDonations.jsx";
import AdminVolunteers from "./pages/admin/AdminVolunteers.jsx";
import AdminCauses from "./pages/admin/AdminCauses.jsx";
import AdminBlogs from "./pages/admin/AdminBlogs.jsx";
import AdminTestimonials from "./pages/admin/AdminTestimonials.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import AdminHomepageCMS from "./pages/admin/AdminHomepageCMS.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/causes" element={<Causes />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/thank-you" element={<DonateThankYou />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <RequireUser>
                <Dashboard />
              </RequireUser>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="causes" element={<AdminCauses />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="homepage" element={<AdminHomepageCMS />} />
        </Route>
      </Routes>
    </>
  );
}
