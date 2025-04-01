import {render, screen, waitFor} from '@testing-library/react';
import EmergencyClientPage from '@/app/emergency/[emergencyId]/page';
import {useSseContext} from '@/context/SseContext';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import EmergencyInfoComponent from '@/components/EmergencyInfoComponent';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';
import toast from 'react-hot-toast';

// Mock the components
jest.mock('@/components/EmergencyInfoComponent', () => {
	return function MockEmergencyInfoComponent({emergency}: {emergency: any}) {
		return <div data-testid="emergency-info">{emergency.emergencyId}</div>;
	};
});

jest.mock('@/components/ConfirmStrokeComponent', () => {
	return function MockConfirmStrokeComponent({emergencyId}: {emergencyId: string}) {
		return <div data-testid="confirm-stroke">{emergencyId}</div>;
	};
});

jest.mock('@/components/Map', () => {
	return function MockMap() {
		return <div data-testid="map">Map Component</div>;
	};
});

// Mock the hooks
jest.mock('@/context/SseContext', () => ({
	useSseContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useSearchParams: jest.fn(),
}));

jest.mock('next/link', () => {
	return function MockLink({children}: {children: React.ReactNode}) {
		return <div data-testid="back-link">{children}</div>;
	};
});

jest.mock('react-hot-toast', () => ({
	default: {
		error: jest.fn(),
	},
}));

describe('EmergencyClientPage', () => {
	const mockEmergency = {
		emergencyId: '123',
		patient: {
			firstName: 'John',
			lastName: 'Doe',
			age: 30,
			phoneNumber: '1234567890',
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn(),
		});
	});

	it('should show loading state initially', () => {
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: null,
		});

		render(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);

		expect(screen.getByText('Cargando...')).toBeInTheDocument();
	});

	it('should show error when emergency is not found', async () => {
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: [],
		});

		render(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);

		await waitFor(() => {
			expect(screen.getByText('Emergencia no encontrada.')).toBeInTheDocument();
			expect(toast.error).toHaveBeenCalledWith('La emergencia no se encuentra disponible en el sistema');
		});
	});

	it('should render emergency info when found in context', async () => {
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: [mockEmergency],
		});

		render(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);

		await waitFor(() => {
			expect(screen.getByTestId('emergency-info')).toBeInTheDocument();
			expect(screen.getByTestId('map')).toBeInTheDocument();
			expect(screen.getByTestId('confirm-stroke')).toBeInTheDocument();
		});
	});

	it('should render emergency info from URL params when available', async () => {
		const emergencyDataString = encodeURIComponent(JSON.stringify(mockEmergency));
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn().mockReturnValue(emergencyDataString),
		});

		render(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);

		await waitFor(() => {
			expect(screen.getByTestId('emergency-info')).toBeInTheDocument();
			expect(screen.getByTestId('map')).toBeInTheDocument();
			expect(screen.getByTestId('confirm-stroke')).toBeInTheDocument();
		});
	});

	it('should handle invalid URL params data', async () => {
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn().mockReturnValue('invalid-json'),
		});

		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: [mockEmergency],
		});

		render(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);

		await waitFor(() => {
			expect(screen.getByTestId('emergency-info')).toBeInTheDocument();
		});
	});

	it('should render back link to dashboard', () => {
		render(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);

		expect(screen.getByTestId('back-link')).toBeInTheDocument();
	});

	it('should maintain consistent layout', () => {
		const {container} = render(<EmergencyClientPage params={Promise.resolve({emergencyId: '123'})} />);

		// Check if the main container has the correct classes
		expect(container.querySelector('div')).toHaveClass('text-customRed', 'mt-4', 'ml-4');
	});
});
