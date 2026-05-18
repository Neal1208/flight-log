import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlight, saveFlight } from '../lib/storage';
import Calendar from '../components/Calendar';
import CourseEditor from '../components/CourseEditor';
import ReasonSelector from '../components/ReasonSelector';
import VoiceInput from '../components/VoiceInput';

function d2s(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Logbook() {
  const navigate = useNavigate();
  const today = new Date();
  const todayData = getFlight(today);
  const [dateStr, setDateStr] = useState(d2s(today));
  const [courses, setCourses] = useState(todayData?.courses || []);
  const [reasons, setReasons] = useState(todayData?.reasons || []);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [version, setVersion] = useState(0);

  function handleDateChange(date) {
    const key = d2s(date);
    const data = getFlight(date);
    setDateStr(key);
    setCourses(data ? (data.courses || []) : []);
    setReasons(data ? (data.reasons || []) : []);
    setVersion((v) => v + 1);
    setMsg(null);
  }

  function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      saveFlight(dateStr, { courses, reasons });
      setMsg({ type: 'success', text: '保存成功' });
    } catch {
      setMsg({ type: 'error', text: '保存失败' });
    }
    setSaving(false);
    setTimeout(() => setMsg(null), 2000);
  }

  return (
    <div className="min-h-dvh bg-bg pb-16">
      <div className="bg-primary text-white px-4 py-3 sticky top-0 z-10">
        <h1 className="font-semibold">✈️ 飞行日志</h1>
      </div>

      <Calendar selected={new Date(dateStr + 'T00:00:00')} onChange={handleDateChange} />

      {/* Single wrapper with unique key per date change */}
      <div key={`${dateStr}-v${version}`}>
        <CourseEditor courses={courses} onChange={setCourses} />
        <ReasonSelector reasons={reasons} onChange={setReasons} />
      </div>

      {msg && (
        <div className={`mx-4 mt-2 text-xs text-center py-2 rounded-lg ${
          msg.type === 'success' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
        }`}>{msg.text}</div>
      )}

      <div className="px-4 py-2 flex gap-2 items-center">
        <VoiceInput />
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-60"
        >
          {saving ? '保存中...' : '💾 保存'}
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-card border-t border-border flex justify-around py-3 text-xs text-text-muted">
        <span className="text-primary font-semibold">📅 日志</span>
        <span className="cursor-pointer" onClick={() => navigate('/report')}>📊 报表</span>
      </div>
    </div>
  );
}
