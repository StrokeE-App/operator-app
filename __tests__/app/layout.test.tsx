import {render} from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock the AuthProvider
jest.mock('@/context/AuthContext', () => ({
	AuthProvider: ({children}: {children: React.ReactNode}) => <div data-testid="auth-provider">{children}</div>,
}));

describe('RootLayout', () => {
	it('matches snapshot', () => {
		const {container} = render(
			<RootLayout>
				<div data-testid="test-child">Test Content</div>
			</RootLayout>
		);
		expect(container).toMatchSnapshot();
	});
});
