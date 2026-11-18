import { useState } from 'react';
import Modal from './Modal.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function PatientFormModal({ patient, onClose }) {
  const { updatePatient, toast } = useApp();
  const [f, setF] = useState({
    name: patient.name, age: patient.age, gender: patient.gender, phone: patient.phone, address: patient.address, doctor: patient.doctor || '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    updatePatient(patient.id, { ...f, age: Number(f.age) });
    toast(`Patient ${f.name} updated`);
    onClose();
  };

  return (
    <Modal
      title={`Edit Patient - ${patient.id}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" form="edit-patient">Save Changes</button>
        </>
      }
    >
      <form id="edit-patient" onSubmit={save} className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><label className="label">Patient Name</label><input required className="input" value={f.name} onChange={set('name')} /></div>
        <div><label className="label">Age</label><input required type="number" min="0" max="120" className="input" value={f.age} onChange={set('age')} /></div>
        <div>
          <label className="label">Gender</label>
          <select className="input" value={f.gender} onChange={set('gender')}><option>Male</option><option>Female</option><option>Other</option></select>
        </div>
        <div className="sm:col-span-2"><label className="label">Phone Number</label><input required className="input" value={f.phone} onChange={set('phone')} /></div>
        <div className="sm:col-span-2"><label className="label">Referred By Doctor</label><input className="input" value={f.doctor} onChange={set('doctor')} /></div>
        <div className="sm:col-span-2"><label className="label">Address</label><textarea className="input" rows="2" value={f.address} onChange={set('address')} /></div>
      </form>
    </Modal>
  );
}
