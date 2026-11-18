import { useMemo, useState } from 'react';
import { Download, Eye, Search } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ReportModal from '../components/ReportModal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { downloadReportPDF } from '../lib/pdf.js';
import { flagOf, fmtDate } from '../lib/utils.js';

export default function Reports() {
  const { reports, patients, tests, settings, toast } = useApp();
  const [q, setQ] = useState('');
  const [testFilter, setTestFilter] = useState('All');
  const [open, setOpen] = useState(null);

  const pById = (id) => patients.find((p) => p.id === id);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...reports]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .filter((r) => {
        const p = pById(r.patientId);
        if (testFilter !== 'All' && r.testName !== testFilter) return false;
        return !s || r.id.toLowerCase().includes(s) || p?.name.toLowerCase().includes(s) || p?.id.toLowerCase().includes(s) || p?.phone.includes(s);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, patients, q, testFilter]);

  return (
    <>
      <PageHeader title="Reports" subtitle={`${reports.length} reports generated`} />
      <div className="card">
        <div className="p-4 flex flex-wrap gap-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search by report no., patient name, ID or phone" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input w-auto" value={testFilter} onChange={(e) => setTestFilter(e.target.value)}>
            <option value="All">All tests</option>
            {tests.map((t) => <option key={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead><tr>{['Report No.', 'Patient', 'Test', 'Date', 'Status', 'Actions'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody>
              {list.map((r) => {
                const p = pById(r.patientId);
                const abn = r.results.some((x) => ['H', 'L'].includes(flagOf(x)));
                return (
                  <tr key={r.id} className="border-t border-slate-50 hover:bg-brand-50/40">
                    <td className="td font-medium text-brand-700">{r.id}</td>
                    <td className="td"><div className="font-medium">{p?.name}</div><div className="text-xs text-slate-500">{p?.id}</div></td>
                    <td className="td">{r.testName}</td>
                    <td className="td text-slate-500">{fmtDate(r.date)}</td>
                    <td className="td">{abn ? <StatusBadge kind="H">Abnormal values</StatusBadge> : <StatusBadge kind="Final">Final</StatusBadge>}</td>
                    <td className="td">
                      <div className="flex gap-1.5">
                        <button className="btn-secondary btn-sm" onClick={() => setOpen(r)}><Eye size={14} /> Preview</button>
                        <button className="btn-secondary btn-sm" onClick={() => { downloadReportPDF({ report: r, patient: p, settings }); toast('PDF downloaded'); }}><Download size={14} /> PDF</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && <tr><td colSpan="6" className="p-10 text-center text-sm text-slate-500">No reports found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {open && <ReportModal report={open} patient={pById(open.patientId)} onClose={() => setOpen(null)} />}
    </>
  );
}
