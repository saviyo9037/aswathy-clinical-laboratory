const styles = {
  Final: 'bg-lab-greenSoft text-lab-green ring-lab-green/25',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  H: 'bg-lab-redSoft text-lab-red ring-lab-red/25',
  L: 'bg-brand-50 text-brand-700 ring-brand-200',
  N: 'bg-lab-greenSoft text-lab-green ring-lab-green/25',
};

export default function StatusBadge({ kind, children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[kind] || styles.N}`}>
      {children || kind}
    </span>
  );
}
