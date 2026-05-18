import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlight, saveFlight } from '../lib/storage';
import Calendar from '../components/Calendar';
import CourseEditor from '../components/CourseEditor';
import ReasonSelector from '../components/ReasonSelector';
import VoiceInput from '../components/VoiceInput';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadDate(date) {
  const data = getFlight(date);
  if (data) {
    return {
      courses: data.courses || [],
      reasons: data.reasons || [],
    };
  }
  return { courses: [], reasons: [] };
}

export default function Logbook() {
  const navigate = useNavigate();
  const [dateKey, setDateKey] = useState(todayStr);
  const [courses, setCourses] = useState(() => loadDate(new Date()).courses);
  const [reasons, setReasons] = useState(() => loadDate(new Date()).reasons);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  function handleDateChange(date) {
    const key = typeof date === 'string' ? date : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setDateKey(key);
    setMsg(null);
    // Synchronously load data for the new date
    const { courses: c, reasons: r } = loadDate(date);
    setCourses(c);
    setReasons(r);
  }

  function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      // Parse dateKey back to Date for saving
      const parts = dateKey.split('-');
      const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      saveFlight(d, { courses, reasons });
      setMsg({ type: 'success', text: '保存成功' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || '保存失败' });
    }
    setSaving(false);
    setTimeout(() => setMsg(null), 2000);
  }

  return (
    <div className="min-h-dvh bg-bg pb-16">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-3 sticky top-0 z-10">
        <h1 className="font-semibold">✈️ 飞行日志</h1>
      </div>

      {/* Calendar */}
      <Calendar selected={new Date(dateKey)} onChange={handleDateChange} />

      {/* Course Editor */}
      <CourseEditor key={dateKey} courses={courses} onChange={setCourses} />

      {/* Reason Selector */}
      <ReasonSelector key={dateKey} reasons={reasons} onChange={setReasons} />

      {/* Message */}
      {msg && (
        <div className={`mx-4 mt-2 text-xs text-center py-2 rounded-lg ${
          msg.type === 'success' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Voice + Save */}
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

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-card border-t border-border flex justify-around py-3 text-xs text-text-muted">
        <span className="text-primary font-semibold">📅 日志</span>
        <span className="cursor-pointer" onClick={() => navigate('/report')}>📊 报表</span>
      </div>
    </div>
  );
}
