import { useState } from 'react';
import { Download, Eye, Printer, Share2 } from 'lucide-react';
import Modal from './Modal.jsx';
import ReportView from './ReportView.jsx';
import ShareModal from './ShareModal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { downloadReportPDF, reportPDFUrl } from '../lib/pdf.js';

// Report preview dialog with Preview PDF / Download / Print / WhatsApp actions.
export default function ReportModal({ report, patient, onClose }) {
  const { settings, toast } = useApp();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [share, setShare] = useState(false);
  const args = { report, patient, settings };

  const print = () => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    iframe.src = reportPDFUrl(args);
    iframe.onload = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch {
        window.open(iframe.src, '_blank');
      }
      setTimeout(() => iframe.remove(), 60000);
    };
    document.body.appendChild(iframe);
    toast('Opening print dialog...', 'info');
  };

  return (
    <>
      <Modal
        title={`${report.testName} - ${patient.name}`}
        size="lg"
        onClose={onClose}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setPdfUrl(reportPDFUrl(args))}><Eye size={16} /> Preview PDF</button>
            <button className="btn-secondary" onClick={() => { downloadReportPDF(args); toast('PDF downloaded to your device'); }}><Download size={16} /> Download PDF</button>
            <button className="btn-secondary" onClick={print}><Printer size={16} /> Print</button>
            <button className="btn bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setShare(true)}><Share2 size={16} /> Share via WhatsApp</button>
          </>
        }
      >
        <ReportView report={report} patient={patient} />
      </Modal>

      {pdfUrl && (
        <Modal title="PDF Preview" size="xl" onClose={() => setPdfUrl(null)}>
          <iframe title="PDF preview" src={pdfUrl} className="w-full h-[70vh] rounded-lg border border-slate-200" />
        </Modal>
      )}
      {share && <ShareModal report={report} patient={patient} onClose={() => setShare(false)} />}
    </>
  );
}
