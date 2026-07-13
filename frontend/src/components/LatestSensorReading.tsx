import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
const LatestSensorReading = () => {
	const sensorReadings = [
		{ label: "Temperature", value: "68°C", status: "Critical" },
		{ label: "Smoke Level", value: "High", status: "Critical" },
		{ label: "Altitude", value: "120 m", status: "Normal" },
		{ label: "Speed", value: "38 km/h", status: "Normal" },
		{ label: "Thermal Anomaly", value: "91%", status: "Critical" },
	];

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

	return (
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
	);
};

export default LatestSensorReading;
