import {render, screen, fireEvent} from '@testing-library/react';
import Button from '@/components/Button';

describe('Button', () => {
	const mockOnClick = jest.fn();

	beforeEach(() => {
		mockOnClick.mockClear();
	});

	it('renders with default props', () => {
		render(<Button onClick={mockOnClick} title="Click me" color="green" />);
		const button = screen.getByText('Click me');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('bg-customGreen', 'text-customBlack');
	});

	it('calls onClick when clicked', () => {
		render(<Button onClick={mockOnClick} title="Click me" color="green" />);
		fireEvent.click(screen.getByText('Click me'));
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('is disabled when disabled prop is true', () => {
		render(<Button onClick={mockOnClick} title="Click me" color="green" disabled />);
		const button = screen.getByText('Click me');
		expect(button).toBeDisabled();
		fireEvent.click(button);
		expect(mockOnClick).not.toHaveBeenCalled();
	});
});
