export function setupPdfExport() {
    const btn = document.querySelector(".pdf-btn");
    if (!btn) return;
  
    btn.addEventListener("click", async () => {
      const detailsWrapper = document.getElementById("details-wrapper");
      const detailsBtn = document.getElementById("toggle-details-btn");
      const chartCanvas = document.getElementById("results-chart");
  
      // jsPDF aus CDN holen
      // eslint-disable-next-line new-cap
      const pdf = new window.jspdf.jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      let y = 20;
  
      /* ---------------------------------------------------------
         0) DETAILS AUTOMATISCH AUSKLAPPEN
      --------------------------------------------------------- */
      const wasHidden = detailsWrapper?.classList.contains("hidden");
  
      if (wasHidden) {
        detailsWrapper.classList.remove("hidden");
        if (detailsBtn) detailsBtn.textContent = "Detaillierte Erklärung einklappen ▲";
  
        await new Promise((_resolve) => setTimeout(_resolve, 150));
      }
  
      /* ---------------------------------------------------------
         1) HEADER – OFFIZIELLER LOOK
      --------------------------------------------------------- */
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Ausbildungsrechner – Analysebericht", pageWidth / 2, y, { align: "center" });
      y += 8;
  
      pdf.setLineWidth(0.5);
      pdf.line(15, y, pageWidth - 15, y);
      y += 10;
  
      /* ---------------------------------------------------------
         2) DETALLIERTE ERKLÄRUNG (GANZ OBEN!)
      --------------------------------------------------------- */
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Detaillierte Erklärung", 15, y);
      y += 10;
  
      const detailCards = detailsWrapper.querySelectorAll(".result-card");
  
      detailCards.forEach((card) => {
        if (y > 260) {
          pdf.addPage();
          y = 20;
        }
  
        const titleText = card.querySelector(".result-card-title")?.textContent ?? "";
        const numberText = card.querySelector(".result-card-number")?.textContent ?? "";
        const paragraphs = [...card.querySelectorAll("p")].map((p) => p.textContent.trim());
  
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text(`• ${titleText}: ${numberText}`, 15, y);
        y += 6;
  
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
  
        paragraphs.forEach((text) => {
          const lines = pdf.splitTextToSize(text, pageWidth - 30);
  
          if (y + lines.length * 6 > 280) {
            pdf.addPage();
            y = 20;
          }
  
          pdf.text(lines, 20, y);
          y += lines.length * 6 + 2;
        });
  
        y += 6;
      });
  
      /* ---------------------------------------------------------
         3) BALKENDIAGRAMM – GROß, ZENTRIERT, OFFIZIELL
      --------------------------------------------------------- */
      if (chartCanvas) {
        pdf.addPage();
        y = 20;
  
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Grafische Übersicht", 15, y);
        y += 10;
  
        const chartIMG = chartCanvas.toDataURL("image/png", 1.0);
        const imgWidth = 170;
        const imgHeight = (chartCanvas.height / chartCanvas.width) * imgWidth;
  
        pdf.addImage(chartIMG, "PNG", (pageWidth - imgWidth) / 2, y, imgWidth, imgHeight);
        y += imgHeight + 12;
      }
  
      /* ---------------------------------------------------------
         4) ZUSAMMENFASSUNG – AM ENDE
      --------------------------------------------------------- */
      const duration = document.getElementById("final-duration-result")?.textContent ?? "--";
      const shortening = document.getElementById("shortening-card-value")?.textContent ?? "--";
      const remaining = document.getElementById("new-full-time-card-value")?.textContent ?? "--";
      const extension = document.getElementById("extension-card-value")?.textContent ?? "--";
  
      pdf.addPage();
      y = 20;
  
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Zusammenfassung", 15, y);
      y += 10;
  
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Gesamtausbildungsdauer: ${duration}`, 15, y); y += 6;
      pdf.text(`Gesamte Verkürzung: ${shortening} Monate`, 15, y); y += 6;
      pdf.text(`Restdauer nach Verkürzung: ${remaining} Monate`, 15, y); y += 6;
      pdf.text(`Verlängerung durch Teilzeit: ${extension} Monate`, 15, y); y += 10;
  
      /* ---------------------------------------------------------
         5) FOOTER
      --------------------------------------------------------- */
      pdf.setFontSize(10);
      pdf.text(
        "Hinweis: Diese Berechnung dient der Orientierung und stellt keine Rechtsberatung dar.",
        pageWidth / 2,
        290,
        { align: "center" }
      );
  
      pdf.save("Ausbildungsrechner.pdf");
  
      /* ---------------------------------------------------------
         6) DETAILS ZURÜCKKLAPPEN
      --------------------------------------------------------- */
      if (wasHidden) {
        detailsWrapper.classList.add("hidden");
        if (detailsBtn) detailsBtn.textContent = "Detaillierte Erklärung anzeigen ▼";
      }
    });
  }
  