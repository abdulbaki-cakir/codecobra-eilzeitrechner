import { jsPDF } from "jspdf";

export function setupPdfExport() {
  const btn = document.querySelector(".pdf-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const target = document.querySelector(".results-container");
    const detailsWrapper = document.getElementById("details-wrapper");
    const detailsBtn = document.getElementById("toggle-details-btn");

    if (!target) return alert("Ergebnisbereich nicht gefunden");

    // Zustand merken, Details ausklappen
    const wasHidden = detailsWrapper?.classList.contains("hidden");
    if (wasHidden) {
      detailsWrapper.classList.remove("hidden");
      detailsBtn.textContent = "Detaillierte Erklärung einklappen ▲";
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Screenshot generieren
    const canvas = await window.html2canvas(target, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // PDF-Objekt
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Ausbildungsrechner.pdf");

    // Zustand zurücksetzen
    if (wasHidden) {
      detailsWrapper.classList.add("hidden");
      detailsBtn.textContent = "Detaillierte Erklärung anzeigen ▼";
    }
  });
}
