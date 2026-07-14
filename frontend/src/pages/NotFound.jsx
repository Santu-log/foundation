import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="section text-center py-32">
      <Heart className="w-12 h-12 text-primary-300 mx-auto mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
