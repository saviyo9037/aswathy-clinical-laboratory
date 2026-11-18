import { useState } from 'react';
import { ImagePlus, Save } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import LetterHead from '../components/LetterHead.jsx';

export default function Settings() {
  const { settings, setSettings, toast } = useApp();
  const [f, setF] = useState(settings);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    setSettings(f);
    toast('Settings saved. New reports will use these details.');
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Laboratory details used on every report." />
      <form onSubmit={save} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 grid sm:grid-cols-2 gap-5">
            <h3 className="sm:col-span-2 font-semibold text-navy-900">Laboratory</h3>
            <div className="sm:col-span-2"><label className="label">Laboratory Name</label><input className="input" value={f.labName} onChange={set('labName')} /></div>
            <div className="sm:col-span-2"><label className="label">Address</label><textarea rows="2" className="input" value={f.address} onChange={set('address')} /></div>
            <div><label className="label">Contact Number</label><input className="input" value={f.phone} onChange={set('phone')} /></div>
            <div><label className="label">Email</label><input className="input" value={f.email} onChange={set('email')} /></div>
          </div>

          <div className="card p-6 grid sm:grid-cols-2 gap-5">
            <h3 className="sm:col-span-2 font-semibold text-navy-900">Report signature &amp; footer</h3>
            <div><label className="label">Signatory Name</label><input className="input" value={f.signatureName} onChange={set('signatureName')} /></div>
            <div><label className="label">Designation</label><input className="input" value={f.signatureTitle} onChange={set('signatureTitle')} /></div>
            <div className="sm:col-span-2"><label className="label">Report Footer</label><textarea rows="3" className="input" value={f.footer} onChange={set('footer')} /></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-navy-900 mb-4">Logo</h3>
            <div className="h-32 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 grid place-items-center text-center">
              <div>
                <ImagePlus className="mx-auto text-brand-500" />
                <div className="text-xs text-slate-500 mt-2">Logo placeholder</div>
              </div>
            </div>
            <button type="button" className="btn-secondary w-full mt-3" onClick={() => toast('Logo upload is not available in the prototype', 'info')}>
              Upload logo
            </button>
          </div>
          <div className="card p-6 text-sm">
            <h3 className="font-semibold text-navy-900 mb-2">Header preview</h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden"><LetterHead settings={f} /></div>
          </div>
          <div className="flex gap-3">
            <button type="button" className="btn-secondary flex-1" onClick={() => { setF(settings); toast('Changes discarded', 'info'); }}>Discard</button>
            <button type="submit" className="btn-primary flex-1"><Save size={16} /> Save</button>
          </div>
        </div>
      </form>
    </>
  );
}
