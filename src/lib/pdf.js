import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { flagOf, fmtDate, rangeText } from './utils.js';

const NAVY = [16, 42, 76];
const BLUE = [26, 116, 224];

// Builds the report PDF fully on the client. No data leaves the browser.
export function buildReportPDF({ report, patient, settings }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Header band
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 34, 'F');
  // Logo placeholder
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, 8, 18, 18, 3, 3, 'F');
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('LOGO', 23, 19.5, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(settings.labName, 38, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(settings.address, 38, 21);
  doc.text(`Phone: ${settings.phone}   |   ${settings.email}`, 38, 26);

  // Patient block
  doc.setTextColor(30, 41, 59);
  doc.setDrawColor(219, 234, 254);
  doc.setFillColor(239, 247, 255);
  doc.roundedRect(14, 40, W - 28, 30, 2, 2, 'FD');
  const row = (label, value, x, y) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(100, 116, 139);
    doc.text(label, x, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(15, 23, 42);
    doc.text(String(value), x, y + 5);
  };
  row('PATIENT NAME', patient.name, 19, 47);
  row('PATIENT ID', patient.id, 90, 47);
  row('REPORT DATE', fmtDate(report.date), 140, 47);
  row('AGE / GENDER', `${patient.age} Yrs / ${patient.gender}`, 19, 60);
  row('REPORT NO.', report.id, 90, 60);
  row('PHONE', patient.phone, 140, 60);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...BLUE);
  doc.text(report.testName.toUpperCase(), W / 2, 82, { align: 'center' });
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 25, 84, W / 2 + 25, 84);

  doc.autoTable({
    startY: 90,
    margin: { left: 14, right: 14 },
    head: [['Investigation', 'Result', 'Flag', 'Unit', 'Reference Range']],
    body: report.results.map((r) => {
      const f = flagOf(r);
      return [r.name, r.value, f === 'H' || f === 'L' ? f : '', r.unit, rangeText(r)];
    }),
    theme: 'striped',
    headStyles: { fillColor: NAVY, textColor: 255, fontSize: 9 },
    styles: { fontSize: 9.5, cellPadding: 3 },
    alternateRowStyles: { fillColor: [247, 250, 253] },
    columnStyles: { 1: { fontStyle: 'bold' }, 2: { halign: 'center', fontStyle: 'bold' } },
    didParseCell: (d) => {
      if (d.section === 'body' && (d.column.index === 1 || d.column.index === 2)) {
        const f = flagOf(report.results[d.row.index]);
        if (f === 'H' || f === 'L') d.cell.styles.textColor = [200, 30, 30];
      }
    },
  });

  let y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('H = above reference range, L = below reference range. Demo values for illustration only.', 14, y);

  // Signature (keep above footer)
  y = Math.max(y + 22, H - 62);
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(W - 70, y, W - 14, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(15, 23, 42);
  doc.text(settings.signatureName, W - 42, y + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(100, 116, 139);
  doc.text(settings.signatureTitle, W - 42, y + 10, { align: 'center' });
  doc.text('[ Authorized signature placeholder ]', W - 42, y - 3, { align: 'center' });

  // Footer
  doc.setDrawColor(219, 234, 254);
  doc.line(14, H - 22, W - 14, H - 22);
  doc.setFontSize(8); doc.setTextColor(100, 116, 139);
  doc.text(doc.splitTextToSize(settings.footer, W - 28), W / 2, H - 17, { align: 'center' });
  doc.text('*** End of Report ***', W / 2, H - 8, { align: 'center' });

  return doc;
}

export const reportFileName = (report, patient) =>
  `${patient.name.replace(/\s+/g, '_')}_${report.testName.replace(/\s+/g, '_')}_${report.date}.pdf`;

export const downloadReportPDF = (args) =>
  buildReportPDF(args).save(reportFileName(args.report, args.patient));

export const reportPDFUrl = (args) => buildReportPDF(args).output('bloburl');
