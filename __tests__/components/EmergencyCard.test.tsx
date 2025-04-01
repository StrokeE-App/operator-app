import {render, screen, fireEvent} from '@testing-library/react';
import EmergencyCard from '@/components/EmergencyCard';
import {useRouter} from 'next/navigation';
import {EmergencyInfo} from '@/types/index';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

describe('EmergencyCard Component', () => {
	const mockRouter = {
		push: jest.fn(),
	};

	const mockEmergency: EmergencyInfo = {
		emergencyId: '123',
		patient: {
			firstName: 'John',
			lastName: 'Doe',
			age: 30,
			weight: 70,
			height: 170,
			phoneNumber: '1234567890',
		},
		startDate: new Date(),
		nihScale: 5,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders user information correctly', () => {
		render(<EmergencyCard userName="John Doe" userPhone="1234567890" emergencyId="123" emergency={mockEmergency} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('+57 1234567890')).toBeInTheDocument();
	});

	it('navigates to emergency page when clicked', () => {
		render(<EmergencyCard userName="John Doe" userPhone="1234567890" emergencyId="123" emergency={mockEmergency} />);

		const card = screen.getByText('John Doe').parentElement;
		fireEvent.click(card!);

		expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/emergency/123'));
	});

	it('applies correct styling', () => {
		render(<EmergencyCard userName="John Doe" userPhone="1234567890" emergencyId="123" emergency={mockEmergency} />);

		const container = screen.getByText('John Doe').parentElement;
		expect(container).toHaveClass('border-b');
		expect(container).toHaveClass('border-red-200');
		expect(container).toHaveClass('py-4');
		expect(container).toHaveClass('w-full');
		expect(container).toHaveClass('max-w-80');
		expect(container).toHaveClass('cursor-pointer');

		const userName = screen.getByText('John Doe');
		expect(userName).toHaveClass('text-customRed');
		expect(userName).toHaveClass('font-medium');
	});

	it('renders emergency information', () => {
		render(<EmergencyCard emergency={mockEmergency} userName="John Doe" userPhone="1234567890" emergencyId="123" />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('+57 1234567890')).toBeInTheDocument();
	});

	it('navigates to emergency details when clicked', () => {
		render(<EmergencyCard emergency={mockEmergency} userName="John Doe" userPhone="1234567890" emergencyId="123" />);

		fireEvent.click(screen.getByText('John Doe'));
		const expectedUrl = `/emergency/${mockEmergency.emergencyId}?data=${encodeURIComponent(JSON.stringify(mockEmergency))}`;
		expect(mockRouter.push).toHaveBeenCalledWith(expectedUrl);
	});
});
