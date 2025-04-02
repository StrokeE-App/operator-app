import {render, screen, fireEvent} from '@testing-library/react';
import ConfirmModal from '@/components/ConfirmModal';

describe('ConfirmModal', () => {
	const mockOnClose = jest.fn();
	const mockOnConfirm = jest.fn();
	const mockAmbulances = [
		{id: '1', name: 'Ambulance 1'},
		{id: '2', name: 'Ambulance 2'},
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('does not render when isOpen is false', () => {
		render(<ConfirmModal isOpen={false} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders modal with title when isOpen is true', () => {
		render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" />);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Test Modal')).toBeInTheDocument();
	});

	it('renders ambulance dropdown when showDropdown is true', () => {
		render(
			<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" showDropdown={true} ambulances={mockAmbulances} />
		);

		expect(screen.getByText('Seleccionar ambulancia')).toBeInTheDocument();
		expect(screen.getByText('Ambulance 1')).toBeInTheDocument();
		expect(screen.getByText('Ambulance 2')).toBeInTheDocument();
	});

	it('calls onConfirm with selected ambulance when confirming', () => {
		render(
			<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" showDropdown={true} ambulances={mockAmbulances} />
		);

		// Select an ambulance
		const select = screen.getByRole('combobox');
		fireEvent.change(select, {target: {value: '1'}});

		// Click confirm button
		fireEvent.click(screen.getByText(/confirmar/i));

		expect(mockOnConfirm).toHaveBeenCalledWith('1');
	});

	it('calls onConfirm with empty string when no dropdown is shown', () => {
		render(<ConfirmModal isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} title="Test Modal" />);

		fireEvent.click(screen.getByText(/confirmar/i));
		expect(mockOnConfirm).toHaveBeenCalledWith('');
	});
});
