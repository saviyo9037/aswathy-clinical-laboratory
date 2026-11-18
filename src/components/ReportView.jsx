import { useApp } from '../context/AppContext.jsx';
import LetterHead from './LetterHead.jsx';
import { ageSex, categoryLabel, flagOf, fmtDMY } from '../lib/utils.js';

// On-screen preview of the lab report (mirrors the generated PDF).
export default function ReportView({ report, patient }) {
  const { settings } = useApp();
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden text-slate-800">
      <LetterHead />

      <div className="px-6 sm:px-10 pt-8 grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 text-sm">
        <div className="space-y-3">
          <div className="grid grid-cols-[150px_1fr]"><span>NAME OF PATIENT</span><span>: <b className="font-medium uppercase">{patient.name}</b></span></div>
          <div className="grid grid-cols-[150px_1fr]"><span>REFERRED BY DOCTOR</span><span>: {patient.doctor || ''}</span></div>
        </div>
        <div className="space-y-3 text-right sm:text-left">
          <div>Date : {fmtDMY(report.date)}</div>
          <div>Age : {ageSex(patient)}</div>
        </div>
      </div>

      <h4 className="text-center font-bold uppercase mt-10 mb-5 text-sm">{report.testName}</h4>

      <div className="px-4 sm:px-8 overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="font-semibold">
              <th className="px-3 py-2 text-left w-[40%]">{categoryLabel(report.category)}</th>
              <th className="px-3 py-2 text-left">Result</th>
              <th className="px-3 py-2 text-left">Normal Value</th>
            </tr>
          </thead>
          <tbody>
            {report.results.map((r, i) => {
              const f = flagOf(r);
              const abn = f === 'H' || f === 'L';
              return (
                <tr key={i}>
                  <td className="px-3 py-3">{r.name}</td>
                  <td className={`px-3 py-3 ${abn ? 'font-bold text-red-600' : ''}`}>{r.value} {r.unit}{abn ? <span className="ml-2">{f}</span> : null}</td>
                  <td className="px-3 py-3">{r.low}-{r.high} {r.unit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-10 text-center">
        <div className="text-sm">{settings.signatureName}</div>
        {settings.signatureTitle && <div className="text-xs text-slate-500">{settings.signatureTitle}</div>}
      </div>
      {settings.footer && <div className="border-t border-slate-100 px-5 py-3 text-center text-[11px] text-slate-500">{settings.footer}</div>}
    </div>
  );
}
