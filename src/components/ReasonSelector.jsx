const REASON_OPTIONS = [
  '天气原因',
  '运行限制',
  '身体原因',
  '个人原因',
  '英语限制',
  '转场限制',
  '公司原因',
];

export default function ReasonSelector({ reasons, onChange }) {
  function toggleReason(type) {
    const exists = reasons.find((r) => r.type === type);
    if (exists) {
      onChange(reasons.filter((r) => r.type !== type));
    } else {
      onChange([...reasons, { type, note: '' }]);
    }
  }

  function updateNote(type, note) {
    onChange(
      reasons.map((r) => (r.type === type ? { ...r, note } : r))
    );
  }

  const selectedTypes = reasons.map((r) => r.type);

  return (
    <div className="bg-card mx-4 mt-3 rounded-xl p-4">
      <h2 className="font-semibold text-text mb-3 text-[15px]">⚠️ 未飞行原因（可选）</h2>

      <div className="flex flex-wrap gap-2 mb-3">
        {REASON_OPTIONS.map((reason) => {
          const active = selectedTypes.includes(reason);
          return (
            <button
              key={reason}
              onClick={() => toggleReason(reason)}
              className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors
                ${active
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-secondary border-border'
                }`}
            >
              {reason}
            </button>
          );
        })}
      </div>

      {reasons.map((r) => (
        <div key={r.type} className="mb-2">
          <label className="text-xs text-text-secondary mb-1 block">{r.type} 备注</label>
          <input
            placeholder="备注说明（可选）"
            className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-accent"
            value={r.note}
            onChange={(e) => updateNote(r.type, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
