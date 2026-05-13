import { useState } from 'react';

const defaultCourse = { name: '', hours: '' };

export default function CourseEditor({ courses, onChange }) {
  const [inputName, setInputName] = useState('');
  const [inputHours, setInputHours] = useState('');

  function addCourse() {
    if (!inputName.trim() && !inputHours.trim()) return;
    onChange([...courses, { name: inputName.trim(), hours: inputHours.trim() }]);
    setInputName('');
    setInputHours('');
  }

  function removeCourse(index) {
    const next = courses.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div className="bg-card mx-4 mt-3 rounded-xl p-4">
      <h2 className="font-semibold text-text mb-3 text-[15px]">📋 飞行大纲课程</h2>

      {courses.map((c, i) => (
        <div key={i} className="flex gap-2 items-center mb-2 text-sm text-text">
          <span className="flex-1">{c.name || '未填科目'}</span>
          <span>{c.hours ? `${c.hours}h` : '-'}</span>
          <button
            onClick={() => removeCourse(i)}
            className="text-danger text-xs px-1"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex gap-2 items-center mt-3">
        <input
          placeholder="科目名称"
          className="flex-[2] px-2 py-2 border border-border rounded-md text-sm outline-none focus:border-accent"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          id="courseNameInput"
        />
        <input
          placeholder="时长"
          className="flex-1 px-2 py-2 border border-border rounded-md text-sm outline-none focus:border-accent"
          value={inputHours}
          onChange={(e) => setInputHours(e.target.value)}
          id="courseHoursInput"
          type="number"
          step="0.1"
        />
        <span className="text-xs text-text-muted">h</span>
        <button
          onClick={addCourse}
          className="text-accent text-sm px-2 py-2 border border-dashed border-accent rounded-md"
        >
          + 添加
        </button>
      </div>
    </div>
  );
}
