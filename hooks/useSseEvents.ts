import {useState, useEffect, useRef} from 'react';
import {createEventSource} from '@/api/sseClient';
import {EventSourcePolyfill} from 'event-source-polyfill';

interface UseSseEventsOptions {
	url: string;
	initialConnect?: boolean;
}

export function useSseEvents<T = any>({url, initialConnect = true}: UseSseEventsOptions) {
	const [data, setData] = useState<T | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

	const connect = () => {
		if (eventSourceRef.current) return;

		try {
			const eventSource = createEventSource(url);

			// Override the default onmessage handler
			eventSource.onmessage = (event) => {
				try {
					const parsedData = JSON.parse(event.data);
					setData(parsedData.data);
				} catch (err) {
					console.error('Error parsing SSE data:', err);
				}
			};

			eventSource.onopen = () => {
				setIsConnected(true);
				setError(null);
			};

			eventSource.onerror = (err) => {
				setError(err instanceof Error ? err : new Error('SSE connection error'));
				setIsConnected(false);
			};

			eventSourceRef.current = eventSource;
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to create SSE connection'));
		}
	};

	const disconnect = () => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
			setIsConnected(false);
		}
	};

	useEffect(() => {
		if (initialConnect) {
			connect();
		}

		// Cleanup on unmount
		return () => {
			disconnect();
		};
	}, [url]);

	return {
		data,
		isConnected,
		error,
		connect,
		disconnect,
	};
}
