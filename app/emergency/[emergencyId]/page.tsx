'use client';

import React, {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
// import dynamic from 'next/dynamic';
import {ArrowBigLeft} from 'lucide-react';

// Types
import {EmergencyInfo} from '@/types';

// Context
import {useSseContext} from '@/context/SseContext';

// const DynamicMap = dynamic(() => import('@/components/Map'), {
// 	ssr: false,
// });

// Components
import EmergencyInfoComponent from '@/components/EmergencyInfoComponent';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';
import toast from 'react-hot-toast';

export default function EmergencyClientPage({params}: {params: Promise<{emergencyId: string}>}) {
	const {emergencyId} = React.use(params); // Get emergencyId from URL
	const searchParams = useSearchParams(); // Get URL search params
	const [emergency, setEmergency] = useState<EmergencyInfo | null>(null); // State for emergency data
	const {emergencies} = useSseContext(); // Get emergencies from global context
	const [error, setError] = useState<Error | null>(null); // State for error handling

	// Fetch emergency data from search params, context or API
	useEffect(() => {
		const fetchEmergencyData = async () => {
			const emergencyDataString = searchParams.get('data');
			if (emergencyDataString) {
				try {
					const parsed = JSON.parse(decodeURIComponent(emergencyDataString));
					setEmergency(parsed);
				} catch (error) {
					console.error('Failed to parse emergency data:', error);
					findEmergencyInContext();
				}
			} else {
				findEmergencyInContext();
			}
		};

		const findEmergencyInContext = async () => {
			// Only try to find the emergency in the global context
			if (emergencies) {
				const foundEmergency = emergencies.find((e) => e.emergencyId === emergencyId);
				if (foundEmergency) {
					setEmergency(foundEmergency);
					return;
				} else {
					toast.error('La emergencia no se encuentra disponible en el sistema');
					setError(new Error('Emergencia no encontrada.'));
					console.log('Emergency not found in context:', emergencyId);
				}
			}
		};

		fetchEmergencyData();
	}, [searchParams, emergencyId, emergencies]);

	return (
		<div>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/dashboard">
					<ArrowBigLeft size={48} />
				</Link>
			</div>

			{error && (
				<>
					<div className="w-11/12 mx-auto p-6 ">
						<div className="text-center space-y-6">
							<div className="pb-4">
								<h1 className="text-2xl font-bold inline-block px-4 pb-1">{error.message}</h1>
							</div>
						</div>
					</div>
				</>
			)}

			{!emergency && !error && (
				<>
					<div className="w-11/12 mx-auto p-6 ">
						<div className="text-center space-y-6">
							<div className="pb-4">
								<h1 className="text-2xl font-bold inline-block px-4 pb-1">Cargando...</h1>
							</div>
						</div>
					</div>
				</>
			)}

			{emergency && (
				<>
					{' '}
					<EmergencyInfoComponent emergency={emergency} />
					{/* <DynamicMap latitude={3.382325} longitude={-76.528043} /> */}
					<ConfirmStrokeComponent emergencyId={emergencyId} />
				</>
			)}
		</div>
	);
}
