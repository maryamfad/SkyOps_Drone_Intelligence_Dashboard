import { useMemo, useState } from "react";
import {
	AlertTriangle,
	BatteryCharging,
	CheckCircle2,
	Drone,
	Flame,
	MapPin,
	Plane,
	Search,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/common/StatCard";
import AlertSeverity from "../components/AlertSeverity";
import MissionActivity from "../components/MissionActivity";
import MissionQueue from "../components/MissionQueue";

type MissionActivityData = {
	day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
	completed: number;
	active: number;
};
const missionActivityData: MissionActivityData[] = [
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

// const activeMissions = [
// 	{
// 		mission: "Wildfire Hotspot Scan",
// 		type: "Wildfire",
// 		drone: "SkyScout-01",
// 		risk: "Critical",
// 		status: "Active",
// 	},
// 	{
// 		mission: "Crop Health Survey",
// 		type: "Agriculture",
// 		drone: "AgroFlyer-02",
// 		risk: "Medium",
// 		status: "Active",
// 	},
// 	{
// 		mission: "Bridge Inspection",
// 		type: "Inspection",
// 		drone: "Inspecto-07",
// 		risk: "High",
// 		status: "Review",
// 	},
// 	{
// 		mission: "Rescue Zone Mapping",
// 		type: "Rescue",
// 		drone: "RescueEye-03",
// 		risk: "High",
// 		status: "Active",
// 	},
// ];

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

const statusFilters: Array<"All" | MissionStatus> = [
	"All",
	"Active",
	"Scheduled",
	"Review",
	"Completed",
];

export default function DashboardPage() {
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
					<MissionActivity
						missionActivityData={missionActivityData}
					/>
					<AlertSeverity alertSeverityData={alertSeverityData} />
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
				<section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
					<MissionQueue filteredMissions={filteredMissions} />
				</section>
			</main>
		</div>
	);
}
