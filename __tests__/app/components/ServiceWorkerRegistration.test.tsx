import {render} from '@testing-library/react';
import ServiceWorkerRegistration from '@/app/components/ServiceWorkerRegistration';

describe('ServiceWorkerRegistration', () => {
	const mockRegister = jest.fn();
	const mockAddEventListener = jest.fn();
	const mockConsoleLog = jest.spyOn(console, 'log');
	const mockConsoleError = jest.spyOn(console, 'error');

	beforeEach(() => {
		jest.clearAllMocks();
		// Mock navigator.serviceWorker
		Object.defineProperty(window, 'navigator', {
			value: {
				serviceWorker: {
					register: mockRegister,
				},
			},
		});
		// Mock window.addEventListener
		Object.defineProperty(window, 'addEventListener', {
			value: mockAddEventListener,
		});
	});

	afterEach(() => {
		mockConsoleLog.mockRestore();
		mockConsoleError.mockRestore();
	});

	it('should not attempt registration when service worker is not supported', () => {
		// Mock navigator without serviceWorker
		Object.defineProperty(window, 'navigator', {
			value: {},
		});

		render(<ServiceWorkerRegistration />);

		// Verify that addEventListener was not called
		expect(mockAddEventListener).not.toHaveBeenCalled();
		// Verify that register was not called
		expect(mockRegister).not.toHaveBeenCalled();
	});

	it('should render nothing', () => {
		const {container} = render(<ServiceWorkerRegistration />);
		expect(container).toBeEmptyDOMElement();
	});
});
