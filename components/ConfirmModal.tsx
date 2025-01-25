'use client';

import {useEffect, useState} from 'react';
import {Ambulance} from '@/types/ambulance';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (selectedAmbulance?: string) => void;
	title: string;
	showDropdown?: boolean;
	ambulances?: Ambulance[];
}

export default function ConfirmModal({isOpen, onClose, onConfirm, title, showDropdown, ambulances}: ConfirmModalProps) {
	const [selectedAmbulance, setSelectedAmbulance] = useState('');

	// Handle the escape key to close the modal
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

			{/* Modal */}
			<div className="relative bg-white rounded-lg w-[90%] max-w-sm p-6 shadow-lg" role="dialog" aria-modal="true">
				<div className="text-center space-y-6">
					<h2 className="text-lg font-medium">{title}</h2>

					{showDropdown && ambulances && (
						<select className="w-full p-2 mb-4 border rounded" value={selectedAmbulance} onChange={(e) => setSelectedAmbulance(e.target.value)}>
							<option value="">Seleccionar ambulancia</option>
							{ambulances.map((amb) => (
								<option key={amb.id} value={amb.id}>
									{amb.name}
								</option>
							))}
						</select>
					)}

					<div className="flex gap-4 justify-center">
						<button
							onClick={() => onConfirm(selectedAmbulance)}
							className="px-8 py-2 rounded-md bg-customGreen text-customBlack font-bold hover:bg-green-200 transition-colors disabled:bg-gray-50 "
							disabled={showDropdown && !selectedAmbulance}
						>
							Confirmar
						</button>
						<button onClick={onClose} className="px-8 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition-colors">
							Cancelar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
