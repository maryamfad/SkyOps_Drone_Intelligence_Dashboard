import { useMemo, useState, type ElementType } from "react";
import {
	Activity,
	AlertTriangle,
	BatteryWarning,
	CheckCircle2,
	Clock,
	Flame,
	MapPin,
	MoreHorizontal,
	Plane,
	Radio,
	Search,
	ShieldAlert,
	Siren,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/common/StatCard";
import AlertSeverity from "../components/AlertSeverity";

type AlertSeverity = "Critical" | "High" | "Medium" | "Low";
type AlertStatus = "New" | "Acknowledged" | "Resolved";
type AlertCategory =
	| "Thermal"
	| "Battery"
	| "Signal"
	| "Smoke"
	| "Sensor"
	| "Mission";

type AlertItem = {
	id: number;
	title: string;
	category: AlertCategory;
	mission: string;
	drone: string;
	location: string;
	severity: AlertSeverity;
	status: AlertStatus;
	timestamp: string;
	message: string;
};

type AlertSeverityName = "Critical" | "High" | "Medium" | "Low";

type AlertSeverityData = {
	name: AlertSeverityName;
	value: number;
	color: string;
	dotClass: string;
};

type ResponseQueueItem = {
	drone: string;
	action: string;
	priority: AlertSeverity;
};

type SeverityBadgeProps = {
	severity: AlertSeverity;
};

type StatusBadgeProps = {
	status: AlertStatus;
};

type PriorityBadgeProps = {
	priority: AlertSeverity;
};

const alerts: AlertItem[] = [
	{
		id: 1,
		title: "High Temperature Spike",
		category: "Thermal",
		mission: "Wildfire Hotspot Scan",
		drone: "SkyScout-01",
		location: "Kelowna, BC",
		severity: "Critical",
		status: "New",
		timestamp: "2 min ago",
		message: "Temperature exceeded 68°C near the active scan zone.",
	},
	{
		id: 2,
		title: "Low Battery Warning",
		category: "Battery",
		mission: "Rescue Zone Mapping",
		drone: "RescueEye-03",
		location: "North Vancouver, BC",
		severity: "High",
		status: "New",
		timestamp: "5 min ago",
		message: "Battery dropped below 20% during active rescue mapping.",
	},
	{
		id: 3,
		title: "Signal Interruption",
		category: "Signal",
		mission: "Bridge Inspection",
		drone: "Inspecto-07",
		location: "Waterloo, ON",
		severity: "Medium",
		status: "Acknowledged",
		timestamp: "11 min ago",
		message: "Drone communication signal became unstable for 40 seconds.",
	},
	{
		id: 4,
		title: "Smoke Level Increase",
		category: "Smoke",
		mission: "Wildfire Hotspot Scan",
		drone: "SkyScout-01",
		location: "Kelowna, BC",
		severity: "Critical",
		status: "New",
		timestamp: "18 min ago",
		message: "Smoke sensor reported a rapid increase in the target zone.",
	},
	{
		id: 5,
		title: "Sensor Calibration Needed",
		category: "Sensor",
		mission: "Crop Health Survey",
		drone: "AgroFlyer-02",
		location: "Guelph, ON",
		severity: "Low",
		status: "Resolved",
		timestamp: "32 min ago",
		message:
			"Multispectral sensor required calibration before data export.",
	},
	{
		id: 6,
		title: "Thermal Anomaly Detected",
		category: "Thermal",
		mission: "Solar Farm Thermal Pass",
		drone: "ThermoEye-11",
		location: "London, ON",
		severity: "High",
		status: "Acknowledged",
		timestamp: "45 min ago",
		message: "Thermal anomaly detected near panel group B-14.",
	},
];

const alertSeverityData: AlertSeverityData[] = [
	{
		name: "Critical",
		value: 3,
		color: "#ef4444",
		dotClass: "bg-red-500",
	},
	{
		name: "High",
		value: 4,
		color: "#f59e0b",
		dotClass: "bg-amber-500",
	},
	{
		name: "Medium",
		value: 2,
		color: "#3b82f6",
		dotClass: "bg-blue-500",
	},
	{
		name: "Low",
		value: 2,
		color: "#14b8a6",
		dotClass: "bg-teal-500",
	},
];
const responseQueue: ResponseQueueItem[] = [
	{
		drone: "SkyScout-01",
		action: "Review thermal spike and smoke readings",
		priority: "Critical",
	},
	{
		drone: "RescueEye-03",
		action: "Return drone to base for battery swap",
		priority: "High",
	},
	{
		drone: "Inspecto-07",
		action: "Check connection and signal module",
		priority: "Medium",
	},
];

const severityFilters: Array<"All" | AlertSeverity> = [
	"All",
	"Critical",
	"High",
	"Medium",
	"Low",
];

const statusFilters: Array<"All" | AlertStatus> = [
	"All",
	"New",
	"Acknowledged",
	"Resolved",
];

function SeverityBadge({ severity }: SeverityBadgeProps) {
	const classes: Record<AlertSeverity, string> = {
		Critical: "bg-red-100 text-red-700",
		High: "bg-amber-100 text-amber-700",
		Medium: "bg-blue-100 text-blue-700",
		Low: "bg-emerald-100 text-emerald-700",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes[severity]}`}
		>
			{severity}
		</span>
	);
}

function StatusBadge({ status }: StatusBadgeProps) {
	const classes: Record<AlertStatus, string> = {
		New: "bg-red-100 text-red-700",
		Acknowledged: "bg-amber-100 text-amber-700",
		Resolved: "bg-emerald-100 text-emerald-700",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}
		>
			{status}
		</span>
	);
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
	const classes: Record<AlertSeverity, string> = {
		Critical: "bg-red-100 text-red-700",
		High: "bg-amber-100 text-amber-700",
		Medium: "bg-blue-100 text-blue-700",
		Low: "bg-emerald-100 text-emerald-700",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes[priority]}`}
		>
			{priority}
		</span>
	);
}

function getCategoryIcon(category: AlertCategory) {
	const icons: Record<AlertCategory, ElementType> = {
		Thermal: Flame,
		Battery: BatteryWarning,
		Signal: Radio,
		Smoke: Siren,
		Sensor: Activity,
		Mission: MapPin,
	};

	return icons[category];
}

export default function AlertsPage() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedSeverity, setSelectedSeverity] = useState<
		"All" | AlertSeverity
	>("All");
	const [selectedStatus, setSelectedStatus] = useState<"All" | AlertStatus>(
		"All",
	);

	const filteredAlerts = useMemo<AlertItem[]>(() => {
		return alerts.filter((alert) => {
			const matchesSeverity =
				selectedSeverity === "All" ||
				alert.severity === selectedSeverity;

			const matchesStatus =
				selectedStatus === "All" || alert.status === selectedStatus;

			const searchValue = searchTerm.toLowerCase();

			const matchesSearch =
				alert.title.toLowerCase().includes(searchValue) ||
				alert.category.toLowerCase().includes(searchValue) ||
				alert.mission.toLowerCase().includes(searchValue) ||
				alert.drone.toLowerCase().includes(searchValue) ||
				alert.location.toLowerCase().includes(searchValue) ||
				alert.message.toLowerCase().includes(searchValue);

			return matchesSeverity && matchesStatus && matchesSearch;
		});
	}, [searchTerm, selectedSeverity, selectedStatus]);

	const criticalCount = alerts.filter(
		(alert) => alert.severity === "Critical",
	).length;

	const newCount = alerts.filter((alert) => alert.status === "New").length;

	const resolvedCount = alerts.filter(
		(alert) => alert.status === "Resolved",
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

				<Sidebar />

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
							Alerts
						</h2>
						<p className="mt-2 max-w-3xl text-slate-500">
							Track, triage, and resolve drone safety alerts,
							system warnings, and mission risks.
						</p>
					</div>

					<div className="flex gap-3">
						<button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
							Last 24 hours
						</button>

						<button className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600">
							Export Report
						</button>
					</div>
				</header>

				<section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						title="Open Alerts"
						value="11"
						subtitle={`${criticalCount} critical`}
						icon={AlertTriangle}
						color="red"
					/>

					<StatCard
						title="Critical"
						value={String(criticalCount)}
						subtitle="Immediate action"
						icon={Flame}
						color="orange"
					/>

					<StatCard
						title="Resolved Today"
						value={String(resolvedCount + 8)}
						subtitle="+4 from yesterday"
						icon={CheckCircle2}
						color="green"
					/>

					<StatCard
						title="Avg Response"
						value="14m"
						subtitle="Target under 20m"
						icon={Clock}
						color="blue"
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
								placeholder="Search by title, drone, mission, location, or message..."
								className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{severityFilters.map((severity) => (
								<button
									key={severity}
									onClick={() =>
										setSelectedSeverity(severity)
									}
									className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
										selectedSeverity === severity
											? "border-teal-500 bg-teal-500 text-white"
											: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
									}`}
								>
									{severity}
								</button>
							))}
						</div>
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						{statusFilters.map((status) => (
							<button
								key={status}
								onClick={() => setSelectedStatus(status)}
								className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
									selectedStatus === status
										? "border-slate-800 bg-slate-800 text-white"
										: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
								}`}
							>
								{status}
							</button>
						))}
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
						<div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
							<div>
								<h3 className="text-xl font-bold text-slate-950">
									Alert Center
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Live alerts with severity, affected drone,
									and current status
								</p>
							</div>

							<p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
								{filteredAlerts.length} results
							</p>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full min-w-[980px] border-collapse">
								<thead>
									<tr className="bg-slate-50 text-left text-sm text-slate-500">
										<th className="rounded-l-2xl px-4 py-4 font-semibold">
											Alert
										</th>
										<th className="px-4 py-4 font-semibold">
											Severity
										</th>
										<th className="px-4 py-4 font-semibold">
											Drone
										</th>
										<th className="px-4 py-4 font-semibold">
											Status
										</th>
										<th className="px-4 py-4 font-semibold">
											Time
										</th>
										<th className="rounded-r-2xl px-4 py-4 font-semibold" />
									</tr>
								</thead>

								<tbody>
									{filteredAlerts.map((alert) => {
										const CategoryIcon = getCategoryIcon(
											alert.category,
										);

										return (
											<tr
												key={alert.id}
												className="border-b border-slate-100 last:border-b-0"
											>
												<td className="px-4 py-5">
													<div className="flex items-start gap-3">
														<div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600">
															<CategoryIcon
																size={19}
															/>
														</div>

														<div>
															<p className="font-semibold text-slate-950">
																{alert.title}
															</p>

															<p className="mt-1 max-w-xl text-xs text-slate-400">
																{alert.mission}{" "}
																·{" "}
																{alert.location}
															</p>

															<p className="mt-2 max-w-xl text-sm text-slate-500">
																{alert.message}
															</p>
														</div>
													</div>
												</td>

												<td className="px-4 py-5">
													<SeverityBadge
														severity={
															alert.severity
														}
													/>
												</td>

												<td className="px-4 py-5">
													<p className="text-sm font-semibold text-slate-700">
														{alert.drone}
													</p>
													<p className="mt-1 text-xs text-slate-400">
														{alert.category}
													</p>
												</td>

												<td className="px-4 py-5">
													<StatusBadge
														status={alert.status}
													/>
												</td>

												<td className="px-4 py-5">
													<span className="inline-flex items-center gap-2 text-sm text-slate-500">
														<Clock size={15} />
														{alert.timestamp}
													</span>
												</td>

												<td className="px-4 py-5">
													<button className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
														<MoreHorizontal
															size={18}
														/>
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>

							{filteredAlerts.length === 0 && (
								<div className="py-12 text-center">
									<ShieldAlert
										className="mx-auto text-slate-300"
										size={42}
									/>
									<h4 className="mt-4 text-lg font-semibold text-slate-700">
										No alerts found
									</h4>
									<p className="mt-1 text-sm text-slate-400">
										Try changing the search term, severity,
										or status filter.
									</p>
								</div>
							)}
						</div>
					</div>
					<AlertSeverity alertSeverityData={alertSeverityData} />
				</section>
			</main>
		</div>
	);
}
