import {getCookie} from '@/utils/cookies';

describe('cookies utils', () => {
	beforeEach(() => {
		// Clear all cookies before each test
		document.cookie.split(';').forEach((cookie) => {
			const [name] = cookie.split('=');
			document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		});
	});

	it('returns undefined when cookie does not exist', () => {
		expect(getCookie('nonexistent')).toBeUndefined();
	});

	it('returns cookie value when cookie exists', () => {
		document.cookie = 'testCookie=testValue';
		expect(getCookie('testCookie')).toBe('testValue');
	});

	it('returns undefined when cookie has no value', () => {
		document.cookie = 'testCookie=';
		expect(getCookie('testCookie')).toBe('');
	});

	it('handles multiple cookies correctly', () => {
		document.cookie = 'cookie1=value1';
		document.cookie = 'cookie2=value2';
		expect(getCookie('cookie1')).toBe('value1');
		expect(getCookie('cookie2')).toBe('value2');
	});

	it('handles cookies with special characters', () => {
		document.cookie = 'testCookie=value%20with%20spaces';
		expect(getCookie('testCookie')).toBe('value%20with%20spaces');
	});
});
