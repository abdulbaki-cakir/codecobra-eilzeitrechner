// language.js

const LANGUAGE_STORAGE_KEY = "tzr-language";
const LANGUAGE_EVENT = "app:language-changed";

// Simple memory cache to avoid network requests if we switch back and forth
const loadedLanguages = {};

let currentLanguage = "de";
let currentTranslations = {};

/**
 * Synchronous helper to get a specific string from memory.
 */
export function getTranslation(key, lang = currentLanguage) {
  const sourceData = loadedLanguages[lang] || currentTranslations;
  return sourceData[key] ?? "";
}

export function onLanguageChange(callback) {
  document.addEventListener(LANGUAGE_EVENT, (event) => {
    if (event.detail?.language) {
      callback(event.detail.language);
    }
  });
}

/**
 * Main Logic: Fetches JSON and updates the DOM
 * (Combined approach: Simple Fetch + Robust UI Updates)
 */
export async function applyTranslations(lang = currentLanguage) {
  try {
    // 1. Fetch Data (Logic from your short code, with added caching)
    let translations = loadedLanguages[lang];

    if (!translations) {
      const response = await fetch(`lang/${lang}.json`);
      if (!response.ok) {
        console.error(`Language file not found: lang/${lang}.json`);
        return;
      }
      translations = await response.json();
      loadedLanguages[lang] = translations; // Save to cache
    }

    // 2. Update State
    currentLanguage = lang;
    currentTranslations = translations;
    sessionStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);

    // 3. Update DOM (Logic from your new code to handle attributes/HTML)
    document.querySelectorAll("[data-translate-key]").forEach((el) => {
      const key = el.dataset.translateKey;
      const translation = translations[key];

      if (!translation) return;

      const attrTarget = el.dataset.translateAttr;
      const mode = el.dataset.translateMode;

      if (attrTarget) {
        // e.g. placeholder="Search..."
        el.setAttribute(attrTarget, translation);
      } else if (mode === "html") {
        // e.g. <b>Bold</b> text
        el.innerHTML = translation;
      } else {
        // Standard text
        el.textContent = translation;
      }
    });

    // 4. Update HTML Lang Attribute
    const htmlLang = currentLanguage.startsWith("de") ? "de" : "en";
    document.documentElement.setAttribute("lang", htmlLang);

    // 5. Update Easy Language Checkbox (Specific to your app)
    const easyCheckbox = document.getElementById("easy-language-checkbox");
    if (easyCheckbox) {
      easyCheckbox.checked = currentLanguage === "de_easy";
    }

    // 6. Notify other parts of the app
    const event = new CustomEvent(LANGUAGE_EVENT, {
      detail: { language: lang },
    });
    document.dispatchEvent(event);
  } catch (error) {
    console.error("Error applying translations:", error);
  }
}

/**
 * Initializes the dropdowns and click listeners
 */
export function initializeLanguageSwitcher() {
  const langToggle = document.getElementById("language-toggle");
  const langMenu = document.getElementById("language-menu");
  const languageOptions = document.querySelectorAll(".language-option");

  const easyToggle = document.getElementById("easy-language-toggle");
  const easyMenu = document.getElementById("easy-language-menu");
  const easyCheckbox = document.getElementById("easy-language-checkbox");

  // Load stored language on startup
  const storedLang = sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
  applyTranslations(storedLang || "de");

  // --- Standard Language Menu ---
  if (langToggle && langMenu) {
    langToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (easyMenu) easyMenu.classList.remove("show");
      langMenu.classList.toggle("show");
    });

    languageOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        // Grabs text inside span (e.g., "en" or "de")
        const langSpan = this.querySelector("span");
        if (langSpan) {
          applyTranslations(langSpan.textContent.toLowerCase().trim());
        }
        langMenu.classList.remove("show");
      });
    });
  }

  // --- Easy Language Menu ---
  if (easyToggle && easyMenu && easyCheckbox) {
    easyToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (langMenu) langMenu.classList.remove("show");
      easyMenu.classList.toggle("show");
    });

    easyMenu.addEventListener("click", (e) => e.stopPropagation());

    easyCheckbox.addEventListener("change", (e) => {
      const nextLanguage = e.target.checked ? "de_easy" : "de";
      applyTranslations(nextLanguage);
    });
  }

  // --- Global Click to Close ---
  window.addEventListener("click", (e) => {
    if (
      langMenu &&
      !langToggle.contains(e.target) &&
      !langMenu.contains(e.target)
    ) {
      langMenu.classList.remove("show");
    }
    if (
      easyMenu &&
      !easyToggle.contains(e.target) &&
      !easyMenu.contains(e.target)
    ) {
      easyMenu.classList.remove("show");
    }
  });
}
