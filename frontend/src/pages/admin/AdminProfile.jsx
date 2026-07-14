import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  KeyRound,
} from "lucide-react";
import api from "../../services/api.js";
import { Spinner } from "../../components/Ui.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminProfile() {

    const { setAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/admin/profile");

      setProfile({
        name: data.admin.name,
        email: data.admin.email,
        role: data.admin.role,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      return toast.error("Name cannot be empty.");
    }

    if (!profile.email.trim()) {
      return toast.error("Email cannot be empty.");
    }

    setSavingProfile(true);

    try {
      const { data } = await api.put("/admin/profile", {
        name: profile.name,
        email: profile.email,
      });

      setProfile((prev) => ({
        ...prev,
        name: data.admin.name,
        email: data.admin.email,
        }));

        setAdmin(data.admin);

        toast.success(data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      return toast.error("Please fill all password fields.");
    }

    if (passwords.newPassword.length < 8) {
      return toast.error(
        "Password must be at least 8 characters."
      );
    }

    if (
      passwords.newPassword !== passwords.confirmPassword
    ) {
      return toast.error("Passwords do not match.");
    }

    setSavingPassword(true);

    try {
      const { data } = await api.put(
        "/admin/profile/password",
        passwords
      );

      toast.success(data.message);

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
        {/* Page Header */}
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
            Admin Profile
            </h1>
            <p className="text-gray-500 mt-1">
            Update your personal information and account credentials.
            </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

            {/* Left Card */}
            <div className="admin-card flex flex-col items-center text-center">

            <div className="w-28 h-28 rounded-full bg-primary-100 flex items-center justify-center mb-5">
                <User className="w-14 h-14 text-primary-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
                {profile.name}
            </h2>

            <p className="text-gray-500 mt-1">
                {profile.email}
            </p>

            <span className="mt-5 inline-flex px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium capitalize">
                {profile.role}
            </span>

            </div>

            {/* Profile Form */}
            <div className="admin-card lg:col-span-2">

            <h2 className="text-xl font-semibold mb-6">
                Profile Information
            </h2>

            <form
                onSubmit={updateProfile}
                className="space-y-6"
            >

                {/* Name */}

                <div>
                <label className="block text-sm font-medium mb-2">
                    Full Name
                </label>

                <div className="relative">

                    <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                    />

                    <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                        setProfile({
                        ...profile,
                        name: e.target.value,
                        })
                    }
                    className="w-full border rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Admin Name"
                    />

                </div>
                </div>

                {/* Email */}

                <div>

                <label className="block text-sm font-medium mb-2">
                    Email Address
                </label>

                <div className="relative">

                    <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                    />

                    <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                        setProfile({
                        ...profile,
                        email: e.target.value,
                        })
                    }
                    className="w-full border rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Email Address"
                    />

                </div>

                </div>

                {/* Save Button */}

                <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary flex items-center gap-2"
                >
                <Save size={18} />

                {savingProfile
                    ? "Saving..."
                    : "Update Profile"}
                </button>

            </form>

            </div>

        </div>
            {/* Change Password */}

        <div className="admin-card">

            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <KeyRound size={22} />
            Change Password
            </h2>

            <form
            onSubmit={updatePassword}
            className="space-y-5"
            >

            {/* Current Password */}

            <div>

                <label className="block text-sm font-medium mb-2">
                Current Password
                </label>

                <div className="relative">

                <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                />

                <input
                    type={showCurrent ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                    setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                    })
                    }
                    className="w-full border rounded-xl pl-11 pr-12 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Current Password"
                />

                <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                </div>

            </div>

            {/* New Password */}

            <div>

                <label className="block text-sm font-medium mb-2">
                New Password
                </label>

                <div className="relative">

                <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                />

                <input
                    type={showNew ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                    setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                    })
                    }
                    className="w-full border rounded-xl pl-11 pr-12 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="New Password"
                />

                <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                </div>

            </div>

            {/* Confirm Password */}

            <div>

                <label className="block text-sm font-medium mb-2">
                Confirm Password
                </label>

                <div className="relative">

                <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                />

                <input
                    type={showConfirm ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                    setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                    })
                    }
                    className="w-full border rounded-xl pl-11 pr-12 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Confirm Password"
                />

                <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                </div>

            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-700">
                <strong>Password Tips:</strong>
                <br />
                • Minimum 8 characters
                <br />
                • Use uppercase & lowercase letters
                <br />
                • Include at least one number
                <br />
                • Use a special character for better security
                </p>
            </div>

            <button
                type="submit"
                disabled={savingPassword}
                className="btn-primary flex items-center gap-2"
            >
                <KeyRound size={18} />

                {savingPassword
                ? "Updating..."
                : "Change Password"}
            </button>

            </form>

        </div>

    </div>
    
  );
}