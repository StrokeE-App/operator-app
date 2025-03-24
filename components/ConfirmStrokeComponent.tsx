'use client';

import React, {useState} from 'react';

// Components
import Button from './Button';
import ConfirmModal from './ConfirmModal';

// Mocks
import {mockAmbulances} from '../mocks/ambulances';
import apiClient from '@/api/apiClient';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {AxiosError} from 'axios';

export type ConfirmStrokeComponentProps = {
	emergencyId: string;
};

export default function ConfirmStrokeComponent({emergencyId}: ConfirmStrokeComponentProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [actionType, setActionType] = useState('');

	const router = useRouter();

	// Handle the confirm or discard action from the modal, and call the API
	const handleConfirm = async (selectedAmbulance?: string) => {
		const loadingToast = toast.loading('Cargando...');
		if (actionType === 'confirm') {
			try {
				await apiClient.post('/operator/assign-ambulance', {
					emergencyId,
					ambulanceId: selectedAmbulance,
				});

				toast.success('Emergencia confirmada exitosamente', {id: loadingToast});
				router.push('/dashboard');
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data.message, {id: loadingToast});
				} else {
					toast.error('Error al confirmar la emergencia', {id: loadingToast});
				}
				console.error('Error confirming emergency:', error);
			}
		} else if (actionType === 'discard') {
			try {
				await apiClient.post('/operator/cancel-emergency', {
					emergencyId,
				});

				toast.success('Emergencia descartada exitosamente', {id: loadingToast});
				router.push('/dashboard');
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data.message, {id: loadingToast});
				} else {
					toast.error('Error al descartar la emergencia', {id: loadingToast});
				}
				console.error('Error discarding emergency:', error);
			}
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
