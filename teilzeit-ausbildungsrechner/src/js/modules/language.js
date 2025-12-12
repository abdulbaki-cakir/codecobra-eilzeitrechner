import translations from "../translations.json";

const LANGUAGE_STORAGE_KEY = "tzr-language";
const LANGUAGE_EVENT = "app:language-changed";
let currentLanguage = "de";

function getTranslationsFor(lang) {
  return translations[lang] || translations.de || {};
}

function dispatchLanguageChanged(lang) {
  const event = new CustomEvent(LANGUAGE_EVENT, { detail: { language: lang } });
  document.dispatchEvent(event);
}

export function getTranslation(key, lang = currentLanguage) {
  const languageData = getTranslationsFor(lang);
  return languageData[key] ?? translations.de?.[key] ?? "";
}

export function onLanguageChange(callback) {
  document.addEventListener(LANGUAGE_EVENT, (event) => {
    if (event.detail?.language) {
      callback(event.detail.language);
    }
  });
}

export function applyTranslations(lang = currentLanguage) {
  currentLanguage = translations[lang] ? lang : "de";

  // ÄNDERUNG: sessionStorage statt localStorage
  sessionStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);

  const languageData = getTranslationsFor(currentLanguage);

  const elements = document.querySelectorAll("[data-translate-key]");
  elements.forEach((el) => {
    const key = el.dataset.translateKey;
    if (!key) return;

    const translation =
      languageData[key] ?? translations.de?.[key] ?? el.textContent;
    if (!translation) return;

    const attrTarget = el.dataset.translateAttr;
    const mode = el.dataset.translateMode;

    if (attrTarget) {
      el.setAttribute(attrTarget, translation);
    } else if (mode === "html") {
      el.innerHTML = translation;
    } else {
      el.textContent = translation;
    }
  });

  const htmlLang = currentLanguage.startsWith("de")
    ? "de"
    : currentLanguage.split("_")[0] || "de";
  document.documentElement.setAttribute("lang", htmlLang);

  const easyCheckbox = document.getElementById("easy-language-checkbox");
  if (easyCheckbox) {
    easyCheckbox.checked = currentLanguage === "de_easy";
  }

  dispatchLanguageChanged(currentLanguage);
}

/**
 * Aktiviert das Sprach-Dropdown und schaltet die Variante "Leichte Sprache" um.
 */
function initializeLanguageSwitcher() {
  const langToggle = document.getElementById("language-toggle");
  const langMenu = document.getElementById("language-menu");
  const languageOptions = document.querySelectorAll(".language-option");

  const easyToggle = document.getElementById("easy-language-toggle");
  const easyMenu = document.getElementById("easy-language-menu");
  const easyCheckbox = document.getElementById("easy-language-checkbox");

  // ÄNDERUNG: sessionStorage statt localStorage beim Laden
  const storedLang = sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
  applyTranslations(storedLang || "de");

  if (langToggle && langMenu) {
    langToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (easyMenu) easyMenu.classList.remove("show");
      langMenu.classList.toggle("show");
    });

    languageOptions.forEach((option) => {
      option.addEventListener("click", function (event) {
        event.preventDefault();
        langMenu.classList.remove("show");
      });
    });
  }

  if (easyToggle && easyMenu && easyCheckbox) {
    easyToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (langMenu) langMenu.classList.remove("show");
      easyMenu.classList.toggle("show");
    });

    easyMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    easyCheckbox.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      const nextLanguage = isChecked ? "de_easy" : "de";
      applyTranslations(nextLanguage);
    });
  }

  window.addEventListener("click", function (event) {
    if (
      langMenu &&
      langToggle &&
      !langToggle.contains(event.target) &&
      !langMenu.contains(event.target)
    ) {
      langMenu.classList.remove("show");
    }
    if (
      easyMenu &&
      easyToggle &&
      !easyToggle.contains(event.target) &&
      !easyMenu.contains(event.target)
    ) {
      easyMenu.classList.remove("show");
    }
  });
}

export { initializeLanguageSwitcher };
