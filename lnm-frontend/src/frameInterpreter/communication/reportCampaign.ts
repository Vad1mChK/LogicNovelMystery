import axios from 'axios';
import { VITE_SERVER_URL } from '../../metaEnv';

interface CampaignReportRequest {
	winner: boolean;
	sessionId: string;
}

interface CampaignReportResponse {
	endingId: string;
}

const reportCampaign = async (
	winner: boolean
): Promise<CampaignReportResponse> => {
	try {
		const requestBody: CampaignReportRequest = {
			winner,
			sessionId: localStorage.getItem('sessionToken') || '',
		};
		const response = await axios.post(
			`${VITE_SERVER_URL}/game/report-campaign`,
			requestBody,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('AuthToken'),
				},
			}
		);
		return response.data;
	} catch (e) {
		console.error('Error when sending campaign report:', e);
		throw e;
	}
};

export { reportCampaign };
