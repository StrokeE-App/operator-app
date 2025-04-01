import {render, screen} from '@testing-library/react';
import SettingsMenu from '@/components/SettingsMenu';
import {useAuth} from '@/context/AuthContext';

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
	useAuth: jest.fn(),
}));

describe('SettingsMenu', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the menu button', () => {
		(useAuth as jest.Mock).mockReturnValue({
			SignOut: jest.fn(),
		});

		render(<SettingsMenu />);

		expect(screen.getByRole('button')).toBeInTheDocument();
		expect(screen.getByRole('button')).toHaveClass('text-customRed');
	});

	it('should render the menu items when clicked', () => {
		(useAuth as jest.Mock).mockReturnValue({
			SignOut: jest.fn(),
		});

		render(<SettingsMenu />);

		const button = screen.getByRole('button');
		button.click();

		expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
	});

	it('should maintain consistent styling', () => {
		(useAuth as jest.Mock).mockReturnValue({
			SignOut: jest.fn(),
		});

		const {container} = render(<SettingsMenu />);

		// Check if the container has the correct classes
		expect(container.firstChild).toHaveClass('flex', 'items-center', 'gap-2', 'text-customRed', 'cursor-pointer', 'z-20');
	});
});
