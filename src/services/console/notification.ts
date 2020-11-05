import { NotificationCategory, Notifications } from './types';

export interface NotificationResponse {
	notifications: Notifications;
	allLoaded: boolean;
}

export const listNewNotifications = async (options: {
	endTime?: string;
	pageSize?: number;
}): Promise<NotificationResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				notifications: [
					{
						subject: 'Awesome chart for investigating customers distribution.',
						category: NotificationCategory.CHART_PUSHED,
						body: 'A distribution diagram of customers of age bracket and place of residence.',
						sender: 'Administrator',
						createDate: '2020/11/5 20:18:19'
					},
					{
						subject: 'Scatter support dynamic effect now.',
						category: NotificationCategory.CHART_TYPE_PUSHED,
						body: 'Use dynamic effect, active your chart!',
						sender: 'Bot Likes',
						createDate: '2020/11/3 09:55:09'
					},
					{
						subject: 'A big space for marketing digging.',
						category: NotificationCategory.SPACE_PUSHED,
						body: 'After 3 weeks great work, the marketing space is online now.\nThanks to all involved in making this happen!\nFollow us to find more...',
						sender: 'Bot Likes',
						createDate: '2020/11/1 11:24:01'
					},
					{
						subject: 'Sam Lee left.',
						category: NotificationCategory.GROUP_LEFT,
						body: 'Sam Lee left group "Universes of Marvel".',
						sender: 'Marvel Steward',
						createDate: '2020/10/14 15:42:00'
					},
					{
						subject: 'Hello there.',
						category: NotificationCategory.GROUP_JOINED,
						body: 'Welcome to group "Universes of Marvel", guess which one here?',
						sender: 'Bot First',
						createDate: '2020/10/05 17:45:37'
					}
				],
				allLoaded: true
			});
		}, 1000);
	});
};
export const listClearedNotifications = async (options: {
	endTime?: string;
	pageSize?: number;
}): Promise<NotificationResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				notifications: [],
				allLoaded: true
			});
		}, 3000);
	});
};