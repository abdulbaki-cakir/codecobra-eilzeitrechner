// Importiere die getrennten Module
import * as View from "./calculatorView.js";
import * as Validation from "./input-validation.js";
import { scrollToCalculator } from "./navigation.js";
import * as Service from "./calculatorService.js";
import { setupDetailsToggle } from "./calculatorView.js";

let currentStep = 1;

/**
 * Steuert den Ablauf der Berechnung: Daten holen -> Rechnen -> Anzeigen
 */
function handleCalculation() {
  // 1. Alle Inputs holen
  const inputs = View.getFormInputs();

  // 2. Die KOMPLETTE Berechnung durchführen (Verkürzung + Teilzeit + Mindestdauer)
  const finalResults = Service.calculateFinalResults(inputs);

  // 3. Das Ergebnis an die View übergeben zum Anzeigen
  View.renderResults(finalResults);
}

/**
 * Haupt-Initialisierung: Setzt Event-Listener, Validierung und UI-Logik auf.
 */
export function initializeCalculator() {
  // --- UI-Logik: Radio-Buttons mit Dropdowns verknüpfen ---
  // Sorgt dafür, dass die Auswahl "Ja" das entsprechende Select-Menü aktiviert.
  View.linkRadiosToSelect("age-radio", "age-select");
  View.linkRadiosToSelect("school-finish-radio", "school-finish");
  View.linkRadiosToSelect("experience-radio", "experience-select");
  View.linkRadiosToSelect("apprenticeship-radio", "apprenticeship-select");
  View.linkRadiosToSelect("study-radio", "study-select");
  View.linkRadiosToSelect("child-care-radio", "child-care-select");
  View.linkRadiosToSelect("family-care-radio", "family-care-select");

  // --- Navigation & Flow-Steuerung ---
  const nextBtn1 = document.getElementById("next-btn-1");
  const backBtn2 = document.getElementById("back-btn-2");
  const nextBtn2 = document.getElementById("next-btn-2");
  const backBtn3 = document.getElementById("back-btn-3");

  // Schritt 1 -> Schritt 2 (Mit Validierung)
  if (nextBtn1) {
    nextBtn1.addEventListener("click", () => {
      // Validierung aller Pflichtfelder in Schritt 1
      const isVollzeitValid = Validation.validateVollzeitstunden(true);
      const isWochenstundenValid = Validation.validateWochenstunden(true);
      const isVollzeitMonateValid = Validation.validateVollzeitMonate(true);

      // Nur weiterschalten, wenn alles valide ist
      if (isVollzeitValid && isWochenstundenValid && isVollzeitMonateValid) {
        currentStep = 2;
        View.showStep(currentStep);
        scrollToCalculator();
      }
    });
  }

  // Zurück zu Schritt 1
  if (backBtn2) {
    backBtn2.addEventListener("click", () => {
      currentStep = 1;
      View.showStep(currentStep);
      scrollToCalculator();
    });
  }

  // Schritt 2 -> Schritt 3 (Berechnung auslösen)
  if (nextBtn2) {
    nextBtn2.addEventListener("click", () => {
      handleCalculation(); // Kern-Logik ausführen

      currentStep = 3;
      View.showStep(currentStep);
      scrollToCalculator();
    });
  }

  // Zurück zu Schritt 2 (Ergebnis verwerfen/korrigieren)
  if (backBtn3) {
    backBtn3.addEventListener("click", () => {
      currentStep = 2;
      View.showStep(currentStep);
      scrollToCalculator();
    });
  }

  // --- Initialen UI-Zustand setzen ---
  View.showStep(currentStep);
  View.setupPartTimeSwitch();

  // --- Live-Validierung (Blur & Enter Events) ---
  // Diese Listener sorgen für sofortiges Feedback, wenn der Nutzer ein Feld verlässt
  const vollzeitInput = document.getElementById("vollzeitstunden");
  const wochenstundenInput = document.getElementById("wochenstunden");
  const vollzeitMonateInput = document.getElementById("vollzeit-monate");
  const dauerSelect = document.getElementById("ausbildungsdauer");

  if (vollzeitInput) {
    const validateVollzeit = () => {
      Validation.validateVollzeitstunden(true);
      // Wenn Wochenstunden schon gefüllt sind, diese auch neu validieren (Verhältnis-Check)
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

  // Validierung neu anstoßen, wenn sich abhängige Felder ändern
  if (dauerSelect) {
    dauerSelect.addEventListener("change", () => {
      Validation.validateVollzeitMonate(false);
    });
  }

  const partTimeRadios = document.querySelectorAll(
    'input[name="part-time-start-radio"]',
  );
  partTimeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      Validation.validateVollzeitMonate(false);
    });
  });
}

// Global: Toggle-Logik für Details aktivieren
setupDetailsToggle();
