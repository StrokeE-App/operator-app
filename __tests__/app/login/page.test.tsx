import {render, screen} from '@testing-library/react';
import Login from '@/app/login/page';
import {useAuth} from '@/context/AuthContext';
import {useRouter} from 'next/navigation';
import {StrokeeLogo} from '@/components/StrokeeLogo';
import {LoginForm} from '@/components/LoginForm';

// Mock the components
jest.mock('@/components/StrokeeLogo', () => {
	return function MockStrokeeLogo() {
		return <div data-testid="strokee-logo">Strokee Logo</div>;
	};
});

jest.mock('@/components/LoginForm', () => {
	return function MockLoginForm() {
		return <div data-testid="login-form">Login Form</div>;
	};
});

// Mock the hooks
jest.mock('@/context/AuthContext', () => ({
	useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));

describe('Login', () => {
	const mockRouter = {
		push: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	it('should render loading spinner when loading', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: false,
			isLoading: true,
		});

		render(<Login />);

		expect(screen.getByTestId('strokee-logo')).toBeInTheDocument();
		expect(screen.getByRole('status')).toBeInTheDocument();
		expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
	});

	it('should render login form when not loading', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
		});

		render(<Login />);

		expect(screen.getByTestId('strokee-logo')).toBeInTheDocument();
		expect(screen.getByTestId('login-form')).toBeInTheDocument();
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});

	it('should redirect to dashboard when authenticated', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
		});

		render(<Login />);

		expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
	});

	it('should not redirect when loading', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: true,
			isLoading: true,
		});

		render(<Login />);

		expect(mockRouter.push).not.toHaveBeenCalled();
	});

	it('should not redirect when not authenticated', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
		});

		render(<Login />);

		expect(mockRouter.push).not.toHaveBeenCalled();
	});

	it('should maintain consistent layout', () => {
		(useAuth as jest.Mock).mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
		});

		const {container} = render(<Login />);

		// Check if the main container has the correct classes
		expect(container.querySelector('main')).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-center', 'p-8', 'gap-8');
	});
});
