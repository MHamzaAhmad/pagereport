export type CwvRating = 'good' | 'needs-improvement' | 'poor' | 'unknown';

export function formatMilliseconds(value: number | null, fallback: string): string {
	if (value === null || Number.isNaN(value)) return fallback;
	if (value < 1000) return `${Math.round(value)} ms`;
	const seconds = value / 1000;
	return `${seconds.toFixed(seconds >= 10 ? 0 : 1)} s`;
}

export function formatCls(value: number | null, fallback: string): string {
	if (value === null || Number.isNaN(value)) return fallback;
	return value.toFixed(2);
}

// Thresholds from https://web.dev/articles/vitals (good / needs-improvement cutoffs).
export function rateLcp(ms: number | null): CwvRating {
	if (ms === null) return 'unknown';
	if (ms <= 2500) return 'good';
	if (ms <= 4000) return 'needs-improvement';
	return 'poor';
}

export function rateCls(value: number | null): CwvRating {
	if (value === null) return 'unknown';
	if (value <= 0.1) return 'good';
	if (value <= 0.25) return 'needs-improvement';
	return 'poor';
}

export function rateInp(ms: number | null): CwvRating {
	if (ms === null) return 'unknown';
	if (ms <= 200) return 'good';
	if (ms <= 500) return 'needs-improvement';
	return 'poor';
}

export function rateFcp(ms: number | null): CwvRating {
	if (ms === null) return 'unknown';
	if (ms <= 1800) return 'good';
	if (ms <= 3000) return 'needs-improvement';
	return 'poor';
}

export function rateTbt(ms: number | null): CwvRating {
	if (ms === null) return 'unknown';
	if (ms <= 200) return 'good';
	if (ms <= 600) return 'needs-improvement';
	return 'poor';
}

export function rateSpeedIndex(ms: number | null): CwvRating {
	if (ms === null) return 'unknown';
	if (ms <= 3400) return 'good';
	if (ms <= 5800) return 'needs-improvement';
	return 'poor';
}

export type ScoreRating = 'good' | 'needs-improvement' | 'poor';

export function rateScore(score: number): ScoreRating {
	if (score >= 90) return 'good';
	if (score >= 50) return 'needs-improvement';
	return 'poor';
}
