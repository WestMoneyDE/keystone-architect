import { useId } from "react";
import { LOGO_COLORS, LOGO_SHAPES, LOGO_VIEWBOX } from "@/lib/brand/logo";

export function KeystoneMark({ size = 28, className }: { size?: number; className?: string }) {
  const gid = `ksg-${useId().replace(/:/g, "")}`;
  const s = LOGO_SHAPES;
  const c = LOGO_COLORS;
  return (
    <svg width={size} height={size} viewBox={LOGO_VIEWBOX} className={className} role="img" aria-label="Keystone">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.gradientFrom} />
          <stop offset="1" stopColor={c.gradientTo} />
        </linearGradient>
      </defs>
      <rect {...s.background} fill={`url(#${gid})`} />
      <path d={s.archLeft} fill="none" stroke={c.stone} strokeWidth={s.archStrokeWidth} />
      <path d={s.archRight} fill="none" stroke={c.stone} strokeWidth={s.archStrokeWidth} />
      <path d={s.keystone} fill={c.keystone} />
      <path
        d={s.book}
        fill="none"
        stroke={c.stone}
        strokeWidth={s.bookStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={s.spark} fill={c.spark} />
    </svg>
  );
}
