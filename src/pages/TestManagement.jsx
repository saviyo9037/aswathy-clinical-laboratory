import { useState } from 'react';
import { FlaskConical, Info, Pencil, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Modal from '../components/Modal.jsx';
import { rangeText } from '../lib/utils.js';

const blankParam = { name: '', unit: '', low: '', high: '' };
const blankTest = { name: '', fullName: '', code: '', category: 'Biochemistry', sample: 'Serum', params: [{ ...blankParam }] };

function TestForm({ initial, onSave, onClose, editing }) {
  const [t, setT] = useState(initial);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setT({ ...t, [k]: e.target.value });
  const setParam = (i, k, v) => setT({ ...t, params: t.params.map((p, j) => (j === i ? { ...p, [k]: v } : p)) });

  const submit = (e) => {
    e.preventDefault();
    const params = t.params.filter((p) => p.name.trim());
    if (!t.name.trim()) return setErr('Test name is required');
    if (params.length === 0) return setErr('Add at least one parameter');
    onSave({
      ...t,
      name: t.name.trim(),
      fullName: t.fullName.trim() || t.name.trim(),
      code: t.code.trim() || t.name.trim().slice(0, 4).toUpperCase(),
      params: params.map((p) => ({ ...p, low: Number(p.low), high: Number(p.high) })),
    });
  };

  return (
    <Modal
      title={editing ? `Edit Test - ${initial.name}` : 'Add New Test'}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" form="test-form">{editing ? 'Save Changes' : 'Add Test'}</button>
        </>
      }
    >
      <form id="test-form" onSubmit={submit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Test Name *</label><input className="input" value={t.name} onChange={set('name')} placeholder="e.g. Vitamin D" /></div>
          <div><label className="label">Full Name</label><input className="input" value={t.fullName} onChange={set('fullName')} /></div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={t.category} onChange={set('category')}>
              {['Haematology', 'Biochemistry', 'Hormones', 'Serology', 'Urine Analysis'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label">Sample Type</label><input className="input" value={t.sample} onChange={set('sample')} /></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label !mb-0">Parameters &amp; reference ranges</label>
            <button type="button" className="btn-ghost btn-sm" onClick={() => setT({ ...t, params: [...t.params, { ...blankParam }] })}><Plus size={14} /> Add parameter</button>
          </div>
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase text-slate-500 px-1">
              <span className="col-span-5">Name</span><span className="col-span-3">Unit</span><span className="col-span-2">Low</span><span className="col-span-2">High</span>
            </div>
            {t.params.map((p, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input className="input col-span-12 sm:col-span-4" placeholder="Parameter" value={p.name} onChange={(e) => setParam(i, 'name', e.target.value)} />
                <input className="input col-span-6 sm:col-span-3" placeholder="Unit" value={p.unit} onChange={(e) => setParam(i, 'unit', e.target.value)} />
                <input className="input col-span-3 sm:col-span-2" type="number" step="any" placeholder="Low" value={p.low} onChange={(e) => setParam(i, 'low', e.target.value)} />
                <input className="input col-span-3 sm:col-span-2" type="number" step="any" placeholder="High" value={p.high} onChange={(e) => setParam(i, 'high', e.target.value)} />
                <button
                  type="button"
                  className="col-span-12 sm:col-span-1 p-2 text-slate-400 hover:text-red-500 justify-self-end"
                  onClick={() => setT({ ...t, params: t.params.filter((_, j) => j !== i) })}
                  aria-label="Remove parameter"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
      </form>
    </Modal>
  );
}

export default function TestManagement() {
  const { tests, addTest, updateTest, toast } = useApp();
  const [selected, setSelected] = useState(tests[0]?.id);
  const [form, setForm] = useState(null); // {mode:'add'|'edit', test}
  const current = tests.find((t) => t.id === selected) || tests[0];

  const onSave = (data) => {
    if (form.mode === 'edit') {
      updateTest(form.test.id, data);
      toast(`${data.name} updated`);
    } else {
      const t = addTest(data);
      setSelected(t.id);
      toast(`${data.name} added to the test library`);
    }
    setForm(null);
  };

  return (
    <>
      <PageHeader
        title="Test Management"
        subtitle="Maintain the test library, parameters and reference ranges."
        actions={<button className="btn-primary" onClick={() => setForm({ mode: 'add', test: blankTest })}><Plus size={16} /> Add Test</button>}
      />

      <div className="flex gap-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 mb-6">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>Reference ranges shown are illustrative demo values only and are not clinically approved. Configure approved ranges before real use.</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-3 h-fit">
          {tests.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`card p-4 flex items-center gap-3 text-left transition ${selected === t.id ? 'ring-2 ring-brand-500 border-brand-200' : 'hover:border-brand-200'}`}
            >
              <span className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0"><FlaskConical size={18} /></span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-sm">{t.name}</span>
                <span className="block text-xs text-slate-500 truncate">{t.category} &middot; {t.params.length} parameters</span>
              </span>
            </button>
          ))}
        </div>

        {current && (
          <div className="card lg:col-span-3 h-fit overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-navy-900">{current.fullName}</h3>
                <p className="text-xs text-slate-500 mt-1">{current.category} &middot; Sample: {current.sample} &middot; Code: {current.code}</p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setForm({ mode: 'edit', test: current })}><Pencil size={14} /> Edit</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px]">
                <thead><tr><th className="th">Parameter</th><th className="th">Unit</th><th className="th">Reference Range</th></tr></thead>
                <tbody>
                  {current.params.map((p, i) => (
                    <tr key={i} className="border-t border-slate-50">
                      <td className="td font-medium">{p.name}</td>
                      <td className="td text-slate-500">{p.unit}</td>
                      <td className="td"><span className="rounded-lg bg-brand-50 text-brand-700 px-2.5 py-1 text-xs font-semibold">{rangeText(p)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {form && <TestForm initial={form.test} editing={form.mode === 'edit'} onSave={onSave} onClose={() => setForm(null)} />}
    </>
  );
}
