// Update the import path below if the Card component is in the same directory or adjust as needed
import { Card, CardContent } from "./Card";
import { Badge } from "./Badge";
// Update the import path below if the Button component is in the same directory or adjust as needed
import { Button } from "./Button";
import { cn } from "../lib/utils";

type Tone = "amber" | "sky" | "green" | "slate" | "cyan" | "emerald" | "teal" | "red";

const ringByTone: Record<Tone, string> = {
	amber: "ring-amber-300/70",
	sky: "ring-sky-300/70",
	green: "ring-green-300/70",
	slate: "ring-slate-300/70",
	cyan: "ring-cyan-300/70",
	emerald: "ring-emerald-300/70",
	teal: "ring-teal-300/70",
	red: "ring-red-400/70",
};

const btnByTone: Record<Tone, string> = {
	amber: "bg-amber-600 hover:bg-amber-700",
	sky: "bg-sky-700 hover:bg-sky-800",
	green: "bg-green-700 hover:bg-green-800",
	slate: "bg-slate-800 hover:bg-slate-900",
	cyan: "bg-cyan-700 hover:bg-cyan-800",
	emerald: "bg-emerald-700 hover:bg-emerald-800",
	teal: "bg-teal-700 hover:bg-teal-800",
	red: "bg-red-700 hover:bg-red-800",
};

export function FeatureCard(props: {
	icon?: React.ReactNode;
	badge?: { label: string; tone: Tone };
	title: React.ReactNode;
	description: string;
	cta: { label: string; href: string };
	accent?: Tone;
	extraContent?: React.ReactNode;
}) {
	const { icon, badge, title, description, cta, accent = "sky", extraContent } = props;

	return (
		<Card className={cn("relative overflow-hidden ring-1", ringByTone[accent])}>
			<CardContent>
				<div className="flex items-center gap-3 mb-3">
					{icon && (
						<span className="inline-grid place-items-center h-9 w-9 rounded-xl bg-slate-100 text-slate-700">
							{icon}
						</span>
					)}
					{badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
				</div>

				<h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
				<p className="mt-2 text-slate-600">{description}</p>

				<div className="mt-5 flex flex-col md:flex-row md:items-center gap-2">
					<Button asChild href={cta.href} className={cn("w-full md:w-auto", btnByTone[accent])}>
						<span>{cta.label}</span>
					</Button>
					{extraContent && (
						<div className="flex flex-row gap-2 md:ml-4">{extraContent}</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
