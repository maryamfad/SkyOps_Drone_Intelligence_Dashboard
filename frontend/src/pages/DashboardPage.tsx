import {
	AlertTriangle,
	BatteryCharging,
	CheckCircle2,
	Drone,
	Flame,
	MapPin,
	Plane,
} from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/common/StatCard";
import AlertSeverity from "../components/AlertSeverity";

const missionActivityData = [
	{ day: "Mon", completed: 6, active: 2 },
	{ day: "Tue", completed: 8, active: 3 },
	{ day: "Wed", completed: 5, active: 1 },
	{ day: "Thu", completed: 10, active: 4 },
	{ day: "Fri", completed: 7, active: 3 },
	{ day: "Sat", completed: 4, active: 2 },
	{ day: "Sun", completed: 9, active: 4 },
];
type AlertSeverityName = "Critical" | "High" | "Medium" | "Low";

type AlertSeverityData = {
	name: AlertSeverityName;
	value: number;
	color: string;
	dotClass: string;
};
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

const activeMissions = [
	{
		mission: "Wildfire Hotspot Scan",
		type: "Wildfire",
		drone: "SkyScout-01",
		risk: "Critical",
		status: "Active",
	},
	{
		mission: "Crop Health Survey",
		type: "Agriculture",
		drone: "AgroFlyer-02",
		risk: "Medium",
		status: "Active",
	},
	{
		mission: "Bridge Inspection",
		type: "Inspection",
		drone: "Inspecto-07",
		risk: "High",
		status: "Review",
	},
	{
		mission: "Rescue Zone Mapping",
		type: "Rescue",
		drone: "RescueEye-03",
		risk: "High",
		status: "Active",
	},
];

const sensorReadings = [
	{ label: "Temperature", value: "68°C", status: "Critical" },
	{ label: "Smoke Level", value: "High", status: "Critical" },
	{ label: "Altitude", value: "120 m", status: "Normal" },
	{ label: "Speed", value: "38 km/h", status: "Normal" },
	{ label: "Thermal Anomaly", value: "91%", status: "Critical" },
];

function RiskBadge({ risk }: { risk: string }) {
	const className =
		risk === "Critical"
			? "bg-red-100 text-red-700"
			: risk === "High"
				? "bg-amber-100 text-amber-700"
				: "bg-blue-100 text-blue-700";

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
		>
			{risk}
		</span>
	);
}

function StatusBadge({ status }: { status: string }) {
	const className =
		status === "Active"
			? "bg-emerald-100 text-emerald-700"
			: "bg-amber-100 text-amber-700";

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
		>
			{status}
		</span>
	);
}

function SensorBadge({ status }: { status: string }) {
	const isCritical = status === "Critical";

	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
				isCritical
					? "bg-red-100 text-red-700"
					: "bg-emerald-100 text-emerald-700"
			}`}
		>
			{isCritical ? (
				<AlertTriangle size={13} />
			) : (
				<CheckCircle2 size={13} />
			)}
			{status}
		</span>
	);
}

export default function DashboardPage() {
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
							Dashboard
						</h2>
						<p className="mt-2 max-w-2xl text-slate-500">
							Monitor fleet status, active missions, sensor
							insights, and operational alerts.
						</p>
					</div>

					<div className="flex gap-3">
						<button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
							Last 24 hours
						</button>
						<button className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600">
							Export
						</button>
					</div>
				</header>

				<section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						title="Total Drones"
						value="12"
						subtitle="+2 this month"
						icon={Drone}
						color="teal"
					/>
					<StatCard
						title="Active Missions"
						value="4"
						subtitle="2 high priority"
						icon={MapPin}
						color="orange"
					/>
					<StatCard
						title="Critical Alerts"
						value="3"
						subtitle="Needs review"
						icon={Flame}
						color="red"
					/>
					<StatCard
						title="Avg Battery"
						value="82%"
						subtitle="Healthy fleet"
						icon={BatteryCharging}
						color="blue"
					/>
				</section>

				<section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
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
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
									/>
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
					<AlertSeverity alertSeverityData={alertSeverityData} />
					{/* <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
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
										{alertSeverityData.map((entry) => (
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
									11
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Open alerts
								</p>
							</div>
						</div>

						<div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
							{alertSeverityData.map((item) => (
								<div
									key={item.name}
									className="flex items-center gap-2"
								>
									<span
										className={`h-2.5 w-2.5 rounded-full ${item.dotClass}`}
									/>
									<span>
										{item.name} {item.value}
									</span>
								</div>
							))}
						</div>
					</div> */}
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
						<div className="mb-5">
							<h3 className="text-xl font-bold text-slate-950">
								Active Missions
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								Live mission queue and assigned drones
							</p>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full min-w-[680px] border-collapse">
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
										<th className="rounded-r-2xl px-4 py-4 font-semibold">
											Status
										</th>
									</tr>
								</thead>

								<tbody>
									{activeMissions.map((mission) => (
										<tr
											key={mission.mission}
											className="border-b border-slate-100 last:border-b-0"
										>
											<td className="px-4 py-4 font-semibold text-slate-950">
												{mission.mission}
											</td>
											<td className="px-4 py-4 text-sm text-slate-600">
												{mission.type}
											</td>
											<td className="px-4 py-4 text-sm text-slate-600">
												{mission.drone}
											</td>
											<td className="px-4 py-4">
												<RiskBadge
													risk={mission.risk}
												/>
											</td>
											<td className="px-4 py-4">
												<StatusBadge
													status={mission.status}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
						<div className="mb-5">
							<h3 className="text-xl font-bold text-slate-950">
								Latest Sensor Readings
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								Simulated telemetry stream
							</p>
						</div>

						<div className="flex flex-col gap-3">
							{sensorReadings.map((reading) => (
								<div
									key={reading.label}
									className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
								>
									<div>
										<p className="text-sm text-slate-500">
											{reading.label}
										</p>
										<strong className="mt-1 block text-lg text-slate-950">
											{reading.value}
										</strong>
									</div>

									<SensorBadge status={reading.status} />
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
