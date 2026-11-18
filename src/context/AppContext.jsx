import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  initialPatients, initialTests, initialReports, initialPending, initialSettings, TODAY,
} from '../data/mock.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [patients, setPatients] = useState(initialPatients);
  const [tests, setTests] = useState(initialTests);
  const [reports, setReports] = useState(initialReports);
  const [pending, setPending] = useState(initialPending);
  const [settings, setSettings] = useState(initialSettings);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const addPatient = (data) => {
    const next = Math.max(...patients.map((p) => Number(p.id.split('-')[1]))) + 1;
    const patient = { ...data, id: `ACL-${next}`, registered: TODAY };
    setPatients((p) => [patient, ...p]);
    return patient;
  };

  const updatePatient = (id, data) =>
    setPatients((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));

  const addTest = (data) => {
    const test = { ...data, id: `T${String(tests.length + 1).padStart(2, '0')}${Date.now() % 1000}` };
    setTests((t) => [...t, test]);
    return test;
  };

  const updateTest = (id, data) =>
    setTests((list) => list.map((t) => (t.id === id ? { ...t, ...data } : t)));

  const saveReport = ({ patientId, testId, results, pendingId }) => {
    const test = tests.find((t) => t.id === testId);
    const nextNum = Math.max(...reports.map((r) => Number(r.id.split('-')[1]))) + 1;
    const report = {
      id: `RPT-${nextNum}`, patientId, testId, testName: test.name, category: test.category, date: TODAY, status: 'Final', results,
    };
    setReports((r) => [report, ...r]);
    if (pendingId) setPending((p) => p.filter((x) => x.id !== pendingId));
    return report;
  };

  const value = useMemo(
    () => ({
      patients, tests, reports, pending, settings, toasts, today: TODAY,
      toast, dismissToast, addPatient, updatePatient, addTest, updateTest, saveReport, setSettings,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [patients, tests, reports, pending, settings, toasts]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
