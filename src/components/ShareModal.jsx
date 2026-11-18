import { useState } from 'react';
import { Download, ExternalLink, Info, MessageCircle } from 'lucide-react';
import Modal from './Modal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { downloadReportPDF } from '../lib/pdf.js';
import { fmtDate } from '../lib/utils.js';

// Demo WhatsApp share workflow. No WhatsApp Business API; nothing is sent automatically.
export default function ShareModal({ report, patient, onClose }) {
  const { settings, toast } = useApp();
  const [phone, setPhone] = useState(patient.phone);
  const [message, setMessage] = useState(
    `Hello ${patient.name}, your ${report.testName} report dated ${fmtDate(report.date)} from ${settings.labName} is ready. Please find the PDF attached.`
  );

  const openWhatsApp = () => {
    const digits = phone.replace(/\D/g, '');
    const num = digits.length === 10 ? `91${digits}` : digits;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    toast('WhatsApp opened with the prefilled message. Attach the downloaded PDF manually.', 'info');
  };

  return (
    <Modal
      title="Share via WhatsApp"
      size="md"
      onClose={onClose}
      footer={<button className="btn-secondary" onClick={onClose}>Close</button>}
    >
      <div className="flex gap-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 mb-4">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span><b>Prototype demo.</b> The PDF is not sent automatically. This opens WhatsApp with a prefilled message; you attach the downloaded PDF yourself.</span>
      </div>
      <ol className="space-y-4">
        <li>
          <div className="text-sm font-semibold mb-2">1. Download the report PDF</div>
          <button className="btn-secondary btn-sm" onClick={() => { downloadReportPDF({ report, patient, settings }); toast('PDF downloaded'); }}>
            <Download size={14} /> Download PDF
          </button>
        </li>
        <li>
          <label className="label">2. Recipient WhatsApp number</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </li>
        <li>
          <label className="label">3. Prefilled message</label>
          <textarea className="input min-h-[96px]" value={message} onChange={(e) => setMessage(e.target.value)} />
        </li>
        <li>
          <div className="text-sm font-semibold mb-2">4. Open WhatsApp and attach the PDF</div>
          <button className="btn bg-emerald-600 text-white hover:bg-emerald-700" onClick={openWhatsApp}>
            <MessageCircle size={16} /> Open WhatsApp <ExternalLink size={14} />
          </button>
        </li>
      </ol>
    </Modal>
  );
}
