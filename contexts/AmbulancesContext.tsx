'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';
import apiClient from '@/api/apiClient';
import {Ambulance as AmbulanceType} from '@/types/ambulance';

interface AmbulancesResponse {
	message: string;
	ambulances: {
		ambulanceId: string;
	}[];
}

interface AmbulancesContextType {
	ambulances: AmbulanceType[];
	isLoading: boolean;
	error: string | null;
}

const AmbulancesContext = createContext<AmbulancesContextType | undefined>(undefined);

export function AmbulancesProvider({children}: {children: React.ReactNode}) {
	const [ambulances, setAmbulances] = useState<AmbulanceType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAmbulances = async () => {
			try {
				const response = await apiClient.get<AmbulancesResponse>('/ambulance/all');
				// Transform the response data to match the expected Ambulance type
				const transformedAmbulances: AmbulanceType[] = response.data.ambulances.map((amb) => ({
					id: amb.ambulanceId,
					name: `Ambulancia ${amb.ambulanceId}`, // Using ambulanceId as name since it's not provided in the response
				}));
				setAmbulances(transformedAmbulances);
			} catch (err) {
				setError('Error fetching ambulances');
				console.error('Error fetching ambulances:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAmbulances();
	}, []);

	return <AmbulancesContext.Provider value={{ambulances, isLoading, error}}>{children}</AmbulancesContext.Provider>;
}

export function useAmbulances() {
	const context = useContext(AmbulancesContext);
	if (context === undefined) {
		throw new Error('useAmbulances must be used within an AmbulancesProvider');
	}
	return context;
}
