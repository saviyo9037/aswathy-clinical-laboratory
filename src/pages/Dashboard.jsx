import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, TestTube2, FileCheck2, Clock, UserPlus, ClipboardEdit, FileText, FlaskConical, ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import ReportModal from '../components/ReportModal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fmtDate, initials } from '../lib/utils.js';

const addDays = (iso, n) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export default function Dashboard() {
  const { patients, reports, pending, tests, today } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const pById = (id) => patients.find((p) => p.id === id);
  const todayReports = reports.filter((r) => r.date === today);
  const todayPatients = new Set([...todayReports.map((r) => r.patientId), ...pending.filter((x) => x.date === today).map((x) => x.patientId)]);
  const todayTests = todayReports.length + pending.filter((x) => x.date === today).length;

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Users, tone: 'bg-brand-100 text-brand-600' },
    { label: "Today's Patients", value: todayPatients.size, icon: UserCheck, tone: 'bg-lab-greenSoft text-lab-green' },
    { label: "Today's Tests", value: todayTests, icon: TestTube2, tone: 'bg-brand-100 text-brand-700' },
    { label: 'Reports Generated', value: reports.length, icon: FileCheck2, tone: 'bg-lab-greenSoft text-lab-green' },
    { label: 'Pending Reports', value: pending.length, icon: Clock, tone: 'bg-lab-redSoft text-lab-red' },
  ];

  const activity = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    return days.map((d) => ({
      d,
      label: new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      count: reports.filter((r) => r.date === d).length,
    }));
  }, [reports, today]);
  const max = Math.max(1, ...activity.map((a) => a.count));

  const recentPatients = [...patients].sort((a, b) => b.registered.localeCompare(a.registered)).slice(0, 5);
  const recentReports = [...reports].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const actions = [
    { label: 'Register Patient', icon: UserPlus, to: '/register' },
    { label: 'Enter Results', icon: ClipboardEdit, to: '/results' },
    { label: 'View Reports', icon: FileText, to: '/reports' },
    { label: 'Manage Tests', icon: FlaskConical, to: '/tests' },
  ];

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-700 to-brand-600 text-white p-6 sm:p-8 mb-6 shadow-card">
        <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-gradient-to-r from-lab-red via-lab-red to-lab-green" />
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-20 h-48 w-48 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-200">
              {new Date(today + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">Welcome back, Admin</h2>
            <p className="text-blue-100 mt-1.5 text-sm sm:text-base">
              {pending.length > 0
                ? `${pending.length} sample${pending.length > 1 ? 's are' : ' is'} waiting for results today.`
                : 'All samples are processed. Great work today.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/register')} className="btn bg-white text-navy-900 hover:bg-blue-50"><UserPlus size={16} /> Register Patient</button>
            <button onClick={() => navigate('/results')} className="btn bg-white/15 text-white border border-white/25 hover:bg-white/25"><ClipboardEdit size={16} /> Enter Results</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, tone }, i) => (
          <div key={label} className={`card card-hover p-4 sm:p-5 relative overflow-hidden ${i === 4 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-60 ${tone.split(' ')[0]}`} />
            <div className={`relative h-11 w-11 rounded-2xl grid place-items-center ${tone}`}><Icon size={21} /></div>
            <div className="relative mt-4 text-3xl font-bold text-navy-900 tracking-tight">{value}</div>
            <div className="relative text-xs font-medium text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {actions.map(({ label, icon: Icon, to }) => (
          <button key={to} onClick={() => navigate(to)} className="card card-hover p-4 flex items-center gap-3 text-left group">
            <span className="h-10 w-10 rounded-xl bg-navy-800 text-white grid place-items-center"><Icon size={18} /></span>
            <span className="font-semibold text-sm flex-1">{label}</span>
            <ArrowRight size={16} className="text-slate-300 transition group-hover:text-brand-600 group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-navy-900">Daily Activity</h3>
          <p className="text-xs text-slate-500 mb-4">Reports generated, last 7 days</p>
          <div className="flex items-end gap-3 h-44">
            {activity.map((a) => (
              <div key={a.d} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <span className="text-xs font-semibold text-slate-600">{a.count}</span>
                <div
                  className={`w-full rounded-t-lg ${a.d === today ? 'bg-brand-600' : 'bg-brand-200'}`}
                  style={{ height: `${Math.max(4, (a.count / max) * 100)}%` }}
                />
                <span className="text-[11px] text-slate-500">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-navy-900">Pending Results</h3>
            <StatusBadge kind="Pending">{pending.length} waiting</StatusBadge>
          </div>
          {pending.length === 0 && <p className="text-sm text-slate-500">All caught up. No pending results.</p>}
          <ul className="space-y-2">
            {pending.map((x) => {
              const p = pById(x.patientId);
              const t = tests.find((t) => t.id === x.testId);
              return (
                <li key={x.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p?.name}</div>
                    <div className="text-xs text-slate-500">{t?.name}</div>
                  </div>
                  <button className="btn-ghost btn-sm" onClick={() => navigate(`/results?pending=${x.id}`)}>Enter</button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-semibold text-navy-900">Recent Patients</h3>
            <Link to="/patients" className="text-xs font-semibold text-brand-600">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="th">Patient</th><th className="th">ID</th><th className="th">Registered</th></tr></thead>
              <tbody>
                {recentPatients.map((p) => (
                  <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="border-t border-slate-50 hover:bg-brand-50/50 cursor-pointer">
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold grid place-items-center">{initials(p.name)}</span>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="td text-slate-500">{p.id}</td>
                    <td className="td text-slate-500">{fmtDate(p.registered)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-semibold text-navy-900">Recent Reports</h3>
            <Link to="/reports" className="text-xs font-semibold text-brand-600">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="th">Report</th><th className="th">Patient</th><th className="th">Date</th></tr></thead>
              <tbody>
                {recentReports.map((r) => (
                  <tr key={r.id} onClick={() => setOpen(r)} className="border-t border-slate-50 hover:bg-brand-50/50 cursor-pointer">
                    <td className="td font-medium">{r.testName}</td>
                    <td className="td text-slate-600">{pById(r.patientId)?.name}</td>
                    <td className="td text-slate-500">{fmtDate(r.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {open && <ReportModal report={open} patient={pById(open.patientId)} onClose={() => setOpen(null)} />}
    </>
  );
}
