import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ClipboardEdit, FileText, MapPin, Pencil, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import ReportModal from '../components/ReportModal.jsx';
import PatientFormModal from '../components/PatientFormModal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { flagOf, fmtDate, fmtLong, initials } from '../lib/utils.js';

export default function PatientProfile() {
  const { id } = useParams();
  const { patients, reports } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [edit, setEdit] = useState(false);
  const patient = patients.find((p) => p.id === id);

  useEffect(() => {
    if (window.location.hash === '#history') document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' });
  }, [id]);

  if (!patient) {
    return (
      <div className="card p-10 text-center">
        <p className="text-slate-600 mb-4">Patient not found.</p>
        <Link to="/patients" className="btn-primary">Back to patients</Link>
      </div>
    );
  }

  const history = reports.filter((r) => r.patientId === id).sort((a, b) => b.date.localeCompare(a.date));
  const abnormal = (r) => r.results.filter((x) => ['H', 'L'].includes(flagOf(x))).length;

  return (
    <>
      <button className="btn-ghost btn-sm mb-4 -ml-2" onClick={() => navigate('/patients')}><ArrowLeft size={14} /> All patients</button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 h-fit">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-navy-900 text-white text-xl font-bold grid place-items-center">{initials(patient.name)}</div>
            <div>
              <h2 className="text-lg font-bold text-navy-900 leading-tight">{patient.name}</h2>
              <div className="text-sm text-brand-700 font-semibold">{patient.id}</div>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Age / Gender</dt><dd className="font-medium">{patient.age} Yrs / {patient.gender}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500 flex items-center gap-1.5"><Phone size={14} /> Phone</dt><dd className="font-medium">{patient.phone}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500 flex items-center gap-1.5"><CalendarDays size={14} /> Registered</dt><dd className="font-medium">{fmtDate(patient.registered)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500 flex items-center gap-1.5 shrink-0"><MapPin size={14} /> Address</dt><dd className="font-medium text-right">{patient.address}</dd></div>
          </dl>
          <div className="mt-6 flex gap-2">
            <button className="btn-secondary flex-1" onClick={() => setEdit(true)}><Pencil size={15} /> Edit</button>
            <button className="btn-primary flex-1" onClick={() => navigate(`/results?patient=${patient.id}`)}><ClipboardEdit size={15} /> New Test</button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[['Total Visits', new Set(history.map((h) => h.date)).size], ['Tests Done', history.length], ['Reports', history.length]].map(([l, v]) => (
              <div key={l} className="card p-4"><div className="text-2xl font-bold text-navy-900">{v}</div><div className="text-xs text-slate-500">{l}</div></div>
            ))}
          </div>

          <div id="history" className="card p-5">
            <h3 className="font-semibold text-navy-900 mb-1">Visit &amp; Report History</h3>
            <p className="text-xs text-slate-500 mb-5">Click any entry to open the report preview.</p>

            {history.length === 0 && <p className="text-sm text-slate-500">No previous visits yet.</p>}
            <ol className="relative border-l-2 border-brand-100 ml-2 space-y-4">
              {history.map((r) => (
                <li key={r.id} className="ml-5 relative">
                  <span className="absolute -left-[27px] top-4 h-3 w-3 rounded-full bg-brand-600 ring-4 ring-white" />
                  <button
                    onClick={() => setOpen(r)}
                    className="w-full text-left rounded-xl border border-slate-100 p-4 hover:border-brand-200 hover:bg-brand-50/40 transition flex items-center gap-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0"><FileText size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{fmtLong(r.date)} &ndash; {r.testName}</div>
                      <div className="text-xs text-slate-500">{fmtDate(r.date)} &middot; {r.id}</div>
                    </div>
                    {abnormal(r) > 0 ? <StatusBadge kind="H">{abnormal(r)} abnormal</StatusBadge> : <StatusBadge kind="Final">Normal</StatusBadge>}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {open && <ReportModal report={open} patient={patient} onClose={() => setOpen(null)} />}
      {edit && <PatientFormModal patient={patient} onClose={() => setEdit(false)} />}
    </>
  );
}
