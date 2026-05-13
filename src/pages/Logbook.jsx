import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlight, saveFlight } from '../lib/storage';
import Calendar from '../components/Calendar';
import CourseEditor from '../components/CourseEditor';
import ReasonSelector from '../components/ReasonSelector';
import VoiceInput from '../components/VoiceInput';

export default function Logbook() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courses, setCourses] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const loadFlight = useCallback((date) => {
    setMsg(null);
    setLoading(true);
    try {
      const data = getFlight(date);
      if (data) {
        setCourses(data.courses || []);
        setReasons(data.reasons || []);
      } else {
        setCourses([]);
        setReasons([]);
      }
    } catch {
      setCourses([]);
      setReasons([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFlight(selectedDate);
  }, [selectedDate, loadFlight]);

  function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      saveFlight(selectedDate, { courses, reasons });
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
      <Calendar selected={selectedDate} onChange={setSelectedDate} />

      {/* Course Editor */}
      {loading ? (
        <div className="bg-card mx-4 mt-3 rounded-xl p-4 text-center text-text-muted text-sm">加载中...</div>
      ) : (
        <CourseEditor courses={courses} onChange={setCourses} />
      )}

      {/* Reason Selector */}
      {!loading && (
        <ReasonSelector reasons={reasons} onChange={setReasons} />
      )}

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
          disabled={saving || loading}
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
