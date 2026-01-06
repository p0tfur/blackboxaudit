interface ScanResult {
  name: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}

interface ScanReport {
  url: string;
  date: string;
  results: ScanResult[];
  score: number;
}

export const useReportManager = () => {
  const exportToPDF = async (report: ScanReport) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    const brandName = "BlackBoxAudit.com";

    // Add header with logo placeholder
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Security Audit Report", margin, 28);
    doc.setFontSize(12);
    doc.setTextColor(226, 232, 240);
    doc.text(brandName, margin, 36);

    // Add security score with visual indicator
    const scoreY = 60;
    doc.setFontSize(20);
    const scoreColor =
      report.score >= 90
        ? ([39, 174, 96] as [number, number, number])
        : report.score >= 70
        ? ([241, 196, 15] as [number, number, number])
        : ([231, 76, 60] as [number, number, number]);
    doc.setTextColor(...scoreColor);
    doc.text(`Security Score: ${report.score}%`, margin, scoreY);

    // Draw score indicator bar
    doc.setFillColor(...scoreColor);
    doc.rect(margin, scoreY + 5, (report.score / 100) * contentWidth, 5, "F");
    doc.setFillColor(200, 200, 200);
    doc.rect(
      margin + (report.score / 100) * contentWidth,
      scoreY + 5,
      contentWidth - (report.score / 100) * contentWidth,
      5,
      "F"
    );

    // Add scan information in a box
    doc.setFillColor(247, 250, 252);
    doc.rect(margin, 80, contentWidth, 40, "F");
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(12);
    doc.text(`URL: ${report.url}`, margin + 5, 92);
    doc.text(`Scan Date: ${new Date(report.date).toLocaleString()}`, margin + 5, 102);
    doc.text(`Total Issues Found: ${report.results.length}`, margin + 5, 112);

    // Add severity summary with icons
    const severityCounts = report.results.reduce((acc, result) => {
      acc[result.severity] = (acc[result.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    doc.setFontSize(16);
    doc.text("Issues by Severity", margin, 140);

    // Create severity boxes
    const boxWidth = contentWidth / 3 - 10;
    const severityColors: Record<string, [number, number, number]> = {
      high: [231, 76, 60],
      medium: [241, 196, 15],
      low: [52, 152, 219],
    };

    Object.entries(severityColors).forEach(([severity, color], index) => {
      const x = margin + index * (boxWidth + 10);
      doc.setFillColor(...color);
      doc.rect(x, 150, boxWidth, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.text(`${severity.charAt(0).toUpperCase() + severity.slice(1)}: ${severityCounts[severity] || 0}`, x + 5, 170);
    });

    // Add detailed findings
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(16);
    doc.text("Detailed Findings", margin, 200);
    let y = 220;

    report.results.forEach((result, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Draw finding box
      doc.setFillColor(247, 250, 252);
      const boxHeight = 60;
      doc.rect(margin, y, contentWidth, boxHeight, "F");

      // Add finding content
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${result.name}`, margin + 5, y + 15);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...severityColors[result.severity]);
      doc.text(`Severity: ${result.severity.toUpperCase()}`, margin + 5, y + 30);

      doc.setTextColor(44, 62, 80);
      const recommendationLines = doc.splitTextToSize(`Recommendation: ${result.recommendation}`, contentWidth - 10);
      doc.text(recommendationLines, margin + 5, y + 45);

      y += boxHeight + 10;
    });

    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.text(brandName, margin, pageHeight - 12);
      doc.text(`Page ${page} of ${totalPages}`, pageWidth - margin, pageHeight - 12, { align: "right" });
    }

    doc.save(`security-audit-${report.url.replace(/[^a-z0-9]/gi, "_")}.pdf`);
  };

  const exportToCSV = async (report: ScanReport) => {
    const { Parser } = await import("@json2csv/plainjs");
    const fileSaverModule = await import("file-saver");
    const saveAs = (fileSaverModule as any).saveAs ?? (fileSaverModule as any).default;

    const parser = new Parser({
      fields: [
        { value: "name", label: "Issue Name" },
        { value: "severity", label: "Severity Level" },
        { value: "recommendation", label: "Recommendation" },
      ],
      defaultValue: "N/A",
    });

    const formattedResults = report.results.map((result) => ({
      ...result,
      severity: result.severity.toUpperCase(),
      recommendation: result.recommendation.trim(),
    }));

    const csv = parser.parse(formattedResults);
    const csvContent = `Security Audit Report\nURL: ${report.url}\nDate: ${new Date(
      report.date
    ).toLocaleString()}\nSecurity Score: ${report.score}%\n\n${csv}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `security-audit-${report.url.replace(/[^a-z0-9]/gi, "_")}.csv`);
  };

  const exportToJSON = async (report: ScanReport) => {
    const fileSaverModule = await import("file-saver");
    const saveAs = (fileSaverModule as any).saveAs ?? (fileSaverModule as any).default;

    // Format the report data with consistent structure
    const scanDate = new Date(report.date);
    const formattedReport = {
      metadata: {
        url: report.url,
        scanDate: scanDate.toLocaleString(),
        scanDateISO: scanDate.toISOString(),
        securityScore: report.score,
        totalIssues: report.results.length,
        severitySummary: {
          high: report.results.filter((r) => r.severity === "high").length,
          medium: report.results.filter((r) => r.severity === "medium").length,
          low: report.results.filter((r) => r.severity === "low").length,
        },
      },
      findings: report.results.map((result) => ({
        name: result.name,
        severity: result.severity.toUpperCase(),
        recommendation: result.recommendation.trim(),
      })),
    };

    const blob = new Blob([JSON.stringify(formattedReport, null, 2)], { type: "application/json;charset=utf-8" });
    saveAs(blob, `security-audit-${report.url.replace(/[^a-z0-9]/gi, "_")}.json`);
  };

  const generateShareableLink = (report: ScanReport) => {
    // In a real application, this would interact with a backend to store the report
    // and generate a unique URL. For now, we'll create a data URL
    const data = encodeURIComponent(JSON.stringify(report));
    return `${window.location.origin}/share?data=${data}`;
  };

  return {
    exportToPDF,
    exportToCSV,
    exportToJSON,
    generateShareableLink,
  };
};
