import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Logbook from './pages/Logbook';
import Report from './pages/Report';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Logbook />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
