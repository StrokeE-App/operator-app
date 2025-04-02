import {render} from '@testing-library/react';
import LoginPage from '@/app/login/page';

describe('LoginPage', () => {
	it('matches snapshot', () => {
		const {container} = render(<LoginPage />);
		expect(container).toMatchSnapshot();
	});
});
