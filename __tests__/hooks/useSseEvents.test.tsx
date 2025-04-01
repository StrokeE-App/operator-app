import {renderHook, act} from '@testing-library/react';
import {useSseEvents} from '@/hooks/useSseEvents';
import {createEventSource} from '@/api/sseClient';
import {EventSourcePolyfill} from 'event-source-polyfill';

// Mock the dependencies
jest.mock('@/api/sseClient', () => ({
	createEventSource: jest.fn(),
}));

describe('useSseEvents', () => {
	const mockUrl = 'http://test.com/events';
	const mockEventSource = {
		onmessage: null as ((event: MessageEvent) => void) | null,
		onopen: null as (() => void) | null,
		onerror: null as ((error: Event) => void) | null,
		close: jest.fn(),
	} as unknown as EventSourcePolyfill;

	beforeEach(() => {
		jest.clearAllMocks();
		(createEventSource as jest.Mock).mockReturnValue(mockEventSource);
	});

	it('initializes with default values', () => {
		const {result} = renderHook(() => useSseEvents({url: mockUrl}));

		expect(result.current.data).toBeNull();
		expect(result.current.isConnected).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('connects automatically when initialConnect is true', () => {
		renderHook(() => useSseEvents({url: mockUrl}));

		expect(createEventSource).toHaveBeenCalledWith(mockUrl);
	});

	it('does not connect automatically when initialConnect is false', () => {
		renderHook(() => useSseEvents({url: mockUrl, initialConnect: false}));

		expect(createEventSource).not.toHaveBeenCalled();
	});

	it('handles successful connection', () => {
		const {result} = renderHook(() => useSseEvents({url: mockUrl}));

		act(() => {
			if (mockEventSource.onopen) {
				mockEventSource.onopen();
			}
		});

		expect(result.current.isConnected).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it('handles incoming messages', () => {
		const {result} = renderHook(() => useSseEvents({url: mockUrl}));

		const mockData = {test: 'data'};
		act(() => {
			mockEventSource.onmessage?.({
				data: JSON.stringify({data: mockData}),
			} as MessageEvent);
		});

		expect(result.current.data).toEqual(mockData);
	});

	it('handles connection errors', () => {
		const {result} = renderHook(() => useSseEvents({url: mockUrl}));

		act(() => {
			mockEventSource.onerror?.(new Event('error'));
		});

		expect(result.current.isConnected).toBe(false);
		expect(result.current.error).toBeInstanceOf(Error);
	});

	it('handles message parsing errors', () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		const {result} = renderHook(() => useSseEvents({url: mockUrl}));

		act(() => {
			mockEventSource.onmessage?.({
				data: 'invalid json',
			} as MessageEvent);
		});

		expect(result.current.data).toBeNull();
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it('disconnects on unmount', () => {
		const {unmount} = renderHook(() => useSseEvents({url: mockUrl}));

		unmount();

		expect(mockEventSource.close).toHaveBeenCalled();
	});

	it('manually connects and disconnects', () => {
		const {result} = renderHook(() => useSseEvents({url: mockUrl, initialConnect: false}));

		act(() => {
			result.current.connect();
		});

		expect(createEventSource).toHaveBeenCalledWith(mockUrl);

		act(() => {
			result.current.disconnect();
		});

		expect(mockEventSource.close).toHaveBeenCalled();
	});

	it('does not create multiple connections', () => {
		const {result} = renderHook(() => useSseEvents({url: mockUrl}));

		act(() => {
			result.current.connect();
		});

		expect(createEventSource).toHaveBeenCalledTimes(1);
	});
});
