import axios from 'axios';
import { reportCampaign } from './reportCampaign';
import { VITE_SERVER_URL } from '../../metaEnv';

jest.mock('../../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081',
}));

describe('reportCampaign', () => {
	it('should successfully send a report for a winning campaign', async () => {
		const mockResponse = { data: { endingId: 'ending123' } };
		const axiosPostSpy = jest
			.spyOn(axios, 'post')
			.mockResolvedValue(mockResponse);
		jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
			if (key === 'sessionToken') return 'mockSessionToken';
			if (key === 'AuthToken') return 'mockAuthToken';
			return null;
		});

		const result = await reportCampaign(true);

		expect(axiosPostSpy).toHaveBeenCalledWith(
			`${VITE_SERVER_URL}/game/report-campaign`,
			{ winner: true, sessionToken: 'mockSessionToken' },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'mockAuthToken',
				},
			}
		);
		expect(result).toEqual({ endingId: 'ending123' });
	});

	it('should successfully send a report for a losing campaign', async () => {
		const mockResponse = { data: { endingId: 'ending456' } };
		const axiosPostSpy = jest
			.spyOn(axios, 'post')
			.mockResolvedValue(mockResponse);
		jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
			if (key === 'sessionToken') return 'mockSessionToken';
			if (key === 'AuthToken') return 'mockAuthToken';
			return null;
		});

		const result = await reportCampaign(false);

		expect(axiosPostSpy).toHaveBeenCalledWith(
			`${VITE_SERVER_URL}/game/report-campaign`,
			{ winner: false, sessionToken: 'mockSessionToken' },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'mockAuthToken',
				},
			}
		);
		expect(result).toEqual({ endingId: 'ending456' });
	});

	it('should throw an error when the session token is missing', async () => {
		jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
			if (key === 'AuthToken') return 'mockAuthToken';
			return null;
		});

		const axiosPostSpy = jest
			.spyOn(axios, 'post')
			.mockRejectedValue(new Error('Session token is missing'));

		await expect(reportCampaign(true)).rejects.toThrow(
			'Session token is missing'
		);

		expect(axiosPostSpy).toHaveBeenCalledWith(
			`${VITE_SERVER_URL}/game/report-campaign`,
			{ winner: true, sessionToken: '' },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'mockAuthToken',
				},
			}
		);
	});
});
