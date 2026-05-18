import { useRef } from 'react';

export default function CourseEditor({ courses, onChange }) {
  const nameRef = useRef(null);
  const hoursRef = useRef(null);

  function add() {
    const n = nameRef.current?.value?.trim() || '';
    const h = hoursRef.current?.value?.trim() || '';
    if (!n && !h) return;
    onChange([...courses, { name: n, hours: h }]);
    if (nameRef.current) nameRef.current.value = '';
    if (hoursRef.current) hoursRef.current.value = '';
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  }

  return (
    <div className="bg-card mx-4 mt-3 rounded-xl p-4">
      <h2 className="font-semibold text-text mb-3 text-[15px]">📋 飞行大纲课程</h2>

      {courses.length === 0 ? (
        <p className="text-xs text-text-muted mb-2">暂无课程，请在下方添加</p>
      ) : (
        courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-center mb-2 text-sm bg-bg rounded-lg px-3 py-2">
            <span className="flex-1 text-text">{c.name || '未填科目'}</span>
            <span className="text-text-secondary">{c.hours ? `${c.hours}h` : '-'}</span>
            <button
              onClick={() => onChange(courses.filter((_, j) => j !== i))}
              className="text-danger text-sm px-1"
            >&times;</button>
          </div>
        ))
      )}

      <div className="flex gap-2 items-center pt-1">
        <input ref={nameRef} placeholder="科目名称"
          className="flex-[2] px-2 py-2 border border-border rounded-md text-sm outline-none focus:border-accent bg-white"
          onKeyDown={handleKeyDown} />
        <input ref={hoursRef} placeholder="时长" type="number" step="0.1" min="0"
          className="w-14 px-2 py-2 border border-border rounded-md text-sm outline-none focus:border-accent bg-white"
          onKeyDown={handleKeyDown} />
        <span className="text-xs text-text-muted">h</span>
        <button onClick={add}
          className="shrink-0 text-accent text-sm px-2 py-2 border border-dashed border-accent rounded-md whitespace-nowrap">
          + 添加
        </button>
      </div>
    </div>
  );
}
