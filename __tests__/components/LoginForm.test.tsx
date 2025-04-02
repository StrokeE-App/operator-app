import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {LoginForm} from '@/components/LoginForm';
import {SignIn} from '@/firebase/config';

// Mock modules
jest.mock('@/firebase/config', () => ({
	SignIn: jest.fn(),
}));

// Create mock functions that we can reference in our tests
const mockToastFns = {
	loading: jest.fn().mockReturnValue('loading-toast-id'),
	success: jest.fn(),
	error: jest.fn(),
};

type ToastArgs = [message: string, options?: {id?: string}];

// Mock react-hot-toast
jest.mock('react-hot-toast', () => {
	return {
		__esModule: true,
		default: {
			loading: (...args: ToastArgs) => mockToastFns.loading(...args),
			success: (...args: ToastArgs) => mockToastFns.success(...args),
			error: (...args: ToastArgs) => mockToastFns.error(...args),
		},
	};
});

describe('LoginForm', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders login form with email and password inputs', () => {
		render(<LoginForm />);

		expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
	});

	it('handles successful login', async () => {
		// Mock SignIn to resolve successfully
		(SignIn as jest.Mock).mockResolvedValueOnce(undefined);

		render(<LoginForm />);

		// Fill in the form
		fireEvent.change(screen.getByPlaceholderText('Correo'), {
			target: {value: 'test@example.com'},
		});
		fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
			target: {value: 'password123'},
		});

		// Submit the form
		fireEvent.click(screen.getByRole('button', {name: /iniciar sesión/i}));

		// Verify loading state
		expect(mockToastFns.loading).toHaveBeenCalledWith('Iniciando sesión...');

		// Wait for the success toast
		await waitFor(() => {
			expect(mockToastFns.success).toHaveBeenCalledWith('¡Bienvenido!', {id: 'loading-toast-id'});
		});
	});

	it('handles login error', async () => {
		const errorMessage = 'Invalid credentials';
		// Mock SignIn to reject with an error
		(SignIn as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

		render(<LoginForm />);

		// Fill in the form
		fireEvent.change(screen.getByPlaceholderText('Correo'), {
			target: {value: 'test@example.com'},
		});
		fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
			target: {value: 'wrongpassword'},
		});

		// Submit the form
		fireEvent.click(screen.getByRole('button', {name: /iniciar sesión/i}));

		// Wait for the error toast
		await waitFor(() => {
			expect(mockToastFns.error).toHaveBeenCalledWith(errorMessage, {id: 'loading-toast-id'});
		});
	});
});
