export function normalizeUrl(input: string): string {
	const parsed = new URL(input.trim());
	parsed.hash = "";
	parsed.protocol = parsed.protocol.toLowerCase();
	parsed.hostname = parsed.hostname.toLowerCase();
	if (
		(parsed.protocol === "http:" && parsed.port === "80") ||
		(parsed.protocol === "https:" && parsed.port === "443")
	) {
		parsed.port = "";
	}
	if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
		parsed.pathname = parsed.pathname.replace(/\/+$/, "");
	}
	return parsed.toString();
}
