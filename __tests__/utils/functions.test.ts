import {formatDate} from '@/utils/functions';

describe('functions utils', () => {
	describe('formatDate', () => {
		it('returns "Ahorita" when date is null', () => {
			expect(formatDate(null)).toBe('Ahorita');
		});

		it('returns "Ahorita" when date is undefined', () => {
			expect(formatDate(undefined)).toBe('Ahorita');
		});

		it('formats Date object correctly', () => {
			const date = new Date('2024-03-24T12:00:00');
			const formatted = formatDate(date);
			expect(formatted).toMatch(/24 de mar de 2024/);
			expect(formatted).toMatch(/12:00:00/);
		});

		it('formats date string correctly', () => {
			const dateString = '2024-03-24T12:00:00';
			const formatted = formatDate(dateString);
			expect(formatted).toMatch(/24 de mar de 2024/);
			expect(formatted).toMatch(/12:00:00/);
		});

		it('returns "Fecha desconocida" for invalid date string', () => {
			expect(formatDate('invalid-date')).toBe('Fecha desconocida');
		});

		it('returns "Fecha desconocida" for invalid Date object', () => {
			const invalidDate = new Date('invalid');
			expect(formatDate(invalidDate)).toBe('Fecha desconocida');
		});

		it('handles different date formats', () => {
			const date1 = new Date('2024-03-24T12:00:00');
			const date2 = new Date('2024-12-31T23:59:59');
			const date3 = new Date('2024-01-01T00:00:00');

			expect(formatDate(date1)).toMatch(/24 de mar de 2024/);
			expect(formatDate(date2)).toMatch(/31 de dic de 2024/);
			expect(formatDate(date3)).toMatch(/1 de ene de 2024/);
		});

		it('includes all required date components', () => {
			const date = new Date('2024-03-24T12:00:00');
			const formatted = formatDate(date);
			expect(formatted).toMatch(/\d{1,2}/); // day
			expect(formatted).toMatch(/[a-z]{3}/); // month
			expect(formatted).toMatch(/\d{4}/); // year
			expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/); // time
		});
	});
});
