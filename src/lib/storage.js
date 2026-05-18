const KEY = 'flight_log_data';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function dateKey(date) {
  if (date instanceof Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return date;
}

export function getFlight(date) {
  const all = readAll();
  const k = dateKey(date);
  return all[k] || null;
}

export function saveFlight(date, { courses, reasons }) {
  const all = readAll();
  all[dateKey(date)] = { courses, reasons, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[dateKey(date)];
}

export function getFlightsInRange(startDate, endDate) {
  const all = readAll();
  const result = [];
  Object.entries(all).forEach(([date, record]) => {
    if (date >= startDate && date <= endDate) {
      result.push({ id: date, date, ...record });
    }
  });
  result.sort((a, b) => b.date.localeCompare(a.date));
  return result;
}
