'use client';

import React, {createContext, useContext, ReactNode} from 'react';
import {useSseEvents} from '@/hooks/useSseEvents';
import {EmergencyInfo} from '@/types';

interface SseContextType {
	emergencies: EmergencyInfo[] | null;
	isConnected: boolean;
	error: Error | null;
}

const SseContext = createContext<SseContextType | undefined>(undefined);

export function SseProvider({children}: {children: ReactNode}) {
	const {data, isConnected, error} = useSseEvents<EmergencyInfo[]>({
		url: `${process.env.NEXT_PUBLIC_NOTIFICATION_BACKEND_URL}/operator-notification/emergencies-patients`,
	});

	return <SseContext.Provider value={{emergencies: data, isConnected, error}}>{children}</SseContext.Provider>;
}

export function useSseContext() {
	const context = useContext(SseContext);
	if (context === undefined) {
		throw new Error('useSseContext must be used within a SseProvider');
	}
	return context;
}
