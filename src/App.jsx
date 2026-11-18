import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Patients from './pages/Patients.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import RegisterPatient from './pages/RegisterPatient.jsx';
import TestManagement from './pages/TestManagement.jsx';
import ResultEntry from './pages/ResultEntry.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientProfile />} />
        <Route path="register" element={<RegisterPatient />} />
        <Route path="tests" element={<TestManagement />} />
        <Route path="results" element={<ResultEntry />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
