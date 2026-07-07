import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import DronesPage from "./pages/DronesPage";
import MissionsPage from "./pages/MissionsPage";
import AlertsPage from "./pages/AlertsPage";
import MapViewPage from "./pages/MapViewPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/drones" element={<DronesPage />} />
				<Route path="/missions" element={<MissionsPage />} />
				<Route path="/alerts" element={<AlertsPage />} />
				<Route path="/map" element={<MapViewPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
