import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlightsInRange } from '../lib/storage';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';

export default function Report() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function handleQuery() {
    if (!startDate || !endDate) {
      setMsg({ type: 'error', text: '请选择开始和结束日期' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const data = getFlightsInRange(startDate, endDate);
      setPreview(data || []);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || '查询失败' });
    }
    setLoading(false);
  }

  function buildRows() {
    return preview.map((f) => {
      const hasCourses = f.courses && f.courses.length > 0;
      const hasReasons = f.reasons && f.reasons.length > 0;

      if (hasCourses) {
        return f.courses.map((c) => ({
          date: f.date,
          course: c.name || '',
          hours: c.hours || '',
          reason: '',
          note: '',
        }));
      } else if (hasReasons) {
        return f.reasons.map((r) => ({
          date: f.date,
          course: '',
          hours: '',
          reason: r.type || '',
          note: r.note || '',
        }));
      } else {
        return [{ date: f.date, course: '', hours: '', reason: '', note: '' }];
      }
    }).flat();
  }

  function handleExportExcel() {
    const rows = buildRows();
    if (rows.length === 0) {
      setMsg({ type: 'error', text: '没有数据可导出' });
      return;
    }

    const sheetData = [
      ['日期', '课程科目', '飞行时长(h)', '未飞行原因', '备注'],
      ...rows.map((r) => [r.date, r.course, r.hours, r.reason, r.note]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = [
      { wch: 12 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, '飞行日志');
    XLSX.writeFile(wb, `飞行日志_${startDate}_至_${endDate}.xlsx`);
    setMsg({ type: 'success', text: 'Excel 导出成功' });
  }

  function handleExportPPT() {
    const rows = buildRows();
    if (rows.length === 0) {
      setMsg({ type: 'error', text: '没有数据可导出' });
      return;
    }

    const ppt = new PptxGenJS();
    const slide = ppt.addSlide();

    slide.addText('飞行日志报表', {
      x: 0.5, y: 0.3, w: '90%', fontSize: 20, bold: true, color: '1a1a2e',
    });
    slide.addText(`${startDate} 至 ${endDate}`, {
      x: 0.5, y: 0.9, w: '90%', fontSize: 12, color: '666666',
    });

    const headerRow = [
      { text: '日期', options: { bold: true, fontSize: 10, fill: { color: 'F0F0F0' } } },
      { text: '课程', options: { bold: true, fontSize: 10, fill: { color: 'F0F0F0' } } },
      { text: '时长', options: { bold: true, fontSize: 10, fill: { color: 'F0F0F0' } } },
      { text: '原因', options: { bold: true, fontSize: 10, fill: { color: 'F0F0F0' } } },
      { text: '备注', options: { bold: true, fontSize: 10, fill: { color: 'F0F0F0' } } },
    ];

    const tableRows = [
      headerRow,
      ...rows.map((r) => [
        { text: r.date, options: { fontSize: 9 } },
        { text: r.course, options: { fontSize: 9 } },
        { text: r.hours, options: { fontSize: 9 } },
        { text: r.reason, options: { fontSize: 9 } },
        { text: r.note, options: { fontSize: 9 } },
      ]),
    ];

    slide.addTable(tableRows, {
      x: 0.5, y: 1.3, w: '90%',
      border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
      rowH: 0.3,
    });

    ppt.writeFile({ fileName: `飞行日志_${startDate}_至_${endDate}.pptx` });
    setMsg({ type: 'success', text: 'PPT 导出成功' });
  }

  return (
    <div className="min-h-dvh bg-bg pb-16">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-3 sticky top-0 z-10">
        <h1 className="font-semibold">📊 报表导出</h1>
      </div>

      {/* Date Range */}
      <div className="bg-card mx-4 mt-3 rounded-xl p-4">
        <h2 className="font-semibold text-text mb-3 text-[15px]">选择日期区间</h2>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            className="flex-1 text-center px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-accent"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-text-muted text-sm">至</span>
          <input
            type="date"
            className="flex-1 text-center px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-accent"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={handleQuery}
          disabled={loading}
          className="w-full mt-3 py-2.5 bg-accent text-white rounded-lg font-semibold text-sm disabled:opacity-60"
        >
          {loading ? '查询中...' : '🔍 查询数据'}
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div className={`mx-4 mt-2 text-xs text-center py-2 rounded-lg ${
          msg.type === 'success' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="bg-card mx-4 mt-3 rounded-xl p-4">
          <h2 className="font-semibold text-text mb-3 text-[15px]">数据预览（{preview.length} 条）</h2>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-bg">
                <tr>
                  <th className="p-2 text-left font-semibold">日期</th>
                  <th className="p-2 text-left font-semibold">课程 / 原因</th>
                  <th className="p-2 text-left font-semibold">详情</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((f) => (
                  <tr key={f.id} className="border-t border-border">
                    <td className="p-2 text-text whitespace-nowrap">{f.date}</td>
                    <td className="p-2">
                      {f.courses?.length > 0
                        ? f.courses.map((c, i) => (
                            <div key={i} className="text-success">{c.name} {c.hours}h</div>
                          ))
                        : f.reasons?.length > 0
                          ? f.reasons.map((r, i) => (
                              <div key={i} className="text-danger">{r.type}</div>
                            ))
                          : <span className="text-text-muted">-</span>
                      }
                    </td>
                    <td className="p-2 text-xs text-text-secondary">
                      {f.reasons?.map((r, i) => r.note ? <div key={i}>{r.note}</div> : null)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleExportExcel}
              className="flex-1 py-3 bg-success text-white rounded-lg font-semibold"
            >
              📥 Excel 导出
            </button>
            <button
              onClick={handleExportPPT}
              className="flex-1 py-3 bg-danger text-white rounded-lg font-semibold"
            >
              📥 PPT 导出
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-card border-t border-border flex justify-around py-3 text-xs text-text-muted">
        <span className="cursor-pointer" onClick={() => navigate('/')}>📅 日志</span>
        <span className="text-primary font-semibold">📊 报表</span>
      </div>
    </div>
  );
}
