import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
type MissionActivityData = {
	day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
	completed: number;
	active: number;
};
const MissionActivity = ({
	missionActivityData,
}: {
	missionActivityData: MissionActivityData[];
}) => {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
			<div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
				<div>
					<h3 className="text-xl font-bold text-slate-950">
						Mission Activity
					</h3>
					<p className="mt-1 text-sm text-slate-500">
						Completed and active missions by day
					</p>
				</div>

				<div className="flex gap-4 text-sm text-slate-500">
					<span className="inline-flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
						Completed
					</span>
					<span className="inline-flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
						Active
					</span>
				</div>
			</div>

			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={missionActivityData}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="day" />
						<YAxis />
						<Tooltip />
						<Bar
							dataKey="completed"
							fill="#14b8a6"
							radius={[8, 8, 0, 0]}
						/>
						<Bar
							dataKey="active"
							fill="#3b82f6"
							radius={[8, 8, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default MissionActivity;
