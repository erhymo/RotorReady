import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

export function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M11.3 1.046a1 1 0 0 1 .7 1.2l-1.1 5.254h4.1a1 1 0 0 1 .8 1.6l-7 10.5a1 1 0 0 1-1.8-.8l1.1-5.254h-4.1a1 1 0 0 1-.8-1.6l7-10.5a1 1 0 0 1 1.1-.2z" />
		</svg>
	);
}

export function BookIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4zm0 2h12v10H4V5zm2 2v6h2V7H6zm4 0v6h2V7h-2z" />
		</svg>
	);
}

export function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
			<circle cx="10" cy="10" r="4" fill="currentColor" />
		</svg>
	);
}

export function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M10 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 12.586V4a1 1 0 0 1 1-1zm-7 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z" />
		</svg>
	);
}
