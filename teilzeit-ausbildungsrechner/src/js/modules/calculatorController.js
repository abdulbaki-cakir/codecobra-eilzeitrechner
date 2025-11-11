// Importiere die getrennten Module
import * as View from "./calculatorView.js";
// --- NEUER IMPORT FÜR VALIDIERUNG ---
import * as Validation from "./input-validation.js";
import { initializeTooltips } from "./tooltips.js";

let currentStep = 1;

/**
 * INITIALISIERUNG:
 * Startet die gesamte Logik für den Rechner.
 */
export function initializeCalculator() {
  // --- 1. Button-Listener (Navigation & Aktionen) ---
  const nextBtn1 = document.getElementById("next-btn-1");
  const backBtn2 = document.getElementById("back-btn-2");
  const nextBtn2 = document.getElementById("next-btn-2");
  const backBtn3 = document.getElementById("back-btn-3");

  if (nextBtn1) {
    nextBtn1.addEventListener("click", () => {
      // --- GEÄNDERT: Ruft Validation statt View auf ---
      const isVollzeitValid = Validation.validateVollzeitstunden(true);
      const isWochenstundenValid = Validation.validateWochenstunden(true);
      const isVollzeitMonateValid = Validation.validateVollzeitMonate(true);

      if (isVollzeitValid && isWochenstundenValid && isVollzeitMonateValid) {
        currentStep = 2;
        View.showStep(currentStep);
      }
    });
  }

  if (backBtn2) {
    backBtn2.addEventListener("click", () => {
      currentStep = 1;
      View.showStep(currentStep);
    });
  }

  if (nextBtn2) {
    nextBtn2.addEventListener("click", () => {
      currentStep = 3;
      View.showStep(currentStep);
    });
  }

  if (backBtn3) {
    backBtn3.addEventListener("click", () => {
      currentStep = 2;
      View.showStep(currentStep);
    });
  }

  // --- 2. Initialen Zustand setzen ---
  View.showStep(currentStep);
  View.setupPartTimeSwitch();
  initializeTooltips();

  // --- 3. VALIDIERUNGS-LISTENER HINZUFÜGEN ---

  const vollzeitInput = document.getElementById("vollzeitstunden");
  const wochenstundenInput = document.getElementById("wochenstunden");
  const vollzeitMonateInput = document.getElementById("vollzeit-monate");
  const dauerSelect = document.getElementById("ausbildungsdauer");

  if (vollzeitInput) {
    const validateVollzeit = () => {
      // --- GEÄNDERT: Ruft Validation statt View auf ---
      Validation.validateVollzeitstunden(true);
      if (wochenstundenInput.value.trim() !== "") {
        Validation.validateWochenstunden(false);
      }
    };

    vollzeitInput.addEventListener("blur", validateVollzeit);
    vollzeitInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        vollzeitInput.blur();
      }
    });
  }

  if (wochenstundenInput) {
    const validateWochenstunden = () => {
      // --- GEÄNDERT: Ruft Validation statt View auf ---
      Validation.validateWochenstunden(true);
    };

    wochenstundenInput.addEventListener("blur", validateWochenstunden);
    wochenstundenInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        wochenstundenInput.blur();
      }
    });
  }

  if (vollzeitMonateInput) {
    const validateMonate = () => {
      // --- GEÄNDERT: Ruft Validation statt View auf ---
      Validation.validateVollzeitMonate(true);
    };
    vollzeitMonateInput.addEventListener("blur", validateMonate);
    vollzeitMonateInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        vollzeitMonateInput.blur();
      }
    });
  }

  if (dauerSelect) {
    dauerSelect.addEventListener("change", () => {
      // --- GEÄNDERT: Ruft Validation statt View auf ---
      Validation.validateVollzeitMonate(false);
    });
  }

  const partTimeRadios = document.querySelectorAll(
    'input[name="part-time-start-radio"]',
  );
  partTimeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      // --- GEÄNDERT: Ruft Validation statt View auf ---
      Validation.validateVollzeitMonate(false);
    });
  });
}
