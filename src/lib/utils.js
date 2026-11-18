export const fmtDate = (iso) => {
  if (!iso) return '–';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const fmtLong = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

export const rangeText = (r) => `${r.low} - ${r.high}`;

// 'N' normal, 'H' high, 'L' low, '' when no value
export const flagOf = (r) => {
  const v = parseFloat(r.value);
  if (r.value === '' || r.value === undefined || Number.isNaN(v)) return '';
  if (v < Number(r.low)) return 'L';
  if (v > Number(r.high)) return 'H';
  return 'N';
};

export const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
