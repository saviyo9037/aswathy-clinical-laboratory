import { useApp } from '../context/AppContext.jsx';
import logo from '../assets/logo.png';

// Letterhead styled after the lab's printed report.
export default function LetterHead({ settings: override }) {
  const ctx = useApp();
  const s = override || ctx.settings;
  return (
    <div className="text-center px-4 pt-5 pb-3 border-b-2 border-[#c44a40]">
      <img src={logo} alt="Aswathy logo" className="mx-auto h-11 sm:h-12 w-auto" />
      <div className="font-bold text-[#2b6cbe] text-xs sm:text-sm mt-2">{s.address}</div>
      <div className="font-semibold text-[#2b6cbe] text-[10px] sm:text-xs">Mob : {s.phone}, email: {s.email}</div>
    </div>
  );
}
