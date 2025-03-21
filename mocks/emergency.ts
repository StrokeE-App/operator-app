import {EmergencyInfo} from '@/types';

const emergency1: EmergencyInfo = {
	emergencyId: '123',
	startDate: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
	patient: {
		firstName: 'Juan',
		lastName: 'Perez',
		age: 30,
		address: 'Calle 123',
		weight: 77.5,
		height: 170.5,
		phoneNumber: '1234567890',
	},
};

const emergency2: EmergencyInfo = {
	emergencyId: '456',
	startDate: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
	patient: {
		firstName: 'María',
		lastName: 'López',
		age: 45,
		address: 'Carrera 45 #67-89',
		weight: 65.2,
		height: 165.0,
		phoneNumber: '3209876543',
	},
};

const emergency3: EmergencyInfo = {
	emergencyId: '789',
	startDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
	patient: {
		firstName: 'Carlos',
		lastName: 'Rodríguez',
		age: 52,
		address: 'Avenida 78 #12-34',
		weight: 82.3,
		height: 178.0,
		phoneNumber: '3115554433',
	},
};

const emergenciesList: EmergencyInfo[] = [emergency1, emergency2, emergency3];

export {emergency1, emergency2, emergency3, emergenciesList};
