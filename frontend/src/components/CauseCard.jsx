import React from "react";
import { Link } from "react-router-dom";

export default function CauseCard({ cause }) {
  const percent = cause.goalAmount ? Math.min(100, Math.round((cause.raisedAmount / cause.goalAmount) * 100)) : 0;

  return (
    <div className="card flex flex-col">
      <div className="h-44 bg-gray-100">
        {cause.image ? (
          <img src={cause.image} alt={cause.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-500/20" />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-2">{cause.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{cause.description}</p>

        {cause.goalAmount > 0 && (
          <div className="mb-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full" style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1.5">
              <span>₹{cause.raisedAmount.toLocaleString("en-IN")} raised</span>
              <span>{percent}% of ₹{cause.goalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        <Link to={`/donate?cause=${cause._id}`} className="btn-primary text-sm w-full">
          Donate to this Cause
        </Link>
      </div>
    </div>
  );
}
