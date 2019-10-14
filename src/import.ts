interface Metrics {
	capHeight: number;
	xHeight: number;
	ascenderHeight: number;
	descenderHeight: number;
}


declare module '*.bmfont' {
	import BMFont from '@downpourdigital/bmfont-utils/dist/cjs/types/BMFont';

	const _: {
		font: BMFont;
		metrics: Metrics;
	};

	export default _;
}


declare module '*.bmfont?metricsOnly' {
	const _: {
		metrics: Metrics;
	};

	export default _;
}
