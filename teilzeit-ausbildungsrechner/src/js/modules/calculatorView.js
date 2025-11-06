/**
 * Liest alle Eingabewerte aus dem Formular aus.
 * @returns {object} - Ein Objekt mit allen Rohwerten.
 */
export function getFormInputs() {
    const selections = {};
    const reasonIds = [
        'age-select', 'school-finish', 'experience-select',
        'apprenticeship-select', 'study-select', 'child-care-select',
        'family-care-select'
    ];
    reasonIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) selections[id] = el.value;
    });
}
/**
 * Verknüpft Radio-Buttons mit einem versteckten Select-Feld.
 */
export const linkRadiosToSelect = (radioGroupName, selectElementId) => {
    const radios = document.querySelectorAll(`input[name="${radioGroupName}"]`);
    const hiddenSelect = document.getElementById(selectElementId);
    if (radios.length > 0 && hiddenSelect) {
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                hiddenSelect.value = this.value;
            });
        });
    }
};

/**
 * Zeigt den gewünschten Schritt an und blendet andere aus.
 * @param {number} stepNumber - Der Schritt, der angezeigt werden soll (1, 2, oder 3)
 */
export function showStep(stepNumber) {
    const allStepForms = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];

    allStepForms.forEach((form, index) => {
        if (form) {
            form.classList.toggle('hidden', (index + 1) !== stepNumber);
        }
    });
    updateProgress(stepNumber);

}

/**
 * Aktualisiert die Fortschrittsanzeige (Punkte und Linie).
 * @param {number} currentStep - Der aktuell aktive Schritt
 */
function updateProgress(currentStep) {
    const progressSteps = document.querySelectorAll('.progress-container .step');

    progressSteps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.toggle('active', stepNum <= currentStep);
    });

}
