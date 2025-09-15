import React from "react";
import { cn } from "../lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { className?: string; children: React.ReactNode; }) {
	return (
		<div className={cn("rounded-2xl bg-white shadow-sm ring-1 ring-slate-200", className)} {...props}>
			{children}
		</div>
	);
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode; }) {
	return <div className={cn("p-6", className)}>{children}</div>;
}
