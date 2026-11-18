const styles = {
  Final: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  H: 'bg-red-50 text-red-600 ring-red-200',
  L: 'bg-blue-50 text-blue-600 ring-blue-200',
  N: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export default function StatusBadge({ kind, children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[kind] || styles.N}`}>
      {children || kind}
    </span>
  );
}
