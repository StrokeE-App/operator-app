'use client';

import React, {createContext, useContext, ReactNode} from 'react';
import {useSseEvents} from '@/hooks/useSseEvents';
import {EmergencyInfo} from '@/types';

interface SseContextType {
	emergencies: EmergencyInfo[] | null;
	isConnected: boolean;
	error: Error | null;
	connect: () => void;
	disconnect: () => void;
}

const SseContext = createContext<SseContextType | undefined>(undefined);

export function SseProvider({children}: {children: ReactNode}) {
	const {data, isConnected, error, connect, disconnect} = useSseEvents<EmergencyInfo[]>({
		url: `${process.env.NEXT_PUBLIC_NOTIFICATION_BACKEND_URL}/operator-notification/emergencies-patients`,
	});

	return <SseContext.Provider value={{emergencies: data, isConnected, error, connect, disconnect}}>{children}</SseContext.Provider>;
}

export function useSseContext() {
	const context = useContext(SseContext);
	if (context === undefined) {
		throw new Error('useSseContext must be used within a SseProvider');
	}
	return context;
}
