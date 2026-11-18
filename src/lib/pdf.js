import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ageSex, categoryLabel, flagOf, fmtDMY } from './utils.js';
import logo from '../assets/logo.png?inline';

const BLUE = [43, 108, 190];
const GREEN = [61, 110, 52];
const RED = [196, 74, 64];
const INK = [30, 30, 30];

// Builds the report PDF on the client, laid out like the lab's printed report.
export function buildReportPDF({ report, patient, settings }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Letterhead: the lab's logo image
  const logoW = 22;
  doc.addImage(logo, 'PNG', (W - logoW) / 2, 14, logoW, logoW * (197 / 401));

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...BLUE);
  doc.text(settings.address, W / 2, 30, { align: 'center' });
  doc.setFontSize(8.5);
  doc.text(`Mob : ${settings.phone}, email: ${settings.email}`, W / 2, 35.5, { align: 'center' });
  doc.setDrawColor(...RED);
  doc.setLineWidth(0.5);
  doc.line(0, 40, W, 40);

  // Patient block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text('NAME OF PATIENT', 16, 60);
  doc.setFontSize(10);
  doc.text(`: ${patient.name.toUpperCase()}`, 62, 60);
  doc.setFontSize(9.5);
  doc.text('REFERRED BY DOCTOR', 16, 68);
  doc.text(`: ${patient.doctor || ''}`, 62, 68);
  doc.text(`Date : ${fmtDMY(report.date)}`, 142, 62);
  doc.text(`Age : ${ageSex(patient)}`, 142, 70);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text(report.testName.toUpperCase(), W / 2, 92, { align: 'center' });

  const abnormal = (i) => ['H', 'L'].includes(flagOf(report.results[i]));
  doc.autoTable({
    startY: 98,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    head: [[categoryLabel(report.category), 'Result', 'Normal Value']],
    body: report.results.map((r) => [
      r.name,
      `${r.value} ${r.unit}${['H', 'L'].includes(flagOf(r)) ? `   ${flagOf(r)}` : ''}`,
      `${r.low}-${r.high} ${r.unit}`,
    ]),
    styles: { font: 'helvetica', fontSize: 10, textColor: INK, cellPadding: { top: 3.2, bottom: 3.2, left: 2, right: 2 } },
    headStyles: { fontStyle: 'bold', fontSize: 10 },
    columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 55 }, 2: { cellWidth: 'auto' } },
    didParseCell: (d) => {
      if (d.section === 'body' && d.column.index === 1 && abnormal(d.row.index)) {
        d.cell.styles.textColor = [200, 30, 30];
        d.cell.styles.fontStyle = 'bold';
      }
    },
  });

  const y = doc.lastAutoTable.finalY + 26;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text(settings.signatureName, W / 2 + 4, y, { align: 'center' });
  if (settings.signatureTitle) {
    doc.setFontSize(9);
    doc.text(settings.signatureTitle, W / 2 + 4, y + 5, { align: 'center' });
  }

  if (settings.footer) {
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(doc.splitTextToSize(settings.footer, W - 28), W / 2, H - 14, { align: 'center' });
  }
  return doc;
}

export const reportFileName = (report, patient) =>
  `${patient.name.replace(/\s+/g, '_')}_${report.testName.replace(/\s+/g, '_')}_${report.date}.pdf`;

export const downloadReportPDF = (args) =>
  buildReportPDF(args).save(reportFileName(args.report, args.patient));

export const reportPDFUrl = (args) => buildReportPDF(args).output('bloburl');
