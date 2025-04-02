import {render} from '@testing-library/react';
import Custom404 from '@/app/not-found';

// Mock the StrokeeLogo component
jest.mock('@/components/StrokeeLogo', () => ({
	StrokeeLogo: () => <div data-testid="strokee-logo">Strokee Logo</div>,
}));

describe('Custom404', () => {
	it('matches snapshot', () => {
		const {container} = render(<Custom404 />);
		expect(container).toMatchSnapshot();
	});
});
