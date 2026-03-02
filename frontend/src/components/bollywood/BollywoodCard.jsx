export default function BollywoodCard({ title, tag }) {
  return (
    <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
      <div className="text-xs uppercase tracking-wider text-white/60">{tag}</div>
      <div className="mt-1 text-base font-medium">{title}</div>
      <div className="mt-2 text-sm text-white/60">Read more → (fake content)</div>
    </div>
  );
}