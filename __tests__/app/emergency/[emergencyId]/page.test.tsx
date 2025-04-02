import {render} from '@testing-library/react';
import EmergencyPage from '@/app/emergency/[emergencyId]/page';

describe('EmergencyPage', () => {
	it('matches snapshot', () => {
		const {container} = render(<EmergencyPage params={Promise.resolve({emergencyId: '123'})} />);
		expect(container).toMatchSnapshot();
	});
});
