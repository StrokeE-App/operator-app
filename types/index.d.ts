export type EmergencyPatient = {
	firstName: string;
	lastName: string;
	age: number;
	address?: string;
	weight: number;
	height: number;
	phoneNumber: string;
};

export type EmergencyInfo = {
	emergencyId: string;
	patient: EmergencyPatient;
	startDate: Date;
	nihScale?: number;
	latitude?: number;
	longitude?: number;
	// emergencyLocation: {latitude: double; longitude: double};
};
