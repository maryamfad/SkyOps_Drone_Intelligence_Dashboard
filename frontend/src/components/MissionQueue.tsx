import React from "react";
import { Clock, MapPin, MoreHorizontal, Target } from "lucide-react";

type MissionStatus = "Active" | "Scheduled" | "Review" | "Completed";
type RiskLevel = "Critical" | "High" | "Medium" | "Low";
type MissionItem = {
	id: number;
	title: string;
	type: string;
	location: string;
	drone: string;
	operator: string;
	risk: RiskLevel;
	status: MissionStatus;
	progress: number;
	startTime: string;
};

type RiskBadgeProps = {
	risk: RiskLevel;
};

type StatusBadgeProps = {
	status: MissionStatus;
};

type ProgressBarProps = {
	value: number;
};
const MissionQueue = ({
	filteredMissions,
}: {
	filteredMissions: MissionItem[];
}) => {
	function RiskBadge({ risk }: RiskBadgeProps) {
		const classes: Record<RiskLevel, string> = {
			Critical: "bg-red-100 text-red-700",
			High: "bg-amber-100 text-amber-700",
			Medium: "bg-blue-100 text-blue-700",
			Low: "bg-emerald-100 text-emerald-700",
		};

		return (
			<span
				className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes[risk]}`}
			>
				{risk}
			</span>
		);
	}

	function StatusBadge({ status }: StatusBadgeProps) {
		const classes: Record<MissionStatus, string> = {
			Active: "bg-emerald-100 text-emerald-700",
			Scheduled: "bg-slate-100 text-slate-600",
			Review: "bg-amber-100 text-amber-700",
			Completed: "bg-sky-100 text-sky-700",
		};

		return (
			<span
				className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}
			>
				{status}
			</span>
		);
	}

	function ProgressBar({ value }: ProgressBarProps) {
		const barColor =
			value >= 80
				? "bg-teal-500"
				: value > 0
					? "bg-amber-500"
					: "bg-slate-300";

		return (
			<div className="w-32">
				<div className="mb-2 flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-600">
						{value}%
					</span>
				</div>

				<div className="h-2 overflow-hidden rounded-full bg-slate-200">
					<div
						className={`h-full rounded-full ${barColor}`}
						style={{ width: `${value}%` }}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
			<div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
				<div>
					<h3 className="text-xl font-bold text-slate-950">
						Mission Queue
					</h3>
					<p className="mt-1 text-sm text-slate-500">
						Live operations, assigned drones, risk level, and
						progress
					</p>
				</div>

				<p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
					{filteredMissions.length} results
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[980px] border-collapse">
					<thead>
						<tr className="bg-slate-50 text-left text-sm text-slate-500">
							<th className="rounded-l-2xl px-4 py-4 font-semibold">
								Mission
							</th>
							<th className="px-4 py-4 font-semibold">Type</th>
							<th className="px-4 py-4 font-semibold">Drone</th>
							<th className="px-4 py-4 font-semibold">Risk</th>
							<th className="px-4 py-4 font-semibold">
								Progress
							</th>
							<th className="px-4 py-4 font-semibold">Status</th>
							<th className="rounded-r-2xl px-4 py-4 font-semibold" />
						</tr>
					</thead>

					<tbody>
						{filteredMissions.map((mission) => (
							<tr
								key={mission.id}
								className="border-b border-slate-100 last:border-b-0"
							>
								<td className="px-4 py-5">
									<p className="font-semibold text-slate-950">
										{mission.title}
									</p>

									<div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
										<span className="inline-flex items-center gap-1">
											<MapPin size={13} />
											{mission.location}
										</span>

										<span className="inline-flex items-center gap-1">
											<Clock size={13} />
											{mission.startTime}
										</span>
									</div>
								</td>

								<td className="px-4 py-5 text-sm text-slate-600">
									{mission.type}
								</td>

								<td className="px-4 py-5">
									<p className="text-sm font-semibold text-slate-700">
										{mission.drone}
									</p>
									<p className="mt-1 text-xs text-slate-400">
										{mission.operator}
									</p>
								</td>

								<td className="px-4 py-5">
									<RiskBadge risk={mission.risk} />
								</td>

								<td className="px-4 py-5">
									<ProgressBar value={mission.progress} />
								</td>

								<td className="px-4 py-5">
									<StatusBadge status={mission.status} />
								</td>

								<td className="px-4 py-5">
									<button className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
										<MoreHorizontal size={18} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{filteredMissions.length === 0 && (
					<div className="py-12 text-center">
						<Target className="mx-auto text-slate-300" size={42} />
						<h4 className="mt-4 text-lg font-semibold text-slate-700">
							No missions found
						</h4>
						<p className="mt-1 text-sm text-slate-400">
							Try changing the search term or selected status.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MissionQueue;
