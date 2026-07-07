import { NavLink } from "react-router-dom";
import {
	AlertTriangle,
	Drone,
	LayoutDashboard,
	Map,
	MapPin,
	Plane,
} from "lucide-react";

type NavItem = {
	label: string;
	path: string;
	icon: React.ElementType;
};

const navItems: NavItem[] = [
	{
		label: "Dashboard",
		path: "/",
		icon: LayoutDashboard,
	},
	{
		label: "Drones",
		path: "/drones",
		icon: Drone,
	},
	{
		label: "Missions",
		path: "/missions",
		icon: MapPin,
	},
	{
		label: "Alerts",
		path: "/alerts",
		icon: AlertTriangle,
	},
	{
		label: "Map View",
		path: "/map",
		icon: Map,
	},
];

export default function Sidebar() {
	return (
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
				{navItems.map((item) => {
					const Icon = item.icon;

					return (
						<NavLink
							key={item.path}
							to={item.path}
							end={item.path === "/"}
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
									isActive
										? "border-l-4 border-teal-400 bg-slate-800 text-white"
										: "text-slate-400 hover:bg-slate-800 hover:text-white"
								}`
							}
						>
							<Icon size={18} />
							{item.label}
						</NavLink>
					);
				})}
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
	);
}
