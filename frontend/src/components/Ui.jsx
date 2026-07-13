import React from "react";

export function Spinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

const colorMap = {
  primary: "bg-primary-100 text-primary-600",
  accent: "bg-accent-500/10 text-accent-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
};

export function StatCard({ icon: Icon, label, value, color = "primary" }) {
  return (
    <div className="admin-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.primary}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet." }) {
  return <div className="text-center text-gray-400 py-16">{message}</div>;
}
