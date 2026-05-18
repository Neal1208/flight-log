import { useState } from 'react';

export default function CourseEditor({ courses, onChange }) {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');

  function add() {
    const n = name.trim();
    const h = hours.trim();
    if (!n && !h) return;
    onChange([...courses, { name: n, hours: h }]);
    setName('');
    setHours('');
  }

  function remove(i) {
    onChange(courses.filter((_, j) => j !== i));
  }

  return (
    <div className="bg-card mx-4 mt-3 rounded-xl p-4">
      <h2 className="font-semibold text-text mb-3 text-[15px]">📋 飞行大纲课程</h2>

      {courses.length === 0 ? (
        <p className="text-xs text-text-muted mb-2">暂无课程，请在下方添加</p>
      ) : (
        courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-center mb-2 text-sm text-text bg-bg rounded-lg px-3 py-2">
            <span className="flex-1">{c.name || '未填科目'}</span>
            <span className="text-text-secondary">{c.hours ? `${c.hours}h` : '-'}</span>
            <button onClick={() => remove(i)} className="text-danger text-sm px-1">&times;</button>
          </div>
        ))
      )}

      <div className="flex gap-2 items-center pt-1">
        <input
          placeholder="科目名称"
          className="flex-[2] px-2 py-2 border border-border rounded-md text-sm outline-none focus:border-accent bg-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="时长"
          className="w-14 px-2 py-2 border border-border rounded-md text-sm outline-none focus:border-accent bg-white"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          type="number"
          step="0.1"
          min="0"
        />
        <span className="text-xs text-text-muted">h</span>
        <button onClick={add} className="shrink-0 text-accent text-sm px-2 py-2 border border-dashed border-accent rounded-md whitespace-nowrap">
          + 添加
        </button>
      </div>
    </div>
  );
}
