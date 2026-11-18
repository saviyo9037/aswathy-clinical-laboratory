import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Save, User } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ReportModal from '../components/ReportModal.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { flagOf, rangeText } from '../lib/utils.js';

const Step = ({ n, title, done }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className={`h-7 w-7 rounded-full grid place-items-center text-xs font-bold ${done ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{n}</span>
    <h3 className="font-semibold text-navy-900">{title}</h3>
  </div>
);

export default function ResultEntry() {
  const { patients, tests, pending, saveReport, toast } = useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [testId, setTestId] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState(null);

  const test = tests.find((t) => t.id === testId);
  const patient = patients.find((p) => p.id === patientId);

  // Preselect from query string (?patient=ID or ?pending=ID)
  useEffect(() => {
    const pid = params.get('pending');
    const pat = params.get('patient');
    if (pid) {
      const x = pending.find((p) => p.id === pid);
      if (x) { setPatientId(x.patientId); setTestId(x.testId); setPendingId(x.id); setValues({}); }
    } else if (pat) {
      setPatientId(pat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const chooseTest = (id) => { setTestId(id); setValues({}); setPendingId(null); };

  const fillSample = () => {
    // Demo helper: fills mid-range values with slight variation
    const v = {};
    test.params.forEach((p, i) => {
      const mid = (Number(p.low) + Number(p.high)) / 2;
      const span = Number(p.high) - Number(p.low);
      const val = mid + (i % 3 === 1 ? span * 0.6 : span * 0.1);
      v[i] = String(Math.round(val * 10) / 10);
    });
    setValues(v);
    toast('Sample demo values filled', 'info');
  };

  const filled = test ? test.params.every((_, i) => values[i] !== undefined && values[i] !== '') : false;

  const save = () => {
    const results = test.params.map((p, i) => ({ ...p, value: values[i] }));
    const report = saveReport({ patientId, testId, results, pendingId });
    setSaved(report);
    toast(`Results saved. Report ${report.id} generated.`);
  };

  const reset = () => { setPatientId(''); setTestId(''); setValues({}); setPendingId(null); setSaved(null); navigate('/results', { replace: true }); };

  return (
    <>
      <PageHeader title="Result Entry" subtitle="Select a patient and test, enter values and generate the report." />

      {pending.length > 0 && !pendingId && !test && (
        <div className="card p-4 mb-6">
          <div className="text-sm font-semibold mb-3 flex items-center gap-2">Samples awaiting results <StatusBadge kind="Pending">{pending.length}</StatusBadge></div>
          <div className="flex flex-wrap gap-2">
            {pending.map((x) => (
              <button key={x.id} className="btn-secondary btn-sm" onClick={() => navigate(`/results?pending=${x.id}`)}>
                {patients.find((p) => p.id === x.patientId)?.name} &ndash; {tests.find((t) => t.id === x.testId)?.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="card p-5">
            <Step n="1" title="Select patient" done={!!patient} />
            <select className="input" value={patientId} onChange={(e) => { setPatientId(e.target.value); setPendingId(null); }}>
              <option value="">Choose patient...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
            </select>
            {patient && (
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-brand-50 p-3 text-sm">
                <User size={16} className="text-brand-600" />
                <span>{patient.age} Yrs &middot; {patient.gender} &middot; {patient.phone}</span>
              </div>
            )}
          </div>

          <div className="card p-5">
            <Step n="2" title="Select test" done={!!test} />
            <div className="grid grid-cols-2 gap-2">
              {tests.map((t) => (
                <button
                  key={t.id}
                  onClick={() => chooseTest(t.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium text-left transition ${
                    testId === t.id ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 hover:border-brand-200 hover:bg-brand-50'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2 h-fit">
          <Step n="3" title="Enter result values" done={filled} />
          {!test || !patient ? (
            <div className="py-14 text-center text-sm text-slate-500">
              <FileText className="mx-auto mb-3 text-slate-300" size={36} />
              Select a patient and a test to enter results.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="text-sm"><b>{test.fullName}</b> <span className="text-slate-500">for {patient.name}</span></div>
                <button className="btn-ghost btn-sm" onClick={fillSample}>Fill sample values</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead><tr><th className="th">Parameter</th><th className="th w-36">Result</th><th className="th">Unit</th><th className="th">Reference</th><th className="th">Flag</th></tr></thead>
                  <tbody>
                    {test.params.map((p, i) => {
                      const f = flagOf({ ...p, value: values[i] });
                      return (
                        <tr key={i} className="border-t border-slate-50">
                          <td className="td font-medium">{p.name}</td>
                          <td className="td">
                            <input
                              type="number" step="any" className={`input !py-1.5 ${f === 'H' ? 'border-red-300 bg-red-50' : f === 'L' ? 'border-blue-300 bg-blue-50' : ''}`}
                              value={values[i] ?? ''} onChange={(e) => setValues({ ...values, [i]: e.target.value })}
                            />
                          </td>
                          <td className="td text-slate-500">{p.unit}</td>
                          <td className="td text-slate-500">{rangeText(p)}</td>
                          <td className="td">{f === 'H' || f === 'L' ? <StatusBadge kind={f}>{f === 'H' ? 'High' : 'Low'}</StatusBadge> : f === 'N' ? <StatusBadge kind="N">Normal</StatusBadge> : null}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button className="btn-secondary" onClick={reset}>Clear</button>
                <button className="btn-primary" disabled={!filled} onClick={save}><Save size={16} /> Save &amp; Generate Report</button>
              </div>
            </>
          )}
        </div>
      </div>

      {saved && <ReportModal report={saved} patient={patient} onClose={() => { setSaved(null); reset(); }} />}
    </>
  );
}
