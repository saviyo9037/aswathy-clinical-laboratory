import { useApp } from '../context/AppContext.jsx';
import { flagOf, fmtDate, rangeText } from '../lib/utils.js';

// On-screen HTML preview of the lab report (mirrors the generated PDF).
export default function ReportView({ report, patient }) {
  const { settings } = useApp();
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden text-slate-800">
      <div className="bg-navy-900 text-white px-5 py-4 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-white text-navy-900 grid place-items-center text-[11px] font-bold">LOGO</div>
        <div className="min-w-0">
          <div className="font-bold text-sm sm:text-base leading-tight">{settings.labName}</div>
          <div className="text-xs text-blue-100 mt-1">{settings.address}</div>
          <div className="text-xs text-blue-100">Phone: {settings.phone} | {settings.email}</div>
        </div>
      </div>

      <div className="m-5 grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-xl bg-brand-50 border border-brand-100 p-4 text-sm">
        {[
          ['Patient Name', patient.name], ['Patient ID', patient.id], ['Report Date', fmtDate(report.date)],
          ['Age / Gender', `${patient.age} Yrs / ${patient.gender}`], ['Report No.', report.id], ['Phone', patient.phone],
        ].map(([l, v]) => (
          <div key={l}>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{l}</div>
            <div className="font-semibold text-slate-900">{v}</div>
          </div>
        ))}
      </div>

      <h4 className="text-center font-bold text-brand-600 tracking-wide uppercase">{report.testName}</h4>
      <div className="mx-auto mt-1 mb-3 h-0.5 w-16 bg-brand-600 rounded" />

      <div className="px-5 overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="bg-navy-900 text-white text-xs">
              {['Investigation', 'Result', 'Flag', 'Unit', 'Reference Range'].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.results.map((r, i) => {
              const f = flagOf(r);
              const abn = f === 'H' || f === 'L';
              return (
                <tr key={i} className={i % 2 ? 'bg-slate-50' : ''}>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className={`px-3 py-2 font-bold ${abn ? 'text-red-600' : ''}`}>{r.value}</td>
                  <td className={`px-3 py-2 font-bold ${abn ? 'text-red-600' : ''}`}>{abn ? f : ''}</td>
                  <td className="px-3 py-2 text-slate-500">{r.unit}</td>
                  <td className="px-3 py-2 text-slate-500">{rangeText(r)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="px-5 pt-3 text-[11px] italic text-slate-400">H = above range, L = below range. Illustrative demo values only.</p>

      <div className="px-5 pt-8 pb-5 flex justify-end">
        <div className="text-center w-56">
          <div className="text-[11px] text-slate-400 mb-6">[ Authorized signature placeholder ]</div>
          <div className="border-t border-slate-300 pt-1.5">
            <div className="text-sm font-semibold">{settings.signatureName}</div>
            <div className="text-xs text-slate-500">{settings.signatureTitle}</div>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-100 px-5 py-3 text-center text-[11px] text-slate-500">{settings.footer}</div>
    </div>
  );
}
