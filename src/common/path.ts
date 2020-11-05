export default {
	HOME: '/home',

	WELCOME: '/welcome',

	GUIDE: '/guide',
	GUIDE_DOMAIN_SELECT: '/guide/domain-select',
	GUIDE_IMPORT_DATA: '/guide/:domain/import-data',
	GUIDE_MAPPING_FACTOR: '/guide/:domain/mapping-factor',
	GUIDE_MEASURE_INDICATOR: '/guide/:domain/measure-indicator',
	GUIDE_BUILD_METRICS: '/guide/:domain/build-metrics',

	CONSOLE: '/console',
	CONSOLE_NOTIFICATION: '/console/notification'
};

export const toDomain = (path: string, domain: string) => path.replace(':domain', domain);