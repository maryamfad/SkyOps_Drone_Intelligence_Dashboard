import { useMemo, useState, type ElementType } from "react";
import {
	Activity,
	BatteryCharging,
	Clock,
	MoreHorizontal,
	Plane,
	Plus,
	Search,
	ShieldCheck,
	Wrench,
	WifiOff,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Sidebar from "../components/layout/Sidebar";

type DroneStatus = "Available" | "In Mission" | "Maintenance" | "Offline";

type DroneItem = {
	id: number;
	name: string;
	model: string;
	serialNumber: string;
	status: DroneStatus;
	battery: number | null;
	sensor: string;
	mission: string;
	lastActive: string;
};

type StatCardProps = {
	title: string;
	value: string;
	subtitle: string;
	icon: ElementType;
	color: "teal" | "green" | "blue" | "orange";
};

const drones: DroneItem[] = [
	{
		id: 1,
		name: "SkyScout-01",
		model: "DJI Matrice 350",
		serialNumber: "SKY-350-001",
		status: "In Mission",
		battery: 76,
		sensor: "Thermal Camera",
		mission: "Wildfire Scan",
		lastActive: "2 min ago",
	},
	{
		id: 2,
		name: "AgroFlyer-02",
		model: "DJI Mavic 3M",
		serialNumber: "AGR-3M-002",
		status: "Available",
		battery: 94,
		sensor: "Multispectral",
		mission: "Unassigned",
		lastActive: "8 min ago",
	},
	{
		id: 3,
		name: "Inspecto-07",
		model: "Autel EVO Max",
		serialNumber: "INS-MAX-007",
		status: "Maintenance",
		battery: 18,
		sensor: "LiDAR",
		mission: "Bridge Review",
		lastActive: "1 hr ago",
	},
	{
		id: 4,
		name: "RescueEye-03",
		model: "DJI Matrice 30T",
		serialNumber: "RES-30T-003",
		status: "In Mission",
		battery: 63,
		sensor: "RGB + Thermal",
		mission: "Rescue Mapping",
		lastActive: "5 min ago",
	},
	{
		id: 5,
		name: "WildTrack-05",
		model: "Skydio X10",
		serialNumber: "WLD-X10-005",
		status: "Offline",
		battery: null,
		sensor: "Thermal Camera",
		mission: "Unassigned",
		lastActive: "2 days ago",
	},
	{
		id: 6,
		name: "CargoLift-09",
		model: "DJI FlyCart 30",
		serialNumber: "CRG-FC30-009",
		status: "Maintenance",
		battery: 41,
		sensor: "Payload Sensor",
		mission: "Supply Delivery",
		lastActive: "3 hrs ago",
	},
];

const fleetHealthData = [
	{ name: "Healthy", value: 5, color: "#14b8a6" },
	{ name: "Active", value: 4, color: "#3b82f6" },
	{ name: "Low Battery", value: 1, color: "#f59e0b" },
	{ name: "Critical", value: 2, color: "#ef4444" },
];

const maintenanceQueue = [
	{
		drone: "Inspecto-07",
		issue: "Battery replacement",
		priority: "High",
	},
	{
		drone: "WildTrack-05",
		issue: "Signal diagnostic",
		priority: "Medium",
	},
	{
		drone: "CargoLift-09",
		issue: "Propeller check",
		priority: "Low",
	},
];

const statusFilters: Array<"All" | DroneStatus> = [
	"All",
	"Available",
	"In Mission",
	"Maintenance",
	"Offline",
];

function getStatIconClass(color: StatCardProps["color"]) {
	const classes = {
		teal: "bg-teal-100 text-teal-700",
		green: "bg-emerald-100 text-emerald-700",
		blue: "bg-blue-100 text-blue-700",
		orange: "bg-amber-100 text-amber-700",
	};

	return classes[color];
}

function StatCard({
	title,
	value,
	subtitle,
	icon: Icon,
	color,
}: StatCardProps) {
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
}

function StatusBadge({ status }: { status: DroneStatus }) {
	const classes = {
		Available: "bg-emerald-100 text-emerald-700",
		"In Mission": "bg-blue-100 text-blue-700",
		Maintenance: "bg-amber-100 text-amber-700",
		Offline: "bg-slate-100 text-slate-600",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}
		>
			{status}
		</span>
	);
}

function PriorityBadge({ priority }: { priority: string }) {
	const className =
		priority === "High"
			? "bg-red-100 text-red-700"
			: priority === "Medium"
				? "bg-amber-100 text-amber-700"
				: "bg-teal-100 text-teal-700";

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
		>
			{priority}
		</span>
	);
}

function BatteryBar({ value }: { value: number | null }) {
	if (value === null) {
		return <span className="text-sm text-slate-400">No signal</span>;
	}

	const barColor =
		value > 60
			? "bg-emerald-500"
			: value > 25
				? "bg-amber-500"
				: "bg-red-500";

	return (
		<div className="w-32">
			<div className="mb-2 flex items-center justify-between">
				<span className="text-sm font-semibold text-slate-700">
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

export default function DronesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<"All" | DroneStatus>(
		"All",
	);

	const filteredDrones = useMemo(() => {
		return drones.filter((drone) => {
			const matchesStatus =
				selectedStatus === "All" || drone.status === selectedStatus;

			const searchValue = searchTerm.toLowerCase();

			const matchesSearch =
				drone.name.toLowerCase().includes(searchValue) ||
				drone.model.toLowerCase().includes(searchValue) ||
				drone.serialNumber.toLowerCase().includes(searchValue) ||
				drone.sensor.toLowerCase().includes(searchValue);

			return matchesStatus && matchesSearch;
		});
	}, [searchTerm, selectedStatus]);

	const availableCount = drones.filter(
		(drone) => drone.status === "Available",
	).length;

	const inMissionCount = drones.filter(
		(drone) => drone.status === "In Mission",
	).length;

	const maintenanceCount = drones.filter(
		(drone) => drone.status === "Maintenance",
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
							Drones
						</h2>
						<p className="mt-2 max-w-2xl text-slate-500">
							Manage drone fleet status, battery health, sensors,
							and mission readiness.
						</p>
					</div>

					<div className="flex gap-3">
						<button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
							Filter status
						</button>

						<button className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600">
							<Plus size={17} />
							Add Drone
						</button>
					</div>
				</header>

				<section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						title="Total Drones"
						value={String(drones.length)}
						subtitle="+2 added this month"
						icon={Plane}
						color="teal"
					/>

					<StatCard
						title="Available"
						value={String(availableCount)}
						subtitle="Ready for mission"
						icon={ShieldCheck}
						color="green"
					/>

					<StatCard
						title="In Mission"
						value={String(inMissionCount)}
						subtitle="Currently active"
						icon={Activity}
						color="blue"
					/>

					<StatCard
						title="Maintenance"
						value={String(maintenanceCount)}
						subtitle="Needs attention"
						icon={Wrench}
						color="orange"
					/>
				</section>

				<section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
					<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
						<div className="relative w-full xl:max-w-lg">
							<Search
								size={18}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
							/>

							<input
								value={searchTerm}
								onChange={(event) =>
									setSearchTerm(event.target.value)
								}
								placeholder="Search drones by name, model, serial number, or sensor..."
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
									Drone Fleet
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Live inventory with health and assignment
									status
								</p>
							</div>

							<p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
								{filteredDrones.length} results
							</p>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full min-w-[900px] border-collapse">
								<thead>
									<tr className="bg-slate-50 text-left text-sm text-slate-500">
										<th className="rounded-l-2xl px-4 py-4 font-semibold">
											Drone
										</th>
										<th className="px-4 py-4 font-semibold">
											Status
										</th>
										<th className="px-4 py-4 font-semibold">
											Battery
										</th>
										<th className="px-4 py-4 font-semibold">
											Sensor
										</th>
										<th className="px-4 py-4 font-semibold">
											Mission
										</th>
										<th className="px-4 py-4 font-semibold">
											Last Active
										</th>
										<th className="rounded-r-2xl px-4 py-4 font-semibold" />
									</tr>
								</thead>

								<tbody>
									{filteredDrones.map((drone) => (
										<tr
											key={drone.id}
											className="border-b border-slate-100 last:border-b-0"
										>
											<td className="px-4 py-5">
												<div className="flex items-center gap-3">
													<div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-50 text-teal-600">
														<Plane size={19} />
													</div>

													<div>
														<p className="font-semibold text-slate-950">
															{drone.name}
														</p>
														<p className="mt-1 text-xs text-slate-400">
															{drone.model} ·{" "}
															{drone.serialNumber}
														</p>
													</div>
												</div>
											</td>

											<td className="px-4 py-5">
												<StatusBadge
													status={drone.status}
												/>
											</td>

											<td className="px-4 py-5">
												<BatteryBar
													value={drone.battery}
												/>
											</td>

											<td className="px-4 py-5 text-sm text-slate-600">
												{drone.sensor}
											</td>

											<td className="px-4 py-5 text-sm text-slate-600">
												{drone.mission}
											</td>

											<td className="px-4 py-5">
												<span className="inline-flex items-center gap-2 text-sm text-slate-500">
													<Clock size={15} />
													{drone.lastActive}
												</span>
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

							{filteredDrones.length === 0 && (
								<div className="py-12 text-center">
									<WifiOff
										className="mx-auto text-slate-300"
										size={42}
									/>
									<h4 className="mt-4 text-lg font-semibold text-slate-700">
										No drones found
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
									Fleet Health
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Battery distribution by drone group
								</p>
							</div>

							<div className="relative h-56">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={fleetHealthData}
											dataKey="value"
											nameKey="name"
											innerRadius={62}
											outerRadius={86}
											paddingAngle={4}
										>
											{fleetHealthData.map((entry) => (
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
										82%
									</h3>
									<p className="mt-1 text-sm text-slate-500">
										Avg battery
									</p>
								</div>
							</div>

							<div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
								{fleetHealthData.map((item) => (
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
											{item.name} {item.value}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
							<div className="mb-5">
								<h3 className="text-xl font-bold text-slate-950">
									Maintenance Queue
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Drones needing service or inspection
								</p>
							</div>

							<div className="flex flex-col gap-3">
								{maintenanceQueue.map((item) => (
									<div
										key={item.drone}
										className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
									>
										<div>
											<p className="font-semibold text-slate-950">
												{item.drone}
											</p>
											<p className="mt-1 text-sm text-slate-500">
												{item.issue}
											</p>
										</div>

										<PriorityBadge
											priority={item.priority}
										/>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-teal-100 bg-teal-50 p-6">
							<div className="flex gap-3">
								<div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500 text-white">
									<BatteryCharging size={20} />
								</div>

								<div>
									<h4 className="font-bold text-slate-950">
										Fleet recommendation
									</h4>
									<p className="mt-1 text-sm leading-6 text-slate-600">
										Schedule maintenance for drones below
										25% battery health and review offline
										drones before assigning new missions.
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
