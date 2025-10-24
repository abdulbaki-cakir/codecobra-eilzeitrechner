// --- SKRIPT FÜR CANVAS-HINTERGRUND ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gradient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const colors = ['#111111', '#222222', '#333333', '#555555'];

    let t = 0;
    let lastTime = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw(timestamp) {
        if (prefersReducedMotion) {
            // Statischen Gradienten für Nutzer mit reduzierter Bewegung zeichnen
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(1, colors[3]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return; // Animation beenden
        }

        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        t += deltaTime * 0.00013;

        const width = canvas.width;
        const height = canvas.height;

        const angle = t * 2 * Math.PI;
        const x1 = width / 2 + Math.cos(angle) * width;
        const y1 = height / 2 + Math.sin(angle) * height;
        const x2 = width / 2 - Math.cos(angle) * width;
        const y2 = height / 2 - Math.sin(angle) * height;

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.33, colors[1]);
        gradient.addColorStop(0.66, colors[2]);
        gradient.addColorStop(1, colors[3]);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
});


// --- SKRIPT FÜR DEN TEILZEITRECHNER (unverändert) ---
document.addEventListener('DOMContentLoaded', () => {
    // Dein gesamter Rechner-Code hier...
});