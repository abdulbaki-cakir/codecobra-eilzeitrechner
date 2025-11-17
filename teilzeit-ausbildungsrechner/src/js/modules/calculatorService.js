/**
 * Berechnet die Dauer in Teilzeit.
 * @param {number} fullTimeEquivalentDuration - Die umzurechnende VZ-Dauer
 * @param {number} fullTimeHours - z.B. 40
 * @param {number} partTimeHours - z.B. 25
 * @returns {number} - Die resultierende Dauer in TZ
 */


export function calculatePartTimeDuration(fullTimeEquivalentDuration, fullTimeHours, partTimeHours) {
    if (!partTimeHours || partTimeHours <= 0 || partTimeHours >= fullTimeHours) {
        return fullTimeEquivalentDuration;
    }
    const finalDuration = fullTimeEquivalentDuration * (fullTimeHours / partTimeHours);
    return Math.round(finalDuration);
}



