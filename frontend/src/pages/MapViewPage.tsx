import { useMemo, useState } from "react";
import {
	AlertTriangle,
	CheckCircle2,
	MapPin,
	Navigation,
	Plane,
	Radio,
	Route,
	Search,
	Signal,
} from "lucide-react";
import {
	Circle,
	MapContainer,
	Marker,
	Popup,
	Polyline,
	TileLayer,
} from "react-leaflet";
import L, { type LatLngExpression, type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/common/StatCard";

type DroneStatus = "Active" | "Returning" | "Idle" | "Warning";
type AlertSeverity = "Critical" | "High" | "Medium" | "Low";
type ZoneType = "Wildfire" | "Agriculture" | "Inspection" | "Rescue";

type DroneMarker = {
	id: number;
	name: string;
	mission: string;
	status: DroneStatus;
	battery: number;
	signal: number;
	location: string;
	position: LatLngTuple;
};

type MissionZone = {
	id: number;
	name: string;
	type: ZoneType;
	location: string;
	status: "Active" | "Monitoring" | "Review";
	center: LatLngTuple;
	radius: number;
};

type MapAlert = {
	id: number;
	title: string;
	location: string;
	severity: AlertSeverity;
	drone: string;
	position: LatLngTuple;
	timestamp: string;
};

type RouteItem = {
	id: number;
	name: string;
	drone: string;
	distance: string;
	progress: number;
	path: LatLngTuple[];
	color: string;
	colorClass: string;
};

type StatusBadgeProps = {
	status: DroneStatus | MissionZone["status"];
};

type SeverityBadgeProps = {
	severity: AlertSeverity;
};

type ProgressBarProps = {
	value: number;
	colorClass: string;
};

const mapCenter: LatLngExpression = [44.05, -79.1];

const drones: DroneMarker[] = [
	{
		id: 1,
		name: "SkyScout-01",
		mission: "Wildfire Hotspot Scan",
		status: "Warning",
		battery: 76,
		signal: 98,
		location: "Kelowna, BC",
		position: [49.888, -119.496],
	},
	{
		id: 2,
		name: "AgroFlyer-02",
		mission: "Crop Health Survey",
		status: "Active",
		battery: 94,
		signal: 97,
		location: "Guelph, ON",
		position: [43.5448, -80.2482],
	},
	{
		id: 3,
		name: "RescueEye-03",
		mission: "Rescue Zone Mapping",
		status: "Active",
		battery: 63,
		signal: 95,
		location: "North Vancouver, BC",
		position: [49.3206, -123.0739],
	},
	{
		id: 4,
		name: "Inspecto-07",
		mission: "Bridge Inspection",
		status: "Returning",
		battery: 41,
		signal: 91,
		location: "Waterloo, ON",
		position: [43.4643, -80.5204],
	},
];

const missionZones: MissionZone[] = [
	{
		id: 1,
		name: "Wildfire Zone A",
		type: "Wildfire",
		location: "Kelowna, BC",
		status: "Active",
		center: [49.895, -119.49],
		radius: 3500,
	},
	{
		id: 2,
		name: "Agriculture Field B",
		type: "Agriculture",
		location: "Guelph, ON",
		status: "Monitoring",
		center: [43.53, -80.22],
		radius: 2800,
	},
	{
		id: 3,
		name: "Inspection Sector C",
		type: "Inspection",
		location: "Waterloo, ON",
		status: "Review",
		center: [43.466, -80.52],
		radius: 2200,
	},
	{
		id: 4,
		name: "Rescue Sector D",
		type: "Rescue",
		location: "North Vancouver, BC",
		status: "Active",
		center: [49.32, -123.07],
		radius: 2600,
	},
];

const mapAlerts: MapAlert[] = [
	{
		id: 1,
		title: "Thermal anomaly",
		location: "Kelowna wildfire zone",
		severity: "Critical",
		drone: "SkyScout-01",
		position: [49.902, -119.47],
		timestamp: "2 min ago",
	},
	{
		id: 2,
		title: "Low battery warning",
		location: "Rescue route north",
		severity: "High",
		drone: "RescueEye-03",
		position: [49.335, -123.055],
		timestamp: "5 min ago",
	},
	{
		id: 3,
		title: "Signal drift",
		location: "Bridge inspection area",
		severity: "Medium",
		drone: "Inspecto-07",
		position: [43.475, -80.51],
		timestamp: "11 min ago",
	},
];

const routes: RouteItem[] = [
	{
		id: 1,
		name: "Wildfire Scan Route",
		drone: "SkyScout-01",
		distance: "8.4 km",
		progress: 82,
		color: "#ef4444",
		colorClass: "bg-red-500",
		path: [
			[49.875, -119.52],
			[49.888, -119.496],
			[49.902, -119.47],
			[49.915, -119.45],
		],
	},
	{
		id: 2,
		name: "Crop Survey Route",
		drone: "AgroFlyer-02",
		distance: "5.7 km",
		progress: 58,
		color: "#14b8a6",
		colorClass: "bg-teal-500",
		path: [
			[43.515, -80.275],
			[43.53, -80.245],
			[43.5448, -80.2482],
			[43.56, -80.21],
		],
	},
	{
		id: 3,
		name: "Rescue Mapping Route",
		drone: "RescueEye-03",
		distance: "4.1 km",
		progress: 41,
		color: "#3b82f6",
		colorClass: "bg-blue-500",
		path: [
			[49.305, -123.09],
			[49.3206, -123.0739],
			[49.335, -123.055],
			[49.348, -123.035],
		],
	},
];

const zoneFilters: Array<"All" | ZoneType> = [
	"All",
	"Wildfire",
	"Agriculture",
	"Inspection",
	"Rescue",
];

function createDroneIcon(status: DroneStatus) {
	const colors: Record<DroneStatus, string> = {
		Active: "#14b8a6",
		Returning: "#f59e0b",
		Idle: "#64748b",
		Warning: "#ef4444",
	};

	return L.divIcon({
		className: "",
		html: `
      <div style="
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        background: ${colors[status]};
        border: 4px solid white;
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.3);
        display: grid;
        place-items: center;
        color: white;
        font-weight: 800;
        font-size: 15px;
      ">
        ✈
      </div>
    `,
		iconSize: [38, 38],
		iconAnchor: [19, 19],
		popupAnchor: [0, -18],
	});
}

function createAlertIcon(severity: AlertSeverity) {
	const colors: Record<AlertSeverity, string> = {
		Critical: "#ef4444",
		High: "#f59e0b",
		Medium: "#3b82f6",
		Low: "#14b8a6",
	};

	return L.divIcon({
		className: "",
		html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 9999px;
        background: ${colors[severity]};
        border: 4px solid white;
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.28);
        display: grid;
        place-items: center;
        color: white;
        font-weight: 900;
        font-size: 18px;
      ">
        !
      </div>
    `,
		iconSize: [34, 34],
		iconAnchor: [17, 17],
		popupAnchor: [0, -16],
	});
}

function getZoneStyle(type: ZoneType) {
	const styles: Record<
		ZoneType,
		{
			color: string;
			fillColor: string;
			fillOpacity: number;
		}
	> = {
		Wildfire: {
			color: "#ef4444",
			fillColor: "#fecaca",
			fillOpacity: 0.35,
		},
		Agriculture: {
			color: "#14b8a6",
			fillColor: "#99f6e4",
			fillOpacity: 0.35,
		},
		Inspection: {
			color: "#3b82f6",
			fillColor: "#bfdbfe",
			fillOpacity: 0.35,
		},
		Rescue: {
			color: "#f59e0b",
			fillColor: "#fde68a",
			fillOpacity: 0.35,
		},
	};

	return styles[type];
}

function StatusBadge({ status }: StatusBadgeProps) {
	const classes: Record<string, string> = {
		Active: "bg-emerald-100 text-emerald-700",
		Returning: "bg-amber-100 text-amber-700",
		Idle: "bg-slate-100 text-slate-600",
		Warning: "bg-red-100 text-red-700",
		Monitoring: "bg-blue-100 text-blue-700",
		Review: "bg-amber-100 text-amber-700",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}
		>
			{status}
		</span>
	);
}

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

function ProgressBar({ value, colorClass }: ProgressBarProps) {
	return (
		<div>
			<div className="mb-2 flex items-center justify-between text-sm">
				<span className="font-semibold text-slate-700">Progress</span>
				<span className="font-bold text-slate-500">{value}%</span>
			</div>

			<div className="h-2 overflow-hidden rounded-full bg-slate-200">
				<div
					className={`h-full rounded-full ${colorClass}`}
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	);
}

export default function MapViewPage() {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedZone, setSelectedZone] = useState<"All" | ZoneType>("All");

	const filteredDrones = useMemo<DroneMarker[]>(() => {
		return drones.filter((drone) => {
			const searchValue = searchTerm.toLowerCase();

			return (
				drone.name.toLowerCase().includes(searchValue) ||
				drone.mission.toLowerCase().includes(searchValue) ||
				drone.location.toLowerCase().includes(searchValue)
			);
		});
	}, [searchTerm]);

	const filteredZones = useMemo<MissionZone[]>(() => {
		return missionZones.filter((zone) => {
			return selectedZone === "All" || zone.type === selectedZone;
		});
	}, [selectedZone]);

	const filteredRoutes = useMemo<RouteItem[]>(() => {
		const visibleDroneNames = new Set(
			filteredDrones.map((drone) => drone.name),
		);

		return routes.filter((route) => visibleDroneNames.has(route.drone));
	}, [filteredDrones]);

	const criticalAlerts = mapAlerts.filter(
		(alert) => alert.severity === "Critical",
	).length;

	const averageSignal = Math.round(
		drones.reduce((sum, drone) => sum + drone.signal, 0) / drones.length,
	);

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
							Map View
						</h2>

						<p className="mt-2 max-w-3xl text-slate-500">
							Track drone locations, mission zones, route paths,
							and operational alerts using a real interactive
							Leaflet map.
						</p>
					</div>

					<div className="flex gap-3">
						<button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
							<Signal size={17} />
							Live mode
						</button>

						<button className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600">
							Export
						</button>
					</div>
				</header>

				<section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						title="Active Drones"
						value={String(drones.length)}
						subtitle="2 high-priority routes"
						icon={Navigation}
						color="teal"
					/>

					<StatCard
						title="Mission Zones"
						value={String(missionZones.length)}
						subtitle="3 zones monitored"
						icon={MapPin}
						color="blue"
					/>

					<StatCard
						title="Critical Markers"
						value={String(criticalAlerts)}
						subtitle="Needs operator review"
						icon={AlertTriangle}
						color="red"
					/>

					<StatCard
						title="Avg Signal"
						value={`${averageSignal}%`}
						subtitle="Healthy telemetry"
						icon={Radio}
						color="orange"
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
								placeholder="Search by drone, mission, or location..."
								className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{zoneFilters.map((zone) => (
								<button
									key={zone}
									onClick={() => setSelectedZone(zone)}
									className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
										selectedZone === zone
											? "border-teal-500 bg-teal-500 text-white"
											: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
									}`}
								>
									{zone}
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
									Operations Map
								</h3>

								<p className="mt-1 text-sm text-slate-500">
									Interactive map with OpenStreetMap tiles,
									drone markers, mission zones, alert markers,
									and route paths.
								</p>
							</div>

							<p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
								{filteredDrones.length} drones visible
							</p>
						</div>

						<div className="h-[620px] overflow-hidden rounded-3xl border border-slate-300">
							<MapContainer
								center={mapCenter}
								zoom={5}
								scrollWheelZoom
								className="h-full w-full"
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>

								{filteredZones.map((zone) => {
									const style = getZoneStyle(zone.type);

									return (
										<Circle
											key={zone.id}
											center={zone.center}
											radius={zone.radius}
											pathOptions={{
												color: style.color,
												fillColor: style.fillColor,
												fillOpacity: style.fillOpacity,
											}}
										>
											<Popup>
												<div>
													<strong>{zone.name}</strong>
													<br />
													{zone.location}
													<br />
													Type: {zone.type}
													<br />
													Status: {zone.status}
												</div>
											</Popup>
										</Circle>
									);
								})}

								{filteredRoutes.map((route) => (
									<Polyline
										key={route.id}
										positions={route.path}
										pathOptions={{
											color: route.color,
											weight: 4,
											opacity: 0.85,
											dashArray: "8 8",
										}}
									>
										<Popup>
											<div>
												<strong>{route.name}</strong>
												<br />
												Drone: {route.drone}
												<br />
												Distance: {route.distance}
												<br />
												Progress: {route.progress}%
											</div>
										</Popup>
									</Polyline>
								))}

								{filteredDrones.map((drone) => (
									<Marker
										key={drone.id}
										position={drone.position}
										icon={createDroneIcon(drone.status)}
									>
										<Popup>
											<div>
												<strong>{drone.name}</strong>
												<br />
												Mission: {drone.mission}
												<br />
												Location: {drone.location}
												<br />
												Status: {drone.status}
												<br />
												Battery: {drone.battery}%
												<br />
												Signal: {drone.signal}%
											</div>
										</Popup>
									</Marker>
								))}

								{mapAlerts.map((alert) => (
									<Marker
										key={alert.id}
										position={alert.position}
										icon={createAlertIcon(alert.severity)}
									>
										<Popup>
											<div>
												<strong>{alert.title}</strong>
												<br />
												Severity: {alert.severity}
												<br />
												Drone: {alert.drone}
												<br />
												Location: {alert.location}
												<br />
												Time: {alert.timestamp}
											</div>
										</Popup>
									</Marker>
								))}
							</MapContainer>
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
							<div className="mb-5">
								<h3 className="text-xl font-bold text-slate-950">
									Live Drones
								</h3>

								<p className="mt-1 text-sm text-slate-500">
									Current positions and telemetry status
								</p>
							</div>

							<div className="flex flex-col gap-3">
								{filteredDrones.map((drone) => (
									<div
										key={drone.id}
										className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
									>
										<div className="flex items-center gap-3">
											<div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-500 text-white">
												<Navigation size={17} />
											</div>

											<div>
												<p className="font-semibold text-slate-950">
													{drone.name}
												</p>

												<p className="mt-1 text-xs text-slate-500">
													{drone.mission}
												</p>
											</div>
										</div>

										<div className="text-right">
											<p className="text-sm font-bold text-slate-700">
												{drone.battery}%
											</p>

											<p className="mt-1 text-xs text-slate-400">
												{drone.signal}% signal
											</p>
										</div>
									</div>
								))}

								{filteredDrones.length === 0 && (
									<div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
										<p className="font-semibold text-slate-700">
											No drones found
										</p>

										<p className="mt-1 text-sm text-slate-400">
											Try changing your search.
										</p>
									</div>
								)}
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
							<div className="mb-5">
								<h3 className="text-xl font-bold text-slate-950">
									Route Summary
								</h3>

								<p className="mt-1 text-sm text-slate-500">
									Distance and progress by mission
								</p>
							</div>

							<div className="flex flex-col gap-5">
								{filteredRoutes.map((route) => (
									<div key={route.id}>
										<div className="mb-3 flex items-start justify-between">
											<div>
												<p className="font-semibold text-slate-950">
													{route.name}
												</p>

												<p className="mt-1 text-xs text-slate-500">
													{route.drone}
												</p>
											</div>

											<span className="text-sm font-bold text-slate-500">
												{route.distance}
											</span>
										</div>

										<ProgressBar
											value={route.progress}
											colorClass={route.colorClass}
										/>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
							<div className="mb-5">
								<h3 className="text-xl font-bold text-slate-950">
									Map Alerts
								</h3>

								<p className="mt-1 text-sm text-slate-500">
									Geographic alerts needing review
								</p>
							</div>

							<div className="flex flex-col gap-3">
								{mapAlerts.map((alert) => (
									<div
										key={alert.id}
										className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
									>
										<div>
											<p className="font-semibold text-slate-950">
												{alert.title}
											</p>

											<p className="mt-1 text-sm text-slate-500">
												{alert.location}
											</p>

											<p className="mt-1 text-xs text-slate-400">
												{alert.drone} ·{" "}
												{alert.timestamp}
											</p>
										</div>

										<SeverityBadge
											severity={alert.severity}
										/>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-teal-100 bg-teal-50 p-6">
							<div className="flex gap-3">
								<div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500 text-white">
									<Route size={20} />
								</div>

								<div>
									<h4 className="font-bold text-slate-950">
										Map recommendation
									</h4>

									<p className="mt-1 text-sm leading-6 text-slate-600">
										Prioritize drones inside critical zones
										and review alerts before assigning new
										routes to active missions.
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-xl font-bold text-slate-950">
										Zone Coverage
									</h3>

									<p className="mt-1 text-sm text-slate-500">
										Active area monitoring
									</p>
								</div>

								<div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
									<CheckCircle2 size={22} />
								</div>
							</div>

							<div className="mt-5">
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="font-semibold text-slate-700">
										Coverage rate
									</span>

									<span className="font-bold text-teal-600">
										87%
									</span>
								</div>

								<div className="h-3 overflow-hidden rounded-full bg-slate-200">
									<div className="h-full w-[87%] rounded-full bg-teal-500" />
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
