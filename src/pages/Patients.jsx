import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, History, Pencil, Search, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PatientFormModal from '../components/PatientFormModal.jsx';
import { fmtDate, initials } from '../lib/utils.js';

export default function Patients() {
  const { patients, reports, pending } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [gender, setGender] = useState('All');
  const [age, setAge] = useState('All');
  const [edit, setEdit] = useState(null);

  const lastVisit = (id) => {
    const dates = [...reports.filter((r) => r.patientId === id).map((r) => r.date), ...pending.filter((x) => x.patientId === id).map((x) => x.date)];
    return dates.sort().pop();
  };

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return patients.filter((p) => {
      if (s && !(p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.phone.includes(s))) return false;
      if (gender !== 'All' && p.gender !== gender) return false;
      if (age === '<30' && p.age >= 30) return false;
      if (age === '30-50' && (p.age < 30 || p.age > 50)) return false;
      if (age === '>50' && p.age <= 50) return false;
      return true;
    });
  }, [patients, q, gender, age]);

  return (
    <>
      <PageHeader
        title="Patients"
        subtitle={`${patients.length} registered patients`}
        actions={<button className="btn-primary" onClick={() => navigate('/register')}><UserPlus size={16} /> Register Patient</button>}
      />

      <div className="card">
        <div className="p-4 flex flex-wrap gap-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Search by name, ID or phone" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input w-auto" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="All">All genders</option><option>Male</option><option>Female</option>
          </select>
          <select className="input w-auto" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="All">All ages</option><option value="<30">Under 30</option><option value="30-50">30 - 50</option><option value=">50">Over 50</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr>
                {['Patient ID', 'Patient Name', 'Age', 'Gender', 'Phone', 'Last Visit', 'Actions'].map((h) => <th key={h} className="th">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t border-slate-50 hover:bg-brand-50/40">
                  <td className="td font-medium text-brand-700">{p.id}</td>
                  <td className="td">
                    <button onClick={() => navigate(`/patients/${p.id}`)} className="flex items-center gap-2.5 text-left">
                      <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold grid place-items-center">{initials(p.name)}</span>
                      <span className="font-medium hover:text-brand-600">{p.name}</span>
                    </button>
                  </td>
                  <td className="td">{p.age}</td>
                  <td className="td">{p.gender}</td>
                  <td className="td">{p.phone}</td>
                  <td className="td text-slate-500">{fmtDate(lastVisit(p.id) || p.registered)}</td>
                  <td className="td">
                    <div className="flex gap-1.5">
                      <button className="btn-secondary btn-sm" onClick={() => navigate(`/patients/${p.id}`)}><Eye size={14} /> Profile</button>
                      <button className="btn-secondary btn-sm" onClick={() => navigate(`/patients/${p.id}#history`)}><History size={14} /> History</button>
                      <button className="btn-secondary btn-sm" onClick={() => setEdit(p)} aria-label="Edit"><Pencil size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan="7" className="p-10 text-center text-sm text-slate-500">No patients match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {edit && <PatientFormModal patient={edit} onClose={() => setEdit(null)} />}
    </>
  );
}
