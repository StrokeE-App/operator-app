import {NextResponse} from 'next/server';
import {middleware} from '@/middleware';
import type {NextRequest} from 'next/server';

// Mock NextResponse
jest.mock('next/server', () => ({
	NextResponse: {
		redirect: jest.fn(),
		next: jest.fn(),
	},
}));

describe('middleware', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should redirect to login when no token is present', async () => {
		const request = {
			cookies: {
				get: jest.fn().mockReturnValue(null),
			},
			url: 'http://localhost:3000/dashboard',
		} as unknown as NextRequest;

		const response = await middleware(request);

		expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', request.url));
		expect(response).toBe(NextResponse.redirect());
	});

	it('should proceed with request when token is present', async () => {
		const mockToken = {value: 'test-token'};
		const request = {
			cookies: {
				get: jest.fn().mockReturnValue(mockToken),
			},
			url: 'http://localhost:3000/dashboard',
		} as unknown as NextRequest;

		const response = await middleware(request);

		expect(NextResponse.next).toHaveBeenCalledWith({
			headers: {
				Authorization: `Bearer ${mockToken.value}`,
			},
		});
		expect(response).toBe(NextResponse.next());
	});

	it('should redirect to login when an error occurs', async () => {
		const mockToken = {value: 'test-token'};
		const request = {
			cookies: {
				get: jest.fn().mockImplementation(() => {
					throw new Error('Test error');
				}),
			},
			url: 'http://localhost:3000/dashboard',
		} as unknown as NextRequest;

		const response = await middleware(request);

		expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', request.url));
		expect(response).toBe(NextResponse.redirect());
	});

	it('should handle protected routes correctly', async () => {
		const protectedRoutes = ['/dashboard', '/patients', '/test', '/emergency/123'];

		for (const route of protectedRoutes) {
			const request = {
				cookies: {
					get: jest.fn().mockReturnValue(null),
				},
				url: `http://localhost:3000${route}`,
			} as unknown as NextRequest;

			const response = await middleware(request);

			expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', request.url));
			expect(response).toBe(NextResponse.redirect());
		}
	});
});
