// Update the import path if needed, or create the utils file with a cn function.
import { cn } from "../lib/utils";
import Link from "next/link";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	asChild?: boolean;
	href?: string;
  };

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ asChild, href, className, children, type = "button", onClick, ...props }, ref) => {
	const base =
	  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
	const styles = "bg-slate-900 hover:bg-slate-950 focus:ring-slate-400";

	if (asChild && href) {
	  return (
		<Link
		  href={href}
		  className={cn(base, styles, className)}
		  ref={ref as React.Ref<HTMLAnchorElement>}
		  {...props}
		>
		  {children}
		</Link>
	  );
	}
	return (
	  <button
		type={type}
		onClick={onClick}
		className={cn(base, styles, className)}
		ref={ref as React.Ref<HTMLButtonElement>}
		{...props}
	  >
		{children}
	  </button>
	);
  }
);

Button.displayName = "Button";
