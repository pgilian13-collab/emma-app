interface GridOverlayProps {
  divisions?: number;
  className?: string;
}

export function GridOverlay({ divisions = 8, className = '' }: GridOverlayProps) {
  const lines: { left: string; top: string; axis: 'x' | 'y' }[] = [];
  for (let i = 1; i < divisions; i++) {
    const pos = `${(i / divisions) * 100}%`;
    lines.push({ left: pos, top: '0', axis: 'x' });
    lines.push({ left: '0', top: pos, axis: 'y' });
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    >
      {lines.map((line, index) => (
        <div
          key={index}
          className="absolute bg-white/15"
          style={
            line.axis === 'x'
              ? { left: line.left, top: 0, bottom: 0, width: 1 }
              : { top: line.top, left: 0, right: 0, height: 1 }
          }
        />
      ))}
      <div className="absolute left-1/2 top-1/2 h-px w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/40" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary/40" />
    </div>
  );
}