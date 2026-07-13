import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function EventCard({ event }) {
  return (
    <div className="card flex flex-col">
      <div className="h-48 bg-gray-100 overflow-hidden">
        {event.image ? (
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <CalendarDays className="w-12 h-12" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
          {event.category}
        </span>
        <h3 className="font-semibold text-lg mt-1 mb-2 line-clamp-2">{event.name}</h3>
        <div className="text-sm text-gray-500 space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {format(new Date(event.date), "dd MMM yyyy")}
            {event.time ? ` • ${event.time}` : ""}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.venue}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{event.description}</p>
        <Link to={`/events/${event._id}`} className="btn-outline text-sm w-full">
          View & Register
        </Link>
      </div>
    </div>
  );
}
