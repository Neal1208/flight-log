import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlightsInRange } from '../lib/storage';
import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';

function buildReportRows(flights) {
  const rows = [];
  flights.forEach((f) => {
    const hasCourses = f.courses?.length > 0;
    const hasReasons = f.reasons?.length > 0;
    if (hasCourses) {
      f.courses.forEach((c) =>
        rows.push({ date: f.date, course: c.name || '', hours: c.hours || '', reason: '', note: '' })
      );
    } else if (hasReasons) {
      f.reasons.forEach((r) =>
        rows.push({ date: f.date, course: '', hours: '', reason: r.type || '', note: r.note || '' })
      );
    } else {
      rows.push({ date: f.date, course: '', hours: '', reason: '', note: '' });
    }
  });
  return rows;
}

function buildSummary(flights) {
  let totalHours = 0;
  let flightDays = 0;
  let noFlyDays = 0;
  const reasonCount = {};

  flights.forEach((f) => {
    const hasCourses = f.courses?.length > 0;
    const hasReasons = f.reasons?.length > 0;
    if (hasCourses) {
      flightDays++;
      f.courses.forEach((c) => {
        totalHours += parseFloat(c.hours) || 0;
      });
    }
    if (hasReasons) {
      noFlyDays++;
      f.reasons.forEach((r) => {
        reasonCount[r.type] = (reasonCount[r.type] || 0) + 1;
      });
    }
  });

  return { totalHours, flightDays, noFlyDays, totalDays: flights.length, reasonCount };
}

export default function Report() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function doQuery(start, end) {
    setLoading(true);
    setMsg(null);
    try {
      const data = getFlightsInRange(start, end);
      setFlights(data || []);
      if (!data || data.length === 0) {
        setMsg({ type: 'error', text: '该区间暂无数据' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: '查询失败' });
    }
    setLoading(false);
    return flights;
  }

  function handleQuery() {
    if (!startDate || !endDate) {
      setMsg({ type: 'error', text: '请选择开始和结束日期' });
      return;
    }
    doQuery(startDate, endDate);
  }

  function ensureData() {
    if (flights.length === 0 && startDate && endDate) {
      const data = getFlightsInRange(startDate, endDate);
      setFlights(data || []);
      return data || [];
    }
    return flights;
  }

  function handleExportExcel() {
    const data = ensureData();
    const rows = buildReportRows(data);
    if (rows.length === 0) {
      setMsg({ type: 'error', text: '没有数据可导出，请先填写日志' });
      return;
    }

    const summary = buildSummary(data);
    const wb = XLSX.utils.book_new();

    // Sheet 1: 明细
    const sheetData = [
      ['飞行日志报表'],
      [`日期区间：${startDate} 至 ${endDate}`],
      [],
      ['日期', '课程科目', '飞行时长(h)', '未飞行原因', '备注'],
      ...rows.map((r) => [r.date, r.course, r.hours, r.reason, r.note]),
      [],
      ['汇总统计'],
      ['飞行天数', summary.flightDays],
      ['未飞行天数', summary.noFlyDays],
      ['总飞行时长(h)', summary.totalHours.toFixed(1)],
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws['!cols'] = [{ wch: 14 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 22 }];
    // Merge title row
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    XLSX.utils.book_append_sheet(wb, ws, '飞行日志');

    // Sheet 2: 原因统计
    if (Object.keys(summary.reasonCount).length > 0) {
      const reasonData = [['未飞行原因', '次数']];
      Object.entries(summary.reasonCount).forEach(([k, v]) => reasonData.push([k, v]));
      const ws2 = XLSX.utils.aoa_to_sheet(reasonData);
      ws2['!cols'] = [{ wch: 16 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, ws2, '原因统计');
    }

    XLSX.writeFile(wb, `飞行日志报表_${startDate}_至_${endDate}.xlsx`);
    setMsg({ type: 'success', text: 'Excel 报表已下载' });
  }

  function handleExportPPT() {
    const data = ensureData();
    const rows = buildReportRows(data);
    if (rows.length === 0) {
      setMsg({ type: 'error', text: '没有数据可导出，请先填写日志' });
      return;
    }

    const summary = buildSummary(data);
    const ppt = new PptxGenJS();

    // Slide 1: 概览
    const s1 = ppt.addSlide();
    s1.addText('飞行日志报表', { x: 0.5, y: 0.2, w: '90%', fontSize: 22, bold: true, color: '1a1a2e' });
    s1.addText(`${startDate} 至 ${endDate}`, { x: 0.5, y: 0.8, w: '90%', fontSize: 12, color: '666666' });
    s1.addShape(ppt.ShapeType.rect, { x: 0.5, y: 1.0, w: 3.8, h: 0.02, fill: { color: '1a1a2e' } });

    s1.addText([
      { text: '飞行天数：', options: { bold: true, fontSize: 13, color: '217346' } },
      { text: `${summary.flightDays} 天`, options: { fontSize: 13 } },
    ], { x: 0.5, y: 1.3, w: '90%' });

    s1.addText([
      { text: '总飞行时长：', options: { bold: true, fontSize: 13, color: '217346' } },
      { text: `${summary.totalHours.toFixed(1)} 小时`, options: { fontSize: 13 } },
    ], { x: 0.5, y: 1.7, w: '90%' });

    s1.addText([
      { text: '未飞行天数：', options: { bold: true, fontSize: 13, color: 'd24726' } },
      { text: `${summary.noFlyDays} 天`, options: { fontSize: 13 } },
    ], { x: 0.5, y: 2.1, w: '90%' });

    // Slide 2: 明细表
    const s2 = ppt.addSlide();
    s2.addText('飞行记录明细', { x: 0.5, y: 0.2, w: '90%', fontSize: 18, bold: true, color: '1a1a2e' });

    const headerOpts = { bold: true, fontSize: 9, fill: { color: '1a1a2e' }, color: 'FFFFFF', align: 'center' };
    const cellOpts = { fontSize: 9, align: 'center' };

    const tableData = [
      [
        { text: '日期', options: headerOpts },
        { text: '课程科目', options: headerOpts },
        { text: '飞行时长', options: headerOpts },
        { text: '未飞行原因', options: headerOpts },
        { text: '备注', options: headerOpts },
      ],
      ...rows.slice(0, 25).map((r) => [
        { text: r.date, options: cellOpts },
        { text: r.course || '-', options: { ...cellOpts, color: r.course ? '217346' : '999999' } },
        { text: r.hours || '-', options: cellOpts },
        { text: r.reason || '-', options: { ...cellOpts, color: r.reason ? 'd24726' : '999999' } },
        { text: r.note || '-', options: cellOpts },
      ]),
    ];

    s2.addTable(tableData, {
      x: 0.3, y: 0.7, w: 9.4,
      border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
      rowH: 0.28,
      autoPage: true,
    });

    // Slide 3: 原因统计
    if (Object.keys(summary.reasonCount).length > 0) {
      const s3 = ppt.addSlide();
      s3.addText('未飞行原因统计', { x: 0.5, y: 0.2, w: '90%', fontSize: 18, bold: true, color: '1a1a2e' });

      const reasonData = [
        [
          { text: '原因类型', options: headerOpts },
          { text: '次数', options: headerOpts },
        ],
        ...Object.entries(summary.reasonCount).map(([k, v]) => [
          { text: k, options: cellOpts },
          { text: String(v), options: cellOpts },
        ]),
      ];

      s3.addTable(reasonData, {
        x: 0.5, y: 0.7, w: 5,
        border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
        rowH: 0.3,
      });
    }

    ppt.writeFile({ fileName: `飞行日志报表_${startDate}_至_${endDate}.pptx` });
    setMsg({ type: 'success', text: 'PPT 报表已下载' });
  }

  const summary = flights.length > 0 ? buildSummary(flights) : null;

  return (
    <div className="min-h-dvh bg-bg pb-16">
      <div className="bg-primary text-white px-4 py-3 sticky top-0 z-10">
        <h1 className="font-semibold">📊 报表导出</h1>
      </div>

      {/* Date Range */}
      <div className="bg-card mx-4 mt-3 rounded-xl p-4">
        <h2 className="font-semibold text-text mb-3 text-[15px]">选择日期区间</h2>
        <div className="flex gap-2 items-center">
          <input type="date" className="flex-1 text-center px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-accent"
            value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span className="text-text-muted text-sm">至</span>
          <input type="date" className="flex-1 text-center px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-accent"
            value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button onClick={handleQuery} disabled={loading}
          className="w-full mt-3 py-2.5 bg-accent text-white rounded-lg font-semibold text-sm disabled:opacity-60">
          {loading ? '查询中...' : '🔍 查询数据'}
        </button>
      </div>

      {msg && (
        <div className={`mx-4 mt-2 text-xs text-center py-2 rounded-lg ${
          msg.type === 'success' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
        }`}>{msg.text}</div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="px-4 mt-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{summary.totalDays}</div>
              <div className="text-[11px] text-text-muted">总天数</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-success">{summary.flightDays}</div>
              <div className="text-[11px] text-text-muted">飞行天数</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-accent">{summary.totalHours.toFixed(1)}h</div>
              <div className="text-[11px] text-text-muted">总飞行时长</div>
            </div>
          </div>
          {summary.noFlyDays > 0 && (
            <div className="bg-card rounded-lg p-3 mt-2 text-center">
              <div className="text-sm font-semibold text-danger mb-2">未飞行 {summary.noFlyDays} 天</div>
              <div className="flex flex-wrap gap-1 justify-center">
                {Object.entries(summary.reasonCount).map(([k, v]) => (
                  <span key={k} className="text-[11px] bg-bg px-2 py-0.5 rounded-full text-text-secondary">
                    {k}：{v}次
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Buttons - always visible when summary exists */}
      {summary && (
        <div className="px-4 mt-3 flex gap-3">
          <button onClick={handleExportExcel}
            className="flex-1 py-3 bg-success text-white rounded-lg font-semibold">
            📥 Excel 报表
          </button>
          <button onClick={handleExportPPT}
            className="flex-1 py-3 bg-danger text-white rounded-lg font-semibold">
            📥 PPT 报表
          </button>
        </div>
      )}

      {/* Detail Table */}
      {flights.length > 0 && (
        <div className="bg-card mx-4 mt-3 rounded-xl p-4">
          <h2 className="font-semibold text-text mb-3 text-[15px]">记录明细</h2>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-bg">
                <tr>
                  <th className="p-2 text-left font-semibold">日期</th>
                  <th className="p-2 text-left font-semibold">内容</th>
                  <th className="p-2 text-left font-semibold">备注</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => (
                  <tr key={f.id} className="border-t border-border">
                    <td className="p-2 text-text whitespace-nowrap align-top">{f.date}</td>
                    <td className="p-2 align-top">
                      {f.courses?.length > 0
                        ? f.courses.map((c, i) => (
                            <div key={i} className="text-success text-[11px]">{c.name} · {c.hours}h</div>
                          ))
                        : null}
                      {f.reasons?.length > 0
                        ? f.reasons.map((r, i) => (
                            <div key={i} className="text-danger text-[11px]">⚠ {r.type}</div>
                          ))
                        : null}
                      {!f.courses?.length && !f.reasons?.length && (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                    <td className="p-2 text-[11px] text-text-secondary align-top">
                      {f.reasons?.map((r, i) => r.note ? <div key={i}>{r.note}</div> : null)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
