// Importiere die getrennten Module
import * as View from './calculatorView.js';


let currentStep = 1;

/**
 * INITIALISIERUNG:
 * Startet die gesamte Logik für den Rechner.
 */
export function initializeCalculator() {

    // --- 1. Button-Listener (Navigation & Aktionen) ---
    const nextBtn1 = document.getElementById('next-btn-1');
    const backBtn2 = document.getElementById('back-btn-2');
    const nextBtn2 = document.getElementById('next-btn-2');
    const backBtn3 = document.getElementById('back-btn-3');

    if (nextBtn1) {
        nextBtn1.addEventListener('click', () => {
            currentStep = 2;
            View.showStep(currentStep);
        });
    }

    if (backBtn2) {
        backBtn2.addEventListener('click', () => {
            currentStep = 1;
            View.showStep(currentStep);
        });
    }

    if (nextBtn2) {
        nextBtn2.addEventListener('click', () => {
            currentStep = 3;
            View.showStep(currentStep);
        });
    }

    if (backBtn3) {
        backBtn3.addEventListener('click', () => {
            currentStep = 2;
            View.showStep(currentStep);
        });
    }

    // --- 2. Initialen Zustand setzen ---
    View.showStep(currentStep); // Zeige Schritt 1 beim Start


}