import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, TestTube2, FileCheck2, Clock, UserPlus, ClipboardEdit, FileText, FlaskConical, ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
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
    { label: 'Total Patients', value: patients.length, icon: Users, tone: 'bg-brand-50 text-brand-600' },
    { label: "Today's Patients", value: todayPatients.size, icon: UserCheck, tone: 'bg-emerald-50 text-emerald-600' },
    { label: "Today's Tests", value: todayTests, icon: TestTube2, tone: 'bg-violet-50 text-violet-600' },
    { label: 'Reports Generated', value: reports.length, icon: FileCheck2, tone: 'bg-sky-50 text-sky-600' },
    { label: 'Pending Reports', value: pending.length, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
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
      <PageHeader title="Welcome back, Admin" subtitle="Here is what is happening in the laboratory today." />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card p-4 sm:p-5">
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${tone}`}><Icon size={20} /></div>
            <div className="mt-4 text-3xl font-bold text-navy-900">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {actions.map(({ label, icon: Icon, to }) => (
          <button key={to} onClick={() => navigate(to)} className="card p-4 flex items-center gap-3 hover:border-brand-200 hover:shadow-lg transition text-left">
            <span className="h-10 w-10 rounded-xl bg-navy-900 text-white grid place-items-center"><Icon size={18} /></span>
            <span className="font-semibold text-sm flex-1">{label}</span>
            <ArrowRight size={16} className="text-slate-400" />
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
