'use client';

import {EmergencyInfo} from '@/types';

type EmergencyInfoProps = {
	emergency: EmergencyInfo | null;
};

export default function EmergencyInfoComponent({emergency}: EmergencyInfoProps) {
	if (!emergency) {
		return (
			<>
				<p>Cargando...</p>
			</>
		);
	}

	const readableStartDate = emergency.startDate ? emergency.startDate.toLocaleString() : 'Ahorita';
	const {firstName, lastName, phoneNumber, age, weight, height} = emergency.patient;
	return (
		<div className="w-11/12 mx-auto p-6 ">
			<div className="text-center space-y-6">
				<div className="pb-4">
					<h1 className="text-2xl font-bold inline-block px-4 pb-1">
						{firstName} {lastName}
					</h1>
				</div>

				<div className="grid grid-cols-2 gap-x-6 gap-y-6">
					<div>
						<h2 className="text-custom-black font-bold text-sm">Teléfono</h2>
						<p className="text-custom-black font-medium">{phoneNumber}</p>
					</div>
					<div>
						<h2 className="text-custom-black text-sm font-bold">Edad</h2>
						<p className="text-custom-black font-medium">{age} años</p>
					</div>
					<div>
						<h2 className="text-custom-black text-sm font-bold">Peso</h2>
						<p className="text-custom-black font-medium">{weight} kg</p>
					</div>
					<div>
						<h2 className="text-custom-black text-sm font-bold">Estatura</h2>
						<p className="text-custom-black font-medium">{height} m</p>
					</div>
					<div>
						<h2 className="text-custom-black text-sm font-bold">Nivel De Stroke</h2>
						<p className="text-custom-black font-medium">{emergency.nihScale ? emergency.nihScale : '...'}</p>
					</div>
					<div>
						<h2 className="text-custom-black text-sm font-bold whitespace-wrap">Tiempo desde que inició la emergencia</h2>
						<p className="text-custom-black font-medium">{readableStartDate}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
