/**
 * LÄDT EXTERNE HTML-DATEIEN (z.B. Header/Footer)
 * Diese Funktion wird benötigt, um dein _rechner-formular.html zu laden.
 */
async function includeHTML() {
    const elementsToInclude = document.querySelectorAll('[include-html]');
    const promises = Array.from(elementsToInclude).map(async (element) => {
        const filePath = element.getAttribute('include-html');
        if (!filePath) return;
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                element.innerHTML = await response.text();
            } else {
                element.innerHTML = `Fehler: Konnte Datei '${filePath}' nicht laden.`;
            }
        } catch (error) {
            element.innerHTML = `Fehler: Datei '${filePath}' konnte nicht geladen werden.`;
        }
        element.removeAttribute('include-html');
    });
    await Promise.all(promises);

    // Ruft die Initialisierung auf, NACHDEM alle HTML-Teile geladen sind
    initializeApp();
}

/**
 * INITIALISIERT ALLE JS-FUNKTIONEN DER SEITE
 */
function initializeApp() {

    setTimeout(() => {

        console.log("App initialisiert und HTML-Includes geladen.");

    }, 0);
}


document.addEventListener('DOMContentLoaded', includeHTML);