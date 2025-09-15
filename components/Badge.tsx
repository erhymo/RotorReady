import * as React from "react";
import { cn } from "../lib/utils";

type Tone = "amber" | "sky" | "green" | "slate" | "cyan" | "emerald" | "teal" | "red";

const toneStyles: Record<Tone, string> = {
	amber: "bg-amber-50 text-amber-800 border border-amber-200",
	sky: "bg-sky-50 text-sky-800 border border-sky-200",
	green: "bg-green-50 text-green-800 border border-green-200",
	slate: "bg-slate-50 text-slate-700 border border-slate-200",
	cyan: "bg-cyan-50 text-cyan-800 border border-cyan-200",
	emerald: "bg-emerald-50 text-emerald-800 border border-emerald-200",
	teal: "bg-teal-50 text-teal-800 border border-teal-200",
	red: "bg-red-50 text-red-800 border border-red-200",
};

interface BadgeProps {
	children: React.ReactNode;
	tone?: Tone;
	className?: string;
}

export function Badge({ children, tone = "slate", className }: BadgeProps) {
	return (
		<span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", toneStyles[tone], className)}>
			{children}
		</span>
	);
}
