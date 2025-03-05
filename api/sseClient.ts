import {getCookie} from '@/utils/cookies';
import {EventSourcePolyfill} from 'event-source-polyfill';

export function createEventSource(url: string): EventSourcePolyfill {
	const token = getCookie('authToken');

	const eventSource = new EventSourcePolyfill(url, {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	});

	eventSource.onmessage = (event) => {
		console.log('New message:', event.data);
	};

	eventSource.onerror = (error) => {
		console.error('SSE error:', error);
		// Optionally close connection on error:
		// eventSource.close();
	};

	return eventSource;
}
