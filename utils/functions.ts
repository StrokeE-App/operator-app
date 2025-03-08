export const formatDate = (date: Date | string | null | undefined) => {
	if (!date) return 'Ahorita';

	try {
		// Convert string to Date if it's a string
		const dateObj = typeof date === 'string' ? new Date(date) : date;

		// Check if dateObj is a valid date
		if (isNaN(dateObj.getTime())) {
			throw new Error('Invalid date');
		}

		return new Intl.DateTimeFormat('es-CO', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).format(dateObj);
	} catch (error) {
		console.error('Error formatting date:', error, 'Original value:', date);
		return 'Fecha desconocida';
	}
};
