import { useApp } from '../context/AppContext.jsx';

// Letterhead styled after the lab's printed report. The mark is a placeholder logo.
export default function LetterHead({ settings: override }) {
  const ctx = useApp();
  const s = override || ctx.settings;
  return (
    <div className="text-center px-4 pt-5 pb-3 border-b-2 border-[#c44a40]">
      <div className="flex items-center justify-center gap-2 leading-none">
        <span className="font-serif italic font-bold text-3xl sm:text-4xl text-[#c44a40]">AS</span>
        <span className="text-3xl sm:text-4xl font-extrabold text-[#2b6cbe] tracking-wide">
          <span className="text-[#c44a40]">+</span>A<span className="text-2xl sm:text-3xl">SWATHY</span>
        </span>
      </div>
      <div className="font-serif font-bold text-[#3d6e34] text-sm sm:text-lg mt-1.5">COMPUTERISED CLINICAL LABORATORY</div>
      <div className="font-bold text-[#2b6cbe] text-xs sm:text-sm">{s.address}</div>
      <div className="font-semibold text-[#2b6cbe] text-[10px] sm:text-xs">Mob : {s.phone}, email: {s.email}</div>
    </div>
  );
}
