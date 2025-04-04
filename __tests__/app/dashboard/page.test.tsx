import {render, screen} from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';
import {useSseContext} from '@/context/SseContext';

// Mock the components
jest.mock('@/components/EmergencyCard', () => {
	return function MockEmergencyCard({userName}: {userName: string}) {
		return <div data-testid="emergency-card">{userName}</div>;
	};
});

jest.mock('@/components/SettingsMenu', () => {
	return function MockSettingsMenu() {
		return <div data-testid="settings-menu">Settings Menu</div>;
	};
});

// Mock the SSE context
jest.mock('@/context/SseContext', () => ({
	useSseContext: jest.fn(),
}));

describe('Dashboard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should show "No hay emergencias activas." when data is null', () => {
		(useSseContext as jest.Mock).mockReturnValue({
			data: null,
			isConnected: false,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);

		expect(screen.getByTestId('settings-menu')).toBeInTheDocument();
		expect(screen.getByText('Emergencias a verificar')).toBeInTheDocument();
		expect(screen.getByText('No hay emergencias activas.')).toBeInTheDocument();
	});

	it('should show empty state when data is undefined', () => {
		(useSseContext as jest.Mock).mockReturnValue({
			data: undefined,
			isConnected: true,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);

		expect(screen.getByTestId('settings-menu')).toBeInTheDocument();
		expect(screen.getByText('Emergencias a verificar')).toBeInTheDocument();
		expect(screen.getByText('No hay emergencias activas.')).toBeInTheDocument();
	});

	it('should render emergency cards when data is available', () => {
		const mockEmergencies = [
			{
				emergencyId: '1',
				patient: {
					firstName: 'John',
					lastName: 'Doe',
					phoneNumber: '1234567890',
				},
			},
			{
				emergencyId: '2',
				patient: {
					firstName: 'Jane',
					lastName: 'Smith',
					phoneNumber: '0987654321',
				},
			},
		];

		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: mockEmergencies,
			isConnected: true,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);

		expect(screen.getByText('Emergencias a verificar')).toBeInTheDocument();

		const emergencyCards = screen.getAllByTestId('emergency-card');
		expect(emergencyCards).toHaveLength(2);
		expect(emergencyCards[0]).toHaveTextContent('John Doe');
		expect(emergencyCards[1]).toHaveTextContent('Jane Smith');
	});

	it('should handle SSE connection error', () => {
		const mockError = new Error('Connection failed');
		(useSseContext as jest.Mock).mockReturnValue({
			emergencies: null,
			isConnected: false,
			error: mockError,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});

		render(<Dashboard />);

		expect(screen.getByTestId('settings-menu')).toBeInTheDocument();
		expect(screen.getByText('Emergencias a verificar')).toBeInTheDocument();
		expect(screen.getByText('Cargando emergencias...')).toBeInTheDocument();
	});

	it('should maintain consistent layout across all states', () => {
		const {rerender} = render(<Dashboard />);

		// Check initial loading state
		expect(screen.getByTestId('settings-menu')).toBeInTheDocument();
		expect(screen.getByText('Emergencias a verificar')).toBeInTheDocument();

		// Update to empty state
		(useSseContext as jest.Mock).mockReturnValue({
			data: undefined,
			isConnected: true,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});
		rerender(<Dashboard />);

		expect(screen.getByTestId('settings-menu')).toBeInTheDocument();
		expect(screen.getByText('Emergencias a verificar')).toBeInTheDocument();

		// Update to data state
		(useSseContext as jest.Mock).mockReturnValue({
			data: [
				{
					emergencyId: '1',
					patient: {
						firstName: 'John',
						lastName: 'Doe',
						phoneNumber: '1234567890',
					},
				},
			],
			isConnected: true,
			error: null,
			connect: jest.fn(),
			disconnect: jest.fn(),
		});
		rerender(<Dashboard />);

		expect(screen.getByTestId('settings-menu')).toBeInTheDocument();
		expect(screen.getByText('Emergencias a verificar')).toBeInTheDocument();
	});
});
