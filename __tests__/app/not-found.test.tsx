import {render, screen} from '@testing-library/react';
import Custom404 from '@/app/not-found';
import {StrokeeLogo} from '@/components/StrokeeLogo';
import Link from 'next/link';

// Mock the components
jest.mock('@/components/StrokeeLogo', () => {
	return function MockStrokeeLogo() {
		return <div data-testid="strokee-logo">Strokee Logo</div>;
	};
});

jest.mock('next/link', () => {
	return function MockLink({children, href}: {children: React.ReactNode; href: string}) {
		return (
			<div data-testid="login-link" data-href={href}>
				{children}
			</div>
		);
	};
});

describe('Custom404', () => {
	it('should render all required elements', () => {
		render(<Custom404 />);

		expect(screen.getByTestId('strokee-logo')).toBeInTheDocument();
		expect(screen.getByText('Oops')).toBeInTheDocument();
		expect(screen.getByText('404 - No fue posible encontrar esta pagina :(')).toBeInTheDocument();
		expect(screen.getByText('Regresa al Login para continuar navegando:')).toBeInTheDocument();
		expect(screen.getByTestId('login-link')).toBeInTheDocument();
	});

	it('should have correct styling classes', () => {
		const {container} = render(<Custom404 />);

		// Check main container
		expect(container.querySelector('div')).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'h-screen');

		// Check heading styles
		expect(screen.getByText('Oops')).toHaveClass('text-customRed', 'text-4xl', 'font-bold');
		expect(screen.getByText('404 - No fue posible encontrar esta pagina :(')).toHaveClass('text-customRed', 'text-2xl', 'font-bold');
		expect(screen.getByText('Regresa al Login para continuar navegando:')).toHaveClass('text-customRed');
	});

	it('should have correct link to login page', () => {
		render(<Custom404 />);

		const loginLink = screen.getByTestId('login-link');
		expect(loginLink).toHaveAttribute('data-href', '/login');
		expect(loginLink).toHaveTextContent('Login');
	});

	it('should maintain consistent layout', () => {
		const {container} = render(<Custom404 />);

		// Check if elements are in the correct order
		const elements = container.querySelectorAll('div > *');
		expect(elements[0]).toHaveAttribute('data-testid', 'strokee-logo');
		expect(elements[1]).toBeEmptyDOMElement(); // <br />
		expect(elements[2]).toHaveTextContent('Oops');
		expect(elements[3]).toHaveTextContent('404 - No fue posible encontrar esta pagina :(');
		expect(elements[4]).toContainElement(screen.getByTestId('login-link'));
	});
});
