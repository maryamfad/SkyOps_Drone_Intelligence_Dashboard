import React from "react";
import type { ElementType } from "react";

type StatCardProps = {
	title: string;
	value: string;
	subtitle: string;
	icon: ElementType;
	color: "teal" | "orange" | "red" | "blue" | "green";
};
function getStatIconClass(color: StatCardProps["color"]) {
	const classes = {
		teal: "bg-teal-100 text-teal-700",
		orange: "bg-amber-100 text-amber-700",
		red: "bg-red-100 text-red-700",
		blue: "bg-blue-100 text-blue-700",
		green: "bg-emerald-100 text-emerald-700",
	};

	return classes[color];
}
const StatCard = ({
	title,
	value,
	subtitle,
	icon: Icon,
	color,
}: StatCardProps) => {
	return (
		<div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200">
			<div
				className={`grid h-12 w-12 place-items-center rounded-2xl ${getStatIconClass(
					color,
				)}`}
			>
				<Icon size={23} />
			</div>

			<div>
				<p className="text-sm font-medium text-slate-500">{title}</p>
				<h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
					{value}
				</h2>
				<p className="mt-1 text-sm text-slate-400">{subtitle}</p>
			</div>
		</div>
	);
};

export default StatCard;
