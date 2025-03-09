'use client';

// Components
import EmergencyCard from '@/components/EmergencyCard';
import SettingsMenu from '@/components/SettingsMenu';

// Context
import {useSseContext} from '@/context/SseContext';

export default function Dashboard() {
	const {emergencies: data, isConnected, error} = useSseContext();

	console.log({data, isConnected, error});

	if (data === null) {
		return (
			<main className="min-h-screen bg-white p-4">
				{/* Header */}
				<SettingsMenu />

				{/* Main Content */}
				<div className="mt-12 px-4 flex flex-col items-center w-full">
					<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Emergencias a verificar</h1>
					<p className="text-gray-600">Cargando emergencias...</p>
					{/* <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-customRed"></div> */}
				</div>
			</main>
		);
	}

	if (data === undefined) {
		return (
			<main className="min-h-screen bg-white p-4">
				{/* Header */}
				<SettingsMenu />

				{/* Main Content */}
				<div className="mt-12 px-4 flex flex-col items-center w-full">
					<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Emergencias a verificar</h1>
					<p className="text-gray-600">No hay emergencias activas.</p>
					{/* <div className="animate-pulse rounded-full h-32 w-32 border-t-2 border-b-2 border-customRed"></div> */}
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-white p-4">
			{/* Header */}
			<SettingsMenu />

			{/* Main Content */}
			<div className="mt-12 px-4 flex flex-col items-center w-full">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Emergencias a verificar</h1>

				{/* Patient Information */}
				{data.map((emergency) => (
					<EmergencyCard
						key={emergency.emergencyId}
						userName={`${emergency.patient.firstName} ${emergency.patient.lastName}`}
						userPhone={emergency.patient.phoneNumber}
						emergencyId={emergency.emergencyId}
						emergency={emergency}
					/>
				))}
			</div>
		</main>
	);
}
