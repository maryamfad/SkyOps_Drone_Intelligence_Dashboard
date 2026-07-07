import { useMemo, useState } from "react";
import {
	Activity,
	AlertTriangle,
	Calendar,
	CheckCircle2,
	Clock,
	Drone,
	Flame,
	LayoutDashboard,
	MapPin,
	MoreHorizontal,
	Plane,
	Plus,
	Radio,
	Search,
	Target,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ElementType } from "react";

type MissionStatus = "Active" | "Scheduled" | "Review" | "Completed";
type RiskLevel = "Critical" | "High" | "Medium" | "Low";
type StatColor = "teal" | "blue" | "orange" | "green";

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

type MissionTypeData = {
	name: string;
	value: number;
	color: string;
};

type TimelineItem = {
	time: string;
	title: string;
	status: "Active" | "Review" | "Scheduled";
};

type StatCardProps = {
	title: string;
	value: string;
	subtitle: string;
	icon: ElementType;
	color: StatColor;
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

type TimelineStatusBadgeProps = {
	status: TimelineItem["status"];
};

const missions: MissionItem[] = [
	{
		id: 1,
		title: "Wildfire Hotspot Scan",
		type: "Wildfire",
		location: "Kelowna, BC",
		drone: "SkyScout-01",
		operator: "M. Fadaee",
		risk: "Critical",
		status: "Active",
		progress: 82,
		startTime: "09:30 AM",
	},
	{
		id: 2,
		title: "Crop Health Survey",
		type: "Agriculture",
		location: "Guelph, ON",
		drone: "AgroFlyer-02",
		operator: "A. Carter",
		risk: "Medium",
		status: "Active",
		progress: 58,
		startTime: "10:15 AM",
	},
	{
		id: 3,
		title: "Bridge Inspection",
		type: "Inspection",
		location: "Waterloo, ON",
		drone: "Inspecto-07",
		operator: "S. Patel",
		risk: "High",
		status: "Review",
		progress: 76,
		startTime: "08:45 AM",
	},
	{
		id: 4,
		title: "Rescue Zone Mapping",
		type: "Rescue",
		location: "North Vancouver, BC",
		drone: "RescueEye-03",
		operator: "L. Morgan",
		risk: "High",
		status: "Active",
		progress: 41,
		startTime: "11:00 AM",
	},
	{
		id: 5,
		title: "Wildlife Corridor Count",
		type: "Wildlife",
		location: "Banff, AB",
		drone: "WildTrack-05",
		operator: "N. Rivera",
		risk: "Low",
		status: "Completed",
		progress: 100,
		startTime: "07:30 AM",
	},
	{
		id: 6,
		title: "Solar Farm Thermal Pass",
		type: "Inspection",
		location: "London, ON",
		drone: "ThermoEye-11",
		operator: "D. Kim",
		risk: "Medium",
		status: "Scheduled",
		progress: 0,
		startTime: "03:30 PM",
	},
];

const missionTypeData: MissionTypeData[] = [
	{ name: "Wildfire", value: 30, color: "#14b8a6" },
	{ name: "Agriculture", value: 24, color: "#3b82f6" },
	{ name: "Inspection", value: 18, color: "#f59e0b" },
	{ name: "Rescue", value: 16, color: "#ef4444" },
	{ name: "Wildlife", value: 12, color: "#8b5cf6" },
];

const timelineItems: TimelineItem[] = [
	{
		time: "09:30",
		title: "Launch wildfire scan",
		status: "Active",
	},
	{
		time: "11:00",
		title: "Thermal review checkpoint",
		status: "Review",
	},
	{
		time: "13:15",
		title: "Crop survey starts",
		status: "Scheduled",
	},
	{
		time: "15:30",
		title: "Bridge report delivery",
		status: "Scheduled",
	},
];

const statusFilters: Array<"All" | MissionStatus> = [
	"All",
	"Active",
	"Scheduled",
	"Review",
	"Completed",
];

function StatCard({
	title,
	value,
	subtitle,
	icon: Icon,
	color,
}: StatCardProps) {
	const colorClasses: Record<StatColor, string> = {
		teal: "bg-teal-100 text-teal-700",
		blue: "bg-blue-100 text-blue-700",
		orange: "bg-amber-100 text-amber-700",
		green: "bg-emerald-100 text-emerald-700",
	};

	return (
		<div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-lg">
			<div
				className={`grid h-12 w-12 place-items-center rounded-2xl ${colorClasses[color]}`}
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
}

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

function TimelineStatusBadge({ status }: TimelineStatusBadgeProps) {
	const className =
		status === "Active"
			? "bg-emerald-100 text-emerald-700"
			: status === "Review"
				? "bg-amber-100 text-amber-700"
				: "bg-slate-100 text-slate-600";

	return (
		<span
			className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}
		>
			{status}
		</span>
	);
}

export default function MissionsPage() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedStatus, setSelectedStatus] = useState<"All" | MissionStatus>(
		"All",
	);

	const filteredMissions = useMemo<MissionItem[]>(() => {
		return missions.filter((mission) => {
			const matchesStatus =
				selectedStatus === "All" || mission.status === selectedStatus;

			const searchValue = searchTerm.toLowerCase();

			const matchesSearch =
				mission.title.toLowerCase().includes(searchValue) ||
				mission.type.toLowerCase().includes(searchValue) ||
				mission.location.toLowerCase().includes(searchValue) ||
				mission.drone.toLowerCase().includes(searchValue) ||
				mission.operator.toLowerCase().includes(searchValue);

			return matchesStatus && matchesSearch;
		});
	}, [searchTerm, selectedStatus]);

	const activeCount = missions.filter(
		(mission) => mission.status === "Active",
	).length;

	const highRiskCount = missions.filter(
		(mission) => mission.risk === "Critical" || mission.risk === "High",
	).length;

	return (
		<div className="min-h-screen bg-slate-100 text-slate-950">
			<aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-slate-950 px-5 py-7 text-white lg:flex">
				<div className="mb-14 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							SkyOps
						</h1>
						<p className="mt-1 text-sm text-slate-400">
							Drone Intelligence
						</p>
					</div>

					<div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-500">
						<Plane size={18} />
					</div>
				</div>

				<nav className="flex flex-col gap-2">
					<a
						href="#"
						className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
					>
						<LayoutDashboard size={18} />
						Dashboard
					</a>

					<a
						href="#"
						className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
					>
						<Drone size={18} />
						Drones
					</a>

					<a
						href="#"
						className="flex items-center gap-3 rounded-2xl border-l-4 border-teal-400 bg-slate-800 px-4 py-3 text-white"
					>
						<Radio size={18} />
						Missions
					</a>

					<a
						href="#"
						className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
					>
						<AlertTriangle size={18} />
						Alerts
					</a>

					<a
						href="#"
						className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
					>
						<MapPin size={18} />
						Map View
					</a>
				</nav>

				<div className="mt-auto flex items-center gap-3 rounded-3xl bg-slate-800 p-4">
					<div className="grid h-10 w-10 place-items-center rounded-full bg-teal-500 font-bold">
						M
					</div>

					<div>
						<h4 className="text-sm font-semibold">Maryam Fadaee</h4>
						<p className="mt-1 text-xs text-slate-400">
							Full Stack Developer
						</p>
					</div>
				</div>
			</aside>

			<main className="min-h-screen p-6 lg:ml-64 lg:p-10">
				<header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
					<div>
						<h2 className="text-4xl font-bold tracking-tight text-slate-950">
							Missions
						</h2>
						<p className="mt-2 max-w-3xl text-slate-500">
							Plan, monitor, and review drone missions across
							inspection, wildfire, agriculture, rescue, and
							wildlife operations.
						</p>
					</div>

					<div className="flex gap-3">
						<button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
							<Calendar size={17} />
							This week
						</button>

						<button className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600">
							<Plus size={17} />
							New Mission
						</button>
					</div>
				</header>

				<section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						title="Total Missions"
						value="28"
						subtitle="8 scheduled"
						icon={Target}
						color="teal"
					/>

					<StatCard
						title="Active Now"
						value={String(activeCount)}
						subtitle="2 high priority"
						icon={Activity}
						color="blue"
					/>

					<StatCard
						title="High Risk"
						value={String(highRiskCount)}
						subtitle="Needs review"
						icon={Flame}
						color="orange"
					/>

					<StatCard
						title="Completion"
						value="91%"
						subtitle="+6% from last week"
						icon={CheckCircle2}
						color="green"
					/>
				</section>

				<section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
					<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
						<div className="relative w-full xl:max-w-xl">
							<Search
								size={18}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								value={searchTerm}
								onChange={(event) =>
									setSearchTerm(event.target.value)
								}
								placeholder="Search by mission, location, drone, or operator..."
								className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{statusFilters.map((status) => (
								<button
									key={status}
									onClick={() => setSelectedStatus(status)}
									className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
										selectedStatus === status
											? "border-teal-500 bg-teal-500 text-white"
											: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
									}`}
								>
									{status}
								</button>
							))}
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
						<div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
							<div>
								<h3 className="text-xl font-bold text-slate-950">
									Mission Queue
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Live operations, assigned drones, risk
									level, and progress
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
										<th className="px-4 py-4 font-semibold">
											Type
										</th>
										<th className="px-4 py-4 font-semibold">
											Drone
										</th>
										<th className="px-4 py-4 font-semibold">
											Risk
										</th>
										<th className="px-4 py-4 font-semibold">
											Progress
										</th>
										<th className="px-4 py-4 font-semibold">
											Status
										</th>
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
												<RiskBadge
													risk={mission.risk}
												/>
											</td>

											<td className="px-4 py-5">
												<ProgressBar
													value={mission.progress}
												/>
											</td>

											<td className="px-4 py-5">
												<StatusBadge
													status={mission.status}
												/>
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
									<Target
										className="mx-auto text-slate-300"
										size={42}
									/>
									<h4 className="mt-4 text-lg font-semibold text-slate-700">
										No missions found
									</h4>
									<p className="mt-1 text-sm text-slate-400">
										Try changing the search term or selected
										status.
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
							<div className="mb-5">
								<h3 className="text-xl font-bold text-slate-950">
									Mission Types
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Distribution by operation category
								</p>
							</div>

							<div className="relative h-56">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={missionTypeData}
											dataKey="value"
											nameKey="name"
											innerRadius={62}
											outerRadius={86}
											paddingAngle={4}
										>
											{missionTypeData.map((entry) => (
												<Cell
													key={entry.name}
													fill={entry.color}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>

								<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
									<h3 className="text-4xl font-bold tracking-tight">
										{missions.length}
									</h3>
									<p className="mt-1 text-sm text-slate-500">
										current list
									</p>
								</div>
							</div>

							<div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
								{missionTypeData.map((item) => (
									<div
										key={item.name}
										className="flex items-center gap-2"
									>
										<span
											className="h-2.5 w-2.5 rounded-full"
											style={{
												backgroundColor: item.color,
											}}
										/>
										<span>
											{item.name} {item.value}%
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
							<div className="mb-6">
								<h3 className="text-xl font-bold text-slate-950">
									Mission Timeline
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Upcoming and in-progress milestones
								</p>
							</div>

							<div className="space-y-5">
								{timelineItems.map((item, index) => (
									<div
										key={item.title}
										className="relative flex gap-4"
									>
										<div className="flex flex-col items-center">
											<div
												className={`h-4 w-4 rounded-full ${
													index === 0
														? "bg-teal-500"
														: "bg-slate-300"
												}`}
											/>

											{index !==
												timelineItems.length - 1 && (
												<div className="mt-2 h-10 w-px bg-slate-200" />
											)}
										</div>

										<div className="flex flex-1 items-start justify-between gap-3">
											<div>
												<p className="text-sm font-bold text-slate-950">
													{item.time}
												</p>
												<p className="mt-1 text-sm text-slate-500">
													{item.title}
												</p>
											</div>

											<TimelineStatusBadge
												status={item.status}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-teal-100 bg-teal-50 p-6">
							<div className="flex gap-3">
								<div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500 text-white">
									<AlertTriangle size={20} />
								</div>

								<div>
									<h4 className="font-bold text-slate-950">
										Mission recommendation
									</h4>
									<p className="mt-1 text-sm leading-6 text-slate-600">
										Review high-risk and critical missions
										before assigning additional drones to
										active operations.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
