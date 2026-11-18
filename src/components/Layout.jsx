import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, FlaskConical, ClipboardEdit, FileText, Settings as Cog,
  Search, Bell, Menu, X, CheckCircle2, Info, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { notifications } from '../data/mock.js';
import { initials } from '../lib/utils.js';
import logo from '../assets/logo.png';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { to: '/patients', label: 'Patients', icon: Users, title: 'Patients' },
  { to: '/register', label: 'Register Patient', icon: UserPlus, title: 'Register Patient' },
  { to: '/tests', label: 'Test Management', icon: FlaskConical, title: 'Test Management' },
  { to: '/results', label: 'Result Entry', icon: ClipboardEdit, title: 'Result Entry' },
  { to: '/reports', label: 'Reports', icon: FileText, title: 'Reports' },
  { to: '/settings', label: 'Settings', icon: Cog, title: 'Settings' },
];

function Toasts() {
  const { toasts, dismissToast } = useApp();
  const icon = { success: CheckCircle2, info: Info, error: AlertCircle };
  const color = { success: 'text-emerald-500', info: 'text-brand-600', error: 'text-red-500' };
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 w-[calc(100%-2rem)] sm:w-96">
      {toasts.map((t) => {
        const I = icon[t.type] || CheckCircle2;
        return (
          <div key={t.id} className="toast-enter flex items-start gap-3 bg-white border border-slate-100 border-l-4 shadow-xl rounded-xl p-3.5" style={{ borderLeftColor: t.type === 'error' ? '#ef4444' : t.type === 'info' ? '#2f8df5' : '#10b981' }}>
            <I size={18} className={`mt-0.5 shrink-0 ${color[t.type]}`} />
            <p className="text-sm text-slate-700 flex-1">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        );
      })}
    </div>
  );
}

function GlobalSearch() {
  const { patients } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return patients
      .filter((p) => p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.phone.includes(s))
      .slice(0, 6);
  }, [q, patients]);

  return (
    <div ref={ref} className="relative flex-1 max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        className="input pl-9 bg-slate-50"
        placeholder="Search patient name, ID or phone"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && q.trim() && (
        <div className="absolute mt-2 w-full card p-1.5 z-30">
          {matches.length === 0 && <div className="p-3 text-sm text-slate-500">No patients found</div>}
          {matches.map((p) => (
            <button
              key={p.id}
              onClick={() => { navigate(`/patients/${p.id}`); setQ(''); setOpen(false); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-brand-50 text-left"
            >
              <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold grid place-items-center">{initials(p.name)}</span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold truncate">{p.name}</span>
                <span className="block text-xs text-slate-500">{p.id} · {p.phone}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50" aria-label="Notifications">
        <Bell size={18} className="text-slate-600" />
        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 card z-30 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 text-sm font-semibold">Notifications</div>
          {notifications.map((n) => (
            <div key={n.id} className="px-4 py-3 border-b last:border-0 border-slate-50">
              <div className="text-sm">{n.text}</div>
              <div className="text-xs text-slate-400 mt-0.5">{n.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useApp();
  const current = nav.find((n) => (n.to === '/' ? pathname === '/' : pathname.startsWith(n.to)));
  const title = pathname.startsWith('/patients/') ? 'Patient Profile' : current?.title || 'Dashboard';

  useEffect(() => setMobileOpen(false), [pathname]);

  const sidebar = (
    <div className="h-full flex flex-col bg-gradient-to-b from-navy-900 via-navy-900 to-navy-800 text-white">
      <div className="px-4 py-3.5 border-b border-white/10">
        <div className="rounded-xl bg-white px-3 py-2 shadow-lg">
          <img src={logo} alt="Aswathy logo" className="mx-auto h-10 w-auto" />
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-300/60">Menu</div>
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/30 ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-xl bg-white/5 p-3 text-xs text-blue-200">
        <div className="font-semibold text-[#9fd496] mb-0.5">Prototype Demo</div>
        Fictional data. Nothing is saved after refresh.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0">{sidebar}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-navy-900/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b-2 border-lab-red/80 px-4 sm:px-8 py-3 flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={20} />
          </button>
          <h1 className="hidden md:block text-lg font-bold text-navy-900 mr-4 whitespace-nowrap">{title}</h1>
          <GlobalSearch />
          <div className="flex items-center gap-3 ml-auto">
            <Notifications />
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="h-9 w-9 rounded-full bg-lab-green text-white text-sm font-bold grid place-items-center">AD</div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-semibold">Admin</div>
                <div className="text-[11px] text-slate-500 max-w-[120px] truncate">{settings.phone}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8 max-w-[1400px] w-full mx-auto">
          <div key={pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
      <Toasts />
    </div>
  );
}
