import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement>;

export function Logo(props: LogoProps) {
  const { className, ...rest } = props;
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="RotorReady logo"
      className={className}
      {...rest}
    >
      <circle cx="60" cy="60" r="56" fill="#2E6EA1" />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M38 28v64" />
        <path d="M38 28h26c14 0 22 8 22 20s-8 20-22 20H38" />
        <path d="M64 68l24 32" />
        <path d="M66 28v64" />
        <path d="M66 28h26c14 0 22 8 22 20s-8 20-22 20H66" />
        <path d="M92 68l24 32" />
      </g>
    </svg>
  );
}
