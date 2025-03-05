import {useRouter} from 'next/navigation';

// Types
import { EmergencyInfo } from '@/types';

interface EmergencyCardProps {
	userName: string;
	userPhone: string;
	emergencyId: string;
	emergency: EmergencyInfo; // Replace 'any' with the proper type if available
}

export default function EmergencyCard({userName, userPhone, emergencyId, emergency}: EmergencyCardProps) {
	const router = useRouter();

	const handleClick = () => {
		const serialized = encodeURIComponent(JSON.stringify(emergency));
		router.push(`/emergency/${emergencyId}?data=${serialized}`);
	};

	return (
		<>
			<div onClick={handleClick} className="border-b border-red-200 py-4 w-full max-w-80 cursor-pointer">
				<p className="text-center text-customRed font-medium">{userName}</p>
				<p className="text-center text-customRed">+57 {userPhone}</p>
			</div>
		</>
	);
}
