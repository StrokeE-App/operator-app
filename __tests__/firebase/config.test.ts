import {initializeApp, getAuth} from 'firebase/app';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {SignIn, SignOut} from '@/firebase/config';

// Mock Firebase
jest.mock('firebase/app', () => ({
	initializeApp: jest.fn(),
	getAuth: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
	signInWithEmailAndPassword: jest.fn(),
}));

describe('Firebase config', () => {
	const mockUser = {
		getIdToken: jest.fn(),
	};

	const mockUserCredential = {
		user: mockUser,
	};

	const mockAuth = {
		signOut: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(initializeApp as jest.Mock).mockReturnValue({});
		(getAuth as jest.Mock).mockReturnValue(mockAuth);
		(signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
		mockUser.getIdToken.mockResolvedValue('mock-token');
	});

	describe('SignIn', () => {
		const mockEmail = 'test@example.com';
		const mockPassword = 'password123';

		it('should sign in successfully', async () => {
			global.fetch = jest.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve({}),
			});

			const user = await SignIn(mockEmail, mockPassword);

			expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, mockEmail, mockPassword);
			expect(mockUser.getIdToken).toHaveBeenCalled();
			expect(global.fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-app-identifier': 'operators',
				},
				body: JSON.stringify({token: 'mock-token'}),
			});
			expect(document.cookie).toContain('authToken=mock-token');
			expect(user).toBe(mockUser);
		});

		it('should handle backend error', async () => {
			const errorMessage = 'Invalid token';
			global.fetch = jest.fn().mockResolvedValue({
				ok: false,
				json: () => Promise.resolve({message: errorMessage}),
			});

			await expect(SignIn(mockEmail, mockPassword)).rejects.toThrow(errorMessage);
			expect(mockAuth.signOut).toHaveBeenCalled();
		});

		it('should handle Firebase credential errors', async () => {
			const firebaseError = new Error('Invalid credentials');
			(firebaseError as any).code = 'auth/invalid-credential';
			(signInWithEmailAndPassword as jest.Mock).mockRejectedValue(firebaseError);

			await expect(SignIn(mockEmail, mockPassword)).rejects.toThrow('Usuario o contraseña incorrecta.');
		});

		it('should handle user not found error', async () => {
			const firebaseError = new Error('User not found');
			(firebaseError as any).code = 'auth/user-not-found';
			(signInWithEmailAndPassword as jest.Mock).mockRejectedValue(firebaseError);

			await expect(SignIn(mockEmail, mockPassword)).rejects.toThrow('Usuario o contraseña incorrecta.');
		});

		it('should handle other Firebase errors', async () => {
			const firebaseError = new Error('Other error');
			(signInWithEmailAndPassword as jest.Mock).mockRejectedValue(firebaseError);

			await expect(SignIn(mockEmail, mockPassword)).rejects.toThrow('Other error');
		});
	});

	describe('SignOut', () => {
		it('should sign out successfully', async () => {
			await SignOut();

			expect(mockAuth.signOut).toHaveBeenCalled();
			expect(document.cookie).toContain('authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT');
		});

		it('should handle sign out errors', async () => {
			const error = new Error('Sign out failed');
			mockAuth.signOut.mockRejectedValue(error);

			await expect(SignOut()).rejects.toThrow(error);
		});
	});
});
