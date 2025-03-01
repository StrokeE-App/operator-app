'use client';

import React, {useState} from 'react';

// Components
import Button from './Button';
import ConfirmModal from './ConfirmModal';

// Mocks
import {mockAmbulances} from '../mocks/ambulances';

export type ConfirmStrokeComponentProps = {
	emergencyId: string;
};

export default function ConfirmStrokeComponent({emergencyId}: ConfirmStrokeComponentProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [actionType, setActionType] = useState('');

  // Handle the confirm or discard action from the modal
	const handleConfirm = (selectedAmbulance?: string) => {
		if (actionType === 'confirm') {
			console.log(`Emergency ${emergencyId} confirmed with ambulance ${selectedAmbulance}`);
		} else if (actionType === 'discard') {
			console.log(`Emergency ${emergencyId} discarded`);
		}
		setIsModalOpen(false);
	};

  // Open the modal with the title and action type
	const openModal = (title: string, action: string) => {
		setModalTitle(title); // 
		setActionType(action);
		setIsModalOpen(true);
	};

	return (
		<div className="w-10/12 max-w-md mx-auto flex flex-col space-y-4 mb-5">
			<Button title="Confirmar Stroke" onClick={() => openModal('Asigna una ambulancia a la emergencia', 'confirm')} color="red" />
			<Button title="Descartar Stroke" onClick={() => openModal('¿Estás seguro que quieres descartar el stroke?', 'discard')} color="green" />
			<ConfirmModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={handleConfirm}
				title={modalTitle}
				showDropdown={actionType === 'confirm'}
				ambulances={mockAmbulances}
			/>
		</div>
	);
}
