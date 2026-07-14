import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function LanguageToggle({ dark = false }) {
  const { language, setLanguage } = useLanguage();
  const base = dark
    ? "border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700"
    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";

  return (
    <div
      className={`notranslate inline-flex items-center rounded-lg border p-0.5 text-xs font-semibold ${base}`}
      aria-label="Choose site language"
    >
      <Languages className="ml-1.5 h-4 w-4" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-md px-2 py-1.5 transition-colors ${language === "en" ? "bg-primary-600 text-white" : ""}`}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={`rounded-md px-2 py-1.5 transition-colors ${language === "bn" ? "bg-primary-600 text-white" : ""}`}
        aria-pressed={language === "bn"}
      >
        বাংলা
      </button>
    </div>
  );
}
