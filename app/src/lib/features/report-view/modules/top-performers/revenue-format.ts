export function formatMonthlyRevenue(cents: number): string {
	const dollarsPerMonth = cents / 100;
	return `${formatCompactDollars(dollarsPerMonth)}/mo`;
}

export function formatGrowth(value: number | null): string | null {
	if (value === null) return null;
	const sign = value >= 0 ? '+' : '';
	return `${sign}${(value * 100).toFixed(0)}%`;
}

function formatCompactDollars(value: number): string {
	if (value >= 1_000_000) {
		return `$${trim(value / 1_000_000)}M`;
	}
	if (value >= 1_000) {
		return `$${trim(value / 1_000)}k`;
	}
	return `$${Math.round(value)}`;
}

function trim(value: number): string {
	return value >= 10 ? value.toFixed(0) : value.toFixed(1);
}
