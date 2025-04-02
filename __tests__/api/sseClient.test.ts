import {createEventSource} from '@/api/sseClient';
import {getCookie} from '@/utils/cookies';
import {EventSourcePolyfill} from 'event-source-polyfill';

// Mock the cookies utility
jest.mock('@/utils/cookies', () => ({
	getCookie: jest.fn(),
}));

// Mock the EventSourcePolyfill
jest.mock('event-source-polyfill', () => ({
	EventSourcePolyfill: jest.fn().mockImplementation(() => ({
		onmessage: null,
		onerror: null,
		close: jest.fn(),
	})),
}));

describe('sseClient', () => {
	const mockUrl = 'https://example.com/events';
	let mockEventSource: Partial<EventSourcePolyfill>;

	beforeEach(() => {
		jest.clearAllMocks();
		mockEventSource = {
			onmessage: null,
			onerror: null,
			close: jest.fn(),
		};
		(EventSourcePolyfill as jest.Mock).mockReturnValue(mockEventSource);
	});

	it('should create an EventSource with correct URL', () => {
		createEventSource(mockUrl);

		expect(EventSourcePolyfill).toHaveBeenCalledWith(mockUrl, {
			headers: {
				Authorization: '',
			},
		});
	});

	it('should include auth token in headers when available', () => {
		const mockToken = 'test-token';
		(getCookie as jest.Mock).mockReturnValue(mockToken);

		createEventSource(mockUrl);

		expect(EventSourcePolyfill).toHaveBeenCalledWith(mockUrl, {
			headers: {
				Authorization: `Bearer ${mockToken}`,
			},
		});
	});

	it('should set up message handler', () => {
		createEventSource(mockUrl);

		expect(mockEventSource.onmessage).toBeDefined();
		expect(typeof mockEventSource.onmessage).toBe('function');
	});

	it('should set up error handler', () => {
		createEventSource(mockUrl);

		expect(mockEventSource.onerror).toBeDefined();
		expect(typeof mockEventSource.onerror).toBe('function');
	});

	it('should log messages when received', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
		createEventSource(mockUrl);

		// Simulate receiving a message
		mockEventSource.onmessage?.({
			data: 'test message',
		} as MessageEvent);

		expect(consoleSpy).toHaveBeenCalledWith('New message:', 'test message');
		consoleSpy.mockRestore();
	});

	it('should log errors when they occur', () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		createEventSource(mockUrl);

		// Simulate an error
		mockEventSource.onerror?.(new Error('Test error'));

		expect(consoleSpy).toHaveBeenCalledWith('SSE error:', expect.any(Error));
		consoleSpy.mockRestore();
	});

	it('should return the created EventSource instance', () => {
		const eventSource = createEventSource(mockUrl);

		expect(eventSource).toBe(mockEventSource);
	});
});
