import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);
const GOOGLE_TRANSLATE_SCRIPT =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

function setGoogleTranslateCookie(language) {
  const value = `/en/${language}`;
  document.cookie = `googtrans=${value}; path=/`;
}

function selectGoogleLanguage(language) {
  const select = document.querySelector(".goog-te-combo");
  if (!select) return false;

  if (select.value !== language) {
    select.value = language;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
  return true;
}

// Google injects this cross-origin iframe after a language is selected. Hiding
// the iframe itself (rather than letting visitors close it) keeps the selected
// translation active and prevents the provider toolbar from changing the layout.
function hideGoogleToolbar() {
  const googleOverlaySelector = [
    "iframe.goog-te-banner-frame",
    "iframe.goog-te-balloon-frame",
    "iframe.VIpgJd-ZVi9od-ORHb-OEVmcd",
    "iframe[src*='translate.google']",
    ".goog-te-banner-frame",
    ".goog-te-balloon-frame",
    "#goog-gt-tt",
    ".goog-tooltip",
    ".VIpgJd-ZVi9od-aZ2wEe-wOHMyf",
    "[class*='VIpgJd-yAWNEb-L7lbkb']",
  ].join(", ");

  document.querySelectorAll(googleOverlaySelector).forEach((element) => {
    if (element.style.getPropertyValue("display") !== "none") {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("visibility", "hidden", "important");
      element.style.setProperty("height", "0", "important");
    }
  });
  document.documentElement.style.setProperty("top", "0px", "important");
  document.body.style.setProperty("top", "0px", "important");
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem("siteLanguage") || "en");
  const [translatorReady, setTranslatorReady] = useState(false);

  useEffect(() => {
    hideGoogleToolbar();
    const toolbarObserver = new MutationObserver(hideGoogleToolbar);
    toolbarObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "src"],
    });

    const initialiseTranslator = () => {
      if (!window.google?.translate?.TranslateElement) return;
      if (!document.getElementById("google_translate_element")?.childElementCount) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,bn", autoDisplay: false },
          "google_translate_element"
        );
      }
      setTranslatorReady(true);
    };

    window.googleTranslateElementInit = initialiseTranslator;
    if (window.google?.translate?.TranslateElement) {
      initialiseTranslator();
      return undefined;
    }

    let script = document.getElementById("google-translate-script");
    if (!script) {
      script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = GOOGLE_TRANSLATE_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      toolbarObserver.disconnect();
      // The callback is global because it is invoked by Google's script.
      delete window.googleTranslateElementInit;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
    localStorage.setItem("siteLanguage", language);
    setGoogleTranslateCookie(language);

    // The Google widget is inserted asynchronously. Retrying briefly also keeps
    // the selected language after React renders a new page.
    const timers = [0, 250, 900].map((delay) =>
      window.setTimeout(() => {
        selectGoogleLanguage(language);
        hideGoogleToolbar();
      }, delay)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [language, translatorReady]);

  const setLanguage = (nextLanguage) => {
    if (nextLanguage === "en" || nextLanguage === "bn") setLanguageState(nextLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translatorReady }}>
      <div id="google_translate_element" className="sr-only" aria-hidden="true" />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
