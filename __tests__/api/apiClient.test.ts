import axios from 'axios';
import apiClient from '@/api/apiClient';
import {getCookie} from '@/utils/cookies';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the cookies utility
jest.mock('@/utils/cookies', () => ({
	getCookie: jest.fn(),
}));

describe('apiClient', () => {
	const mockConfig = {
		headers: {},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		// Reset the axios instance
		(axios.create as jest.Mock).mockReturnValue({
			interceptors: {
				request: {use: jest.fn()},
				response: {use: jest.fn()},
			},
		});
	});

	it('should create an axios instance with correct base config', () => {
		expect(axios.create).toHaveBeenCalledWith({
			baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
			timeout: 10000,
		});
	});

	it('should set up request interceptor', () => {
		const mockToken = 'test-token';
		(getCookie as jest.Mock).mockReturnValue(mockToken);

		// Get the request interceptor
		const requestInterceptor = (axios.create as jest.Mock).mock.results[0].value.interceptors.request.use;
		const interceptorFn = requestInterceptor.mock.calls[0][0];

		// Call the interceptor
		const result = interceptorFn(mockConfig);

		expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
	});

	it('should not set auth header when no token is available', () => {
		(getCookie as jest.Mock).mockReturnValue(null);

		// Get the request interceptor
		const requestInterceptor = (axios.create as jest.Mock).mock.results[0].value.interceptors.request.use;
		const interceptorFn = requestInterceptor.mock.calls[0][0];

		// Call the interceptor
		const result = interceptorFn(mockConfig);

		expect(result.headers.Authorization).toBeUndefined();
	});

	it('should handle request interceptor errors', async () => {
		const mockError = new Error('Request error');
		(getCookie as jest.Mock).mockImplementation(() => {
			throw mockError;
		});

		// Get the request interceptor
		const requestInterceptor = (axios.create as jest.Mock).mock.results[0].value.interceptors.request.use;
		const interceptorFn = requestInterceptor.mock.calls[0][0];

		// Call the interceptor and expect it to reject
		await expect(interceptorFn(mockConfig)).rejects.toThrow(mockError);
	});

	it('should set up response interceptor', () => {
		// Get the response interceptor
		const responseInterceptor = (axios.create as jest.Mock).mock.results[0].value.interceptors.response.use;
		const successHandler = responseInterceptor.mock.calls[0][0];
		const errorHandler = responseInterceptor.mock.calls[0][1];

		// Test success handler
		const mockResponse = {data: {message: 'Success'}};
		expect(successHandler(mockResponse)).toBe(mockResponse);

		// Test error handler
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		const mockAxiosError = {
			isAxiosError: true,
			response: {data: {message: 'API Error'}},
			message: 'Network Error',
		};

		errorHandler(mockAxiosError);
		expect(consoleSpy).toHaveBeenCalledWith('Error: API Error');
		consoleSpy.mockRestore();
	});

	it('should handle non-axios errors in response interceptor', async () => {
		// Get the response interceptor
		const responseInterceptor = (axios.create as jest.Mock).mock.results[0].value.interceptors.response.use;
		const errorHandler = responseInterceptor.mock.calls[0][1];

		const mockError = new Error('Non-axios error');
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

		await expect(errorHandler(mockError)).rejects.toThrow(mockError);
		expect(consoleSpy).toHaveBeenCalledWith('Error: Non-axios error');
		consoleSpy.mockRestore();
	});

	it('should handle axios errors without response data', async () => {
		// Get the response interceptor
		const responseInterceptor = (axios.create as jest.Mock).mock.results[0].value.interceptors.response.use;
		const errorHandler = responseInterceptor.mock.calls[0][1];

		const mockAxiosError = {
			isAxiosError: true,
			message: 'Network Error',
		};

		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		await expect(errorHandler(mockAxiosError)).rejects.toThrow(mockAxiosError);
		expect(consoleSpy).toHaveBeenCalledWith('Error: Network Error');
		consoleSpy.mockRestore();
	});
});
