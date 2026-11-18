import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardEdit, RotateCcw, Save } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';

const empty = { name: '', age: '', gender: 'Female', phone: '', address: '', doctor: '' };

export default function RegisterPatient() {
  const { addPatient, toast, patients } = useApp();
  const navigate = useNavigate();
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (!f.name.trim()) e.name = 'Name is required';
    if (!f.age || Number(f.age) < 0 || Number(f.age) > 120) e.age = 'Enter a valid age';
    if (!/^\d{10}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'Enter a 10 digit phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const p = addPatient({ ...f, name: f.name.trim(), age: Number(f.age), phone: f.phone.replace(/\s/g, '') });
    setCreated(p);
    setF(empty);
    toast(`Patient registered with ID ${p.id}`);
  };

  const Err = ({ k }) => (errors[k] ? <p className="text-xs text-red-500 mt-1">{errors[k]}</p> : null);

  return (
    <>
      <PageHeader title="Register Patient" subtitle="Add a new patient to the laboratory records." />
      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={save} className="card p-6 lg:col-span-2 grid sm:grid-cols-2 gap-5" noValidate>
          <div className="sm:col-span-2">
            <label className="label">Patient Name *</label>
            <input className="input" placeholder="e.g. Meera Sasi" value={f.name} onChange={set('name')} />
            <Err k="name" />
          </div>
          <div>
            <label className="label">Age *</label>
            <input type="number" className="input" placeholder="Years" value={f.age} onChange={set('age')} />
            <Err k="age" />
          </div>
          <div>
            <label className="label">Gender *</label>
            <select className="input" value={f.gender} onChange={set('gender')}><option>Female</option><option>Male</option><option>Other</option></select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Phone Number *</label>
            <input className="input" placeholder="10 digit mobile number" value={f.phone} onChange={set('phone')} />
            <Err k="phone" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Referred By Doctor</label>
            <input className="input" placeholder="Optional" value={f.doctor} onChange={set('doctor')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <textarea className="input" rows="3" placeholder="House, street, town" value={f.address} onChange={set('address')} />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end">
            <button type="button" className="btn-secondary" onClick={() => { setF(empty); setErrors({}); }}><RotateCcw size={16} /> Reset</button>
            <button type="submit" className="btn-primary"><Save size={16} /> Save Patient</button>
          </div>
        </form>

        <div className="space-y-4">
          {created ? (
            <div className="card p-6 border-lab-green/30 bg-lab-greenSoft/60">
              <CheckCircle2 className="text-emerald-500" size={28} />
              <h3 className="font-semibold mt-3">Patient registered</h3>
              <div className="mt-3 text-sm space-y-1">
                <div><span className="text-slate-500">ID:</span> <b>{created.id}</b></div>
                <div><span className="text-slate-500">Name:</span> <b>{created.name}</b></div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button className="btn-primary" onClick={() => navigate(`/results?patient=${created.id}`)}><ClipboardEdit size={16} /> Enter test results</button>
                <button className="btn-secondary" onClick={() => navigate(`/patients/${created.id}`)}>View profile</button>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <h3 className="font-semibold text-navy-900">Next patient ID</h3>
              <div className="text-2xl font-bold text-brand-600 mt-2">
                ACL-{Math.max(...patients.map((p) => Number(p.id.split('-')[1]))) + 1}
              </div>
              <p className="text-xs text-slate-500 mt-2">IDs are generated automatically when you save. Demo IDs only.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
