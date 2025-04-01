import {render, screen} from '@testing-library/react';
import {StrokeeLogo} from '@/components/StrokeeLogo';

describe('StrokeeLogo', () => {
	it('renders the logo text', () => {
		render(<StrokeeLogo />);
		expect(screen.getByText('STROKEE')).toBeInTheDocument();
	});

	it('renders with correct styling', () => {
		render(<StrokeeLogo />);
		const logo = screen.getByText('STROKEE');
		expect(logo).toHaveClass('text-red-600', 'text-2xl', 'font-bold', 'tracking-wider');
	});

	it('renders in a flex column container', () => {
		render(<StrokeeLogo />);
		const container = screen.getByText('STROKEE').parentElement;
		expect(container).toHaveClass('flex');
		expect(container).toHaveClass('flex-col');
		expect(container).toHaveClass('items-center');
		expect(container).toHaveClass('gap-2');
	});
});
