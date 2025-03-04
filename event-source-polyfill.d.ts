declare module 'event-source-polyfill' {
	export interface EventSourcePolyfillInit {
		headers?: Record<string, string>;
		withCredentials?: boolean;
		heartbeatTimeout?: number;
		[key: string]: any;
	}

	export class EventSourcePolyfill implements EventSource {
		constructor(url: string, eventSourceInitDict?: EventSourcePolyfillInit);

		// Standard EventSource properties
		readonly CONNECTING: number;
		readonly OPEN: number;
		readonly CLOSED: number;
		readonly readyState: number;
		readonly url: string;
		readonly withCredentials: boolean;
		onopen: (event: Event) => void;
		onmessage: (event: MessageEvent) => void;
		onerror: (event: Event) => void;
		addEventListener(type: string, listener: EventListener): void;
		removeEventListener(type: string, listener: EventListener): void;
		dispatchEvent(event: Event): boolean;
		close(): void;
	}
}
