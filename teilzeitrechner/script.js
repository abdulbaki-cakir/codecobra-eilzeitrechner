function berechne() {
    const wert = Number(document.getElementById('zahl').value);
    document.getElementById('result').innerText = 'Doppelt: ' + (wert * 2);
}