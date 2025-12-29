import { useState } from 'react';
import { Check, Loader2, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { AuditResult } from '../modules/types';

interface PdfDownloadButtonProps {
  results: AuditResult[];
  url: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Robust file download function that works across all browsers
 * Uses explicit MIME type and proper Blob handling to ensure .pdf extension
 */
function downloadPdf(pdfDoc: jsPDF, filename: string): void {
  // Get PDF as ArrayBuffer for maximum compatibility
  const pdfArrayBuffer = pdfDoc.output('arraybuffer');

  // Create Blob with EXPLICIT application/pdf MIME type
  // This is critical - without it, browsers may not recognize the file type
  const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });

  // Ensure filename ends with .pdf
  const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Check for modern download support
  if ('showSaveFilePicker' in window) {
    // Modern File System Access API (Chrome 86+, Edge 86+)
    // This provides the best UX with native save dialog
    (async () => {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: safeFilename,
          types: [{
            description: 'PDF Document',
            accept: { 'application/pdf': ['.pdf'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
      } catch (err) {
        // User cancelled or API not available, fall back to standard download
        if ((err as Error).name !== 'AbortError') {
          standardDownload(pdfBlob, safeFilename);
        }
      }
    })();
  } else {
    // Fallback for older browsers
    standardDownload(pdfBlob, safeFilename);
  }
}

/**
 * Standard blob download using anchor element
 */
function standardDownload(blob: Blob, filename: string): void {
  // Create object URL
  const url = URL.createObjectURL(blob);

  // Create temporary anchor element
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = url;
  anchor.download = filename;

  // Required for Firefox: append to DOM before clicking
  document.body.appendChild(anchor);

  // Trigger download
  anchor.click();

  // Cleanup: use setTimeout to ensure download starts before cleanup
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}

export function PdfDownloadButton({ results, url, variant = 'primary' }: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generatePdf = async () => {
    setIsGenerating(true);

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Header
      doc.setFillColor(10, 10, 15);
      doc.rect(0, 0, pageWidth, 50, 'F');

      doc.setFontSize(24);
      doc.setTextColor(0, 153, 204);
      doc.text('Varabit SEO Audit Report', margin, 30);

      yPosition = 60;

      // Meta info
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
      yPosition += 6;
      doc.text(`URL: ${url}`, margin, yPosition);
      yPosition += 15;

      // Results
      results.forEach((result) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin;
        }

        // Module header
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.text(result.module, margin, yPosition);
        yPosition += 8;

        // Status
        doc.setFontSize(10);
        const statusColor = result.status === 'pass' ? [0, 153, 204] :
          result.status === 'warning' ? [245, 158, 11] :
            [239, 68, 68];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(`Status: ${result.status.toUpperCase()}`, margin, yPosition);
        yPosition += 6;

        // Summary
        doc.setTextColor(60);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(`${result.summary}`, maxWidth);
        summaryLines.forEach((line: string) => {
          doc.text(line, margin, yPosition);
          yPosition += 5;
        });
        yPosition += 3;

        // Issues
        if (result.issues.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(239, 68, 68);
          doc.text('Issues:', margin, yPosition);
          doc.setFont('helvetica', 'normal');
          yPosition += 5;

          result.issues.forEach((issue) => {
            const lines = doc.splitTextToSize(`• ${issue}`, maxWidth - 5);
            lines.forEach((line: string) => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = margin;
              }
              doc.setTextColor(80);
              doc.text(line, margin + 5, yPosition);
              yPosition += 5;
            });
          });
          yPosition += 3;
        }

        // Suggestions
        if (result.suggestions.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 153, 204);
          doc.text('Recommendations:', margin, yPosition);
          doc.setFont('helvetica', 'normal');
          yPosition += 5;

          result.suggestions.forEach((suggestion) => {
            const lines = doc.splitTextToSize(`• ${suggestion}`, maxWidth - 5);
            lines.forEach((line: string) => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = margin;
              }
              doc.setTextColor(80);
              doc.text(line, margin + 5, yPosition);
              yPosition += 5;
            });
          });
        }

        yPosition += 12;
      });

      // Footer on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
        doc.text('Generated by Varabit SEO Audit Tool v2.0', margin, pageHeight - 10);
      }

      // Generate safe filename - only use alphanumeric, dots, and hyphens
      let hostname = 'website';
      try {
        const parsedUrl = new URL(url);
        hostname = parsedUrl.hostname
          .replace(/^www\./, '')
          .replace(/[^a-zA-Z0-9.-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      } catch {
        hostname = 'website';
      }

      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
      const filename = `SEO-Audit-${hostname}-${timestamp}.pdf`;

      // Download with robust method
      downloadPdf(doc, filename);

      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const buttonClasses = variant === 'primary'
    ? 'btn-primary'
    : 'btn-secondary';

  return (
    <button
      onClick={generatePdf}
      disabled={isGenerating}
      className={`${buttonClasses} min-w-[180px]`}
    >
      {isComplete ? (
        <>
          <Check className="w-5 h-5" />
          <span>Downloaded!</span>
        </>
      ) : isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FileText className="w-5 h-5" />
          <span>Download Report</span>
        </>
      )}
    </button>
  );
}
