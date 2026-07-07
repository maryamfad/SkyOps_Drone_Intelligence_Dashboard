import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
type AlertSeverityName = "Critical" | "High" | "Medium" | "Low";

type AlertSeverityData = {
	name: AlertSeverityName;
	value: number;
	color: string;
	dotClass: string;
};

const AlertSeverity = ({
	alertSeverityData,
}: {
	alertSeverityData: AlertSeverityData[];
}) => {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
			<div className="mb-5">
				<h3 className="text-xl font-bold text-slate-950">
					Alert Severity
				</h3>
				<p className="mt-1 text-sm text-slate-500">
					Current open alerts by priority
				</p>
			</div>

			<div className="relative h-56">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={alertSeverityData}
							dataKey="value"
							nameKey="name"
							innerRadius={62}
							outerRadius={86}
							paddingAngle={4}
						>
							{alertSeverityData.map(
								(entry: AlertSeverityData) => (
									<Cell key={entry.name} fill={entry.color} />
								),
							)}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>

				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
					<h3 className="text-4xl font-bold tracking-tight">11</h3>
					<p className="mt-1 text-sm text-slate-500">Open alerts</p>
				</div>
			</div>

			<div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
				{alertSeverityData.map((item: AlertSeverityData) => (
					<div key={item.name} className="flex items-center gap-2">
						<span
							className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`}
						/>
						<span>
							{item.name} {item.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default AlertSeverity;
