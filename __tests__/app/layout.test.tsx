import {render} from '@testing-library/react';
import RootLayout from '@/app/layout';
import {AuthProvider} from '@/context/AuthContext';
import {SseProvider} from '@/context/SseContext';
import {AmbulancesProvider} from '@/contexts/AmbulancesContext';
import ServiceWorkerRegistration from '@/app/components/ServiceWorkerRegistration';
import {Toaster} from 'react-hot-toast';

// Mock the providers
jest.mock('@/context/AuthContext', () => ({
	AuthProvider: ({children}: {children: React.ReactNode}) => <div data-testid="auth-provider">{children}</div>,
}));

jest.mock('@/context/SseContext', () => ({
	SseProvider: ({children}: {children: React.ReactNode}) => <div data-testid="sse-provider">{children}</div>,
}));

jest.mock('@/contexts/AmbulancesContext', () => ({
	AmbulancesProvider: ({children}: {children: React.ReactNode}) => <div data-testid="ambulances-provider">{children}</div>,
}));

// Mock the service worker registration
jest.mock('@/app/components/ServiceWorkerRegistration', () => {
	return function MockServiceWorkerRegistration() {
		return <div data-testid="service-worker-registration" />;
	};
});

// Mock the toast component
jest.mock('react-hot-toast', () => ({
	Toaster: () => <div data-testid="toaster" />,
}));

// Mock the fonts
jest.mock('next/font/google', () => ({
	Geist: () => ({
		className: 'geist-font',
	}),
	Geist_Mono: () => ({
		className: 'geist-mono-font',
	}),
}));

describe('RootLayout', () => {
	it('should render with all required providers', () => {
		const {getByTestId} = render(
			<RootLayout>
				<div data-testid="test-child">Test Content</div>
			</RootLayout>
		);

		// Check if all providers are rendered
		expect(getByTestId('service-worker-registration')).toBeInTheDocument();
		expect(getByTestId('sse-provider')).toBeInTheDocument();
		expect(getByTestId('auth-provider')).toBeInTheDocument();
		expect(getByTestId('ambulances-provider')).toBeInTheDocument();
		expect(getByTestId('toaster')).toBeInTheDocument();
		expect(getByTestId('test-child')).toBeInTheDocument();
	});

	it('should render children within the provider hierarchy', () => {
		const {getByTestId} = render(
			<RootLayout>
				<div data-testid="test-child">Test Content</div>
			</RootLayout>
		);

		// Check if the child is rendered within the providers
		const ambulancesProvider = getByTestId('ambulances-provider');
		expect(ambulancesProvider).toContainElement(getByTestId('test-child'));
	});

	it('should have the correct HTML structure', () => {
		const {container} = render(
			<RootLayout>
				<div>Test Content</div>
			</RootLayout>
		);

		// Check if the HTML structure is correct
		expect(container.querySelector('html')).toHaveAttribute('lang', 'es');
		expect(container.querySelector('head')).toBeInTheDocument();
		expect(container.querySelector('body')).toHaveClass('antialiased', 'bg-customWhite');
	});

	it('should include required meta tags and icons', () => {
		const {container} = render(
			<RootLayout>
				<div>Test Content</div>
			</RootLayout>
		);

		// Check for required meta tags and icons
		const head = container.querySelector('head');
		expect(head).toContainElement(container.querySelector('link[rel="apple-touch-icon"][sizes="192x192"]'));
		expect(head).toContainElement(container.querySelector('link[rel="apple-touch-icon"][sizes="512x512"]'));
		expect(head).toContainElement(container.querySelector('meta[name="apple-mobile-web-app-capable"]'));
		expect(head).toContainElement(container.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]'));
		expect(head).toContainElement(container.querySelector('meta[name="theme-color"]'));
	});

	it('should render children within AuthProvider', () => {
		const {getByTestId} = render(
			<RootLayout>
				<div data-testid="test-child">Test Content</div>
			</RootLayout>
		);

		expect(getByTestId('auth-provider')).toBeInTheDocument();
		expect(getByTestId('test-child')).toBeInTheDocument();
	});

	it('should apply correct font classes', () => {
		const {container} = render(
			<RootLayout>
				<div>Test Content</div>
			</RootLayout>
		);

		expect(container.firstChild).toHaveClass('geist-font');
	});

	it('should include required metadata', () => {
		const metadata = RootLayout.metadata;

		expect(metadata).toBeDefined();
		expect(metadata.title).toBe('Strokee');
		expect(metadata.description).toBe('Strokee - Emergency Medical Services');
	});

	it('should maintain consistent layout structure', () => {
		const {container} = render(
			<RootLayout>
				<div>Test Content</div>
			</RootLayout>
		);

		// Check if the structure is correct
		expect(container.firstChild).toHaveClass('min-h-screen');
		expect(container.firstChild).toHaveClass('bg-white');
	});

	it('should handle multiple children correctly', () => {
		const {getAllByTestId} = render(
			<RootLayout>
				<div data-testid="child-1">First Child</div>
				<div data-testid="child-2">Second Child</div>
			</RootLayout>
		);

		expect(getAllByTestId(/child-/)).toHaveLength(2);
	});
});
