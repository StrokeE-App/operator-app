'use client';

import React, {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {EmergencyInfo} from '@/types';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/Map'), {
	ssr: false,
});

// Components
import EmergencyInfoComponent from '@/components/EmergencyInfoComponent';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';

export default function EmergencyClientPage({params}: {params: Promise<{emergencyId: string}>}) {
	const {emergencyId} = React.use(params);
	const searchParams = useSearchParams();
	const [emergency, setEmergency] = useState<EmergencyInfo | null>(null);

	useEffect(() => {
		const emergencyDataString = searchParams.get('data');
		if (emergencyDataString) {
			try {
				const parsed = JSON.parse(decodeURIComponent(emergencyDataString));
				setEmergency(parsed);
			} catch (error) {
				console.error('Failed to parse emergency data:', error);
			}
		}
	}, [searchParams]);

	return (
		<div>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/dashboard">
					<ArrowBigLeft size={48} />
				</Link>
			</div>
			<EmergencyInfoComponent emergency={emergency} />
			<DynamicMap latitude={3.382325} longitude={-76.528043} />
			<ConfirmStrokeComponent emergencyId={emergencyId} />
		</div>
	);
}
