import * as React from "react";

export function FlagIcon({ filled = false, ...props }: { filled?: boolean } & React.SVGProps<SVGSVGElement>) {
  return filled ? (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4 3.5A1.5 1.5 0 0 1 5.5 2h9.379a1.5 1.5 0 0 1 1.415 2.016l-.7 1.867a.5.5 0 0 0 0 .334l.7 1.867A1.5 1.5 0 0 1 14.879 10H6v6.5a.5.5 0 0 1-1 0v-13ZM5.5 3a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0V10h8.879a.5.5 0 0 0 .472-.658l-.7-1.867a1.5 1.5 0 0 1 0-1.01l.7-1.867A.5.5 0 0 0 14.879 4H5.5Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" {...props}>
      <path d="M5 2.5v15m0-15h9.379a1.5 1.5 0 0 1 1.415 2.016l-.7 1.867a.5.5 0 0 0 0 .334l.7 1.867A1.5 1.5 0 0 1 14.879 10H5m0-7.5v15" />
    </svg>
  );
}
