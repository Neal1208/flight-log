const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function Calendar({ selected, onChange }) {
  const year = selected.getFullYear();
  const month = selected.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function goMonth(delta) {
    onChange(new Date(year, month + delta, 1));
  }

  function selectDay(day) {
    onChange(new Date(year, month, day));
  }

  const today = new Date();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card mx-4 mt-3 rounded-xl p-4">
      {/* Month header */}
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => goMonth(-1)} className="text-text-muted text-sm px-2">◀</button>
        <span className="font-semibold text-text text-[15px]">
          {year}年 {month + 1}月 {selected.getDate()}日
        </span>
        <button onClick={() => goMonth(1)} className="text-text-muted text-sm px-2">▶</button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[11px] text-text-muted mb-1">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">{w}</span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 text-center text-xs">
        {cells.map((day, i) =>
          day === null ? (
            <span key={`e${i}`} className="py-2" />
          ) : (
            <button
              key={day}
              onClick={() => selectDay(day)}
              className={`py-2 rounded-full text-sm w-9 h-9 mx-auto flex items-center justify-center
                ${day === selected.getDate()
                  ? 'bg-primary text-white font-semibold'
                  : day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                    ? 'font-bold text-primary'
                    : 'text-text'
                }`}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  );
}
