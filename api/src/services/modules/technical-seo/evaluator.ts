import { findLinkHref, type RawMetadata } from "@/services/modules/technical-seo/extractor";
import {
	type TechnicalSeoCheck,
	type TechnicalSeoMetadata,
	type TechnicalSeoResult,
	type TechnicalSeoStatus,
	technicalSeoResultSchema,
} from "@/services/modules/technical-seo/result.schema";

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 50;
const DESC_MAX = 160;
const VALID_TWITTER_CARDS = new Set(["summary", "summary_large_image", "app", "player"]);

export function evaluateTechnicalSeo(raw: RawMetadata, sourceUrl: string): TechnicalSeoResult {
	const metadata = buildMetadata(raw);

	const core = {
		title: evalTitle(metadata.title, metadata.titleLength),
		metaDescription: evalDescription(metadata.metaDescription, metadata.metaDescriptionLength),
		canonical: evalCanonical(metadata.canonical, sourceUrl),
		viewport: evalViewport(metadata.viewport),
		robots: evalRobots(metadata.robots),
		lang: evalLang(metadata.lang),
		favicon: evalFavicon(metadata.favicon),
		charset: evalCharset(metadata.charset),
	};

	const openGraph = {
		ogTitle: evalSimplePresence(metadata.ogTitle, "og:title"),
		ogDescription: evalSimplePresence(metadata.ogDescription, "og:description"),
		ogImage: evalOgImage(metadata.ogImage, sourceUrl),
		ogUrl: evalOgUrl(metadata.ogUrl),
		ogType: evalSimplePresence(metadata.ogType, "og:type"),
	};

	const twitter = {
		twitterCard: evalTwitterCard(metadata.twitterCard),
		twitterTitle: evalTwitterFallback(metadata.twitterTitle, metadata.ogTitle, "twitter:title"),
		twitterDescription: evalTwitterFallback(
			metadata.twitterDescription,
			metadata.ogDescription,
			"twitter:description",
		),
		twitterImage: evalTwitterFallback(metadata.twitterImage, metadata.ogImage, "twitter:image"),
	};

	const structuredData = {
		jsonLd: evalJsonLd(metadata.jsonLdBlockCount, metadata.jsonLdTypes),
	};

	const allChecks: TechnicalSeoCheck[] = [
		...Object.values(core),
		...Object.values(openGraph),
		...Object.values(twitter),
		...Object.values(structuredData),
	];

	const overallStatus = rollupStatus(allChecks);
	const overallScore = computeScore(allChecks);
	const verdict = buildVerdict(overallStatus, overallScore, core, openGraph);
	const issues = buildIssues(core, openGraph, twitter, structuredData);
	const quickWins = buildQuickWins(core, openGraph, twitter, structuredData);

	return technicalSeoResultSchema.parse({
		overallStatus,
		overallScore,
		verdict,
		metadata,
		checks: { core, openGraph, twitter, structuredData },
		issues,
		quickWins,
	});
}

function buildMetadata(raw: RawMetadata): TechnicalSeoMetadata {
	const meta = raw.metaTags;
	const title = raw.title;
	const description = meta.description ?? null;
	const canonicalHref = findLinkHref(raw.linkTags, "canonical");
	const faviconHref =
		findLinkHref(raw.linkTags, "icon") ?? findLinkHref(raw.linkTags, "shortcut icon");
	const jsonLdTypes = extractJsonLdTypes(raw.jsonLdBlocks);

	return {
		title,
		titleLength: title?.length ?? 0,
		metaDescription: description,
		metaDescriptionLength: description?.length ?? 0,
		canonical: canonicalHref,
		viewport: meta.viewport ?? null,
		robots: meta.robots ?? null,
		lang: raw.htmlLang,
		favicon: faviconHref,
		charset: raw.charset ?? meta["content-type"] ?? null,
		ogTitle: meta["og:title"] ?? null,
		ogDescription: meta["og:description"] ?? null,
		ogImage: meta["og:image"] ?? null,
		ogUrl: meta["og:url"] ?? null,
		ogType: meta["og:type"] ?? null,
		twitterCard: meta["twitter:card"] ?? null,
		twitterTitle: meta["twitter:title"] ?? null,
		twitterDescription: meta["twitter:description"] ?? null,
		twitterImage: meta["twitter:image"] ?? null,
		jsonLdBlockCount: raw.jsonLdBlocks.length,
		jsonLdTypes,
	};
}

function extractJsonLdTypes(blocks: readonly string[]): string[] {
	const types: string[] = [];
	for (const block of blocks) {
		try {
			const parsed: unknown = JSON.parse(block);
			collectTypes(parsed, types);
		} catch {
			// Invalid JSON — skipped; counted in block count only.
		}
		if (types.length >= 20) break;
	}
	return types.slice(0, 20);
}

function collectTypes(node: unknown, out: string[]): void {
	if (!node || typeof node !== "object") return;
	if (Array.isArray(node)) {
		for (const item of node) collectTypes(item, out);
		return;
	}
	const record = node as Record<string, unknown>;
	const t = record["@type"];
	if (typeof t === "string" && !out.includes(t)) out.push(t);
	else if (Array.isArray(t)) {
		for (const entry of t) {
			if (typeof entry === "string" && !out.includes(entry)) out.push(entry);
		}
	}
	const graph = record["@graph"];
	if (Array.isArray(graph)) {
		for (const item of graph) collectTypes(item, out);
	}
}

function evalTitle(title: string | null, length: number): TechnicalSeoCheck {
	if (!title) return { status: "critical", note: "Missing <title> tag." };
	if (length < TITLE_MIN)
		return {
			status: "warning",
			note: `Title is ${length} chars — aim for ${TITLE_MIN}–${TITLE_MAX}.`,
		};
	if (length > TITLE_MAX)
		return {
			status: "warning",
			note: `Title is ${length} chars — search engines truncate around ${TITLE_MAX}.`,
		};
	return { status: "ok", note: `Title length (${length} chars) is in the sweet spot.` };
}

function evalDescription(desc: string | null, length: number): TechnicalSeoCheck {
	if (!desc) return { status: "critical", note: "Missing meta description." };
	if (length < DESC_MIN)
		return {
			status: "warning",
			note: `Description is ${length} chars — aim for ${DESC_MIN}–${DESC_MAX}.`,
		};
	if (length > DESC_MAX)
		return {
			status: "warning",
			note: `Description is ${length} chars — Google truncates around ${DESC_MAX}.`,
		};
	return { status: "ok", note: `Description length (${length} chars) is in the sweet spot.` };
}

function evalCanonical(canonical: string | null, sourceUrl: string): TechnicalSeoCheck {
	if (!canonical) return { status: "warning", note: 'No <link rel="canonical"> tag.' };
	if (!isAbsoluteUrl(canonical))
		return { status: "warning", note: "Canonical URL is relative — use an absolute URL." };
	try {
		const canonicalHost = new URL(canonical).host;
		const sourceHost = new URL(sourceUrl).host;
		if (canonicalHost !== sourceHost)
			return {
				status: "warning",
				note: `Canonical points to a different host (${canonicalHost}).`,
			};
	} catch {
		return { status: "warning", note: "Canonical URL could not be parsed." };
	}
	return { status: "ok", note: "Canonical URL is set and absolute." };
}

function evalViewport(viewport: string | null): TechnicalSeoCheck {
	if (!viewport)
		return { status: "critical", note: "Missing viewport meta — page will not scale on mobile." };
	if (!/width\s*=\s*device-width/i.test(viewport))
		return {
			status: "warning",
			note: "Viewport meta does not use width=device-width.",
		};
	return { status: "ok", note: "Viewport is configured for mobile." };
}

function evalRobots(robots: string | null): TechnicalSeoCheck {
	if (!robots) return { status: "ok", note: "No robots directive — default is index, follow." };
	const lower = robots.toLowerCase();
	if (lower.includes("noindex"))
		return {
			status: "critical",
			note: "Robots meta contains noindex — page is hidden from search engines.",
		};
	if (lower.includes("nofollow"))
		return { status: "warning", note: "Robots meta contains nofollow — links pass no authority." };
	return { status: "ok", note: `Robots directive: ${robots}.` };
}

function evalLang(lang: string | null): TechnicalSeoCheck {
	if (!lang) return { status: "warning", note: "Missing <html lang> attribute." };
	return { status: "ok", note: `Language declared as "${lang}".` };
}

function evalFavicon(favicon: string | null): TechnicalSeoCheck {
	if (!favicon) return { status: "warning", note: "No favicon link found." };
	return { status: "ok", note: "Favicon link is present." };
}

function evalCharset(charset: string | null): TechnicalSeoCheck {
	if (!charset) return { status: "warning", note: "No charset declared." };
	if (!/utf-?8/i.test(charset))
		return { status: "warning", note: `Charset is "${charset}" — UTF-8 is recommended.` };
	return { status: "ok", note: "Charset is UTF-8." };
}

function evalSimplePresence(value: string | null, label: string): TechnicalSeoCheck {
	if (!value) return { status: "warning", note: `Missing ${label} tag.` };
	return { status: "ok", note: `${label} is set.` };
}

function evalOgImage(value: string | null, sourceUrl: string): TechnicalSeoCheck {
	if (!value)
		return {
			status: "critical",
			note: "Missing og:image — your page shows no preview when shared.",
		};
	if (!isAbsoluteUrl(value)) {
		try {
			new URL(value, sourceUrl);
			return {
				status: "warning",
				note: "og:image is relative — social platforms may not resolve it.",
			};
		} catch {
			return { status: "critical", note: "og:image URL is invalid." };
		}
	}
	return { status: "ok", note: "og:image is an absolute URL." };
}

function evalOgUrl(value: string | null): TechnicalSeoCheck {
	if (!value) return { status: "warning", note: "Missing og:url tag." };
	if (!isAbsoluteUrl(value))
		return { status: "warning", note: "og:url should be an absolute URL." };
	return { status: "ok", note: "og:url is set." };
}

function evalTwitterCard(value: string | null): TechnicalSeoCheck {
	if (!value) return { status: "warning", note: "Missing twitter:card tag." };
	if (!VALID_TWITTER_CARDS.has(value.toLowerCase()))
		return { status: "warning", note: `Unknown twitter:card value "${value}".` };
	return { status: "ok", note: `twitter:card is "${value}".` };
}

function evalTwitterFallback(
	value: string | null,
	fallback: string | null,
	label: string,
): TechnicalSeoCheck {
	if (value) return { status: "ok", note: `${label} is set.` };
	if (fallback) return { status: "ok", note: `${label} missing — falls back to og equivalent.` };
	return { status: "warning", note: `Missing ${label} and no og fallback.` };
}

function evalJsonLd(count: number, types: readonly string[]): TechnicalSeoCheck {
	if (count === 0)
		return {
			status: "warning",
			note: "No JSON-LD structured data — Google can't generate rich results.",
		};
	if (types.length === 0)
		return {
			status: "warning",
			note: `${count} JSON-LD block${count === 1 ? "" : "s"} found, but none declare @type.`,
		};
	return {
		status: "ok",
		note: `${count} JSON-LD block${count === 1 ? "" : "s"} (${types.slice(0, 3).join(", ")}).`,
	};
}

function rollupStatus(checks: readonly TechnicalSeoCheck[]): TechnicalSeoStatus {
	if (checks.some((c) => c.status === "critical")) return "critical";
	if (checks.some((c) => c.status === "warning")) return "warning";
	return "ok";
}

function computeScore(checks: readonly TechnicalSeoCheck[]): number {
	if (checks.length === 0) return 0;
	let points = 0;
	for (const c of checks) {
		if (c.status === "ok") points += 1;
		else if (c.status === "warning") points += 0.5;
	}
	return Math.round((points / checks.length) * 100);
}

function buildVerdict(
	status: TechnicalSeoStatus,
	score: number,
	core: Record<string, TechnicalSeoCheck>,
	og: Record<string, TechnicalSeoCheck>,
): string {
	if (status === "ok") {
		return `Technical SEO is in good shape (${score}/100). Core tags, Open Graph and structured data all check out.`;
	}
	const missing: string[] = [];
	if (core.metaDescription?.status === "critical") missing.push("meta description");
	if (og.ogImage?.status === "critical") missing.push("og:image");
	if (core.viewport?.status === "critical") missing.push("viewport");
	if (core.title?.status === "critical") missing.push("title");
	if (core.robots?.status === "critical") missing.push("robots (noindex)");
	if (status === "critical") {
		const list = missing.length > 0 ? missing.join(", ") : "core metadata";
		return `Critical SEO gaps detected (${score}/100). Fix: ${list}.`;
	}
	return `Technical SEO is mostly there (${score}/100), but a few tags need attention.`;
}

function buildIssues(
	core: Record<string, TechnicalSeoCheck>,
	og: Record<string, TechnicalSeoCheck>,
	twitter: Record<string, TechnicalSeoCheck>,
	structured: Record<string, TechnicalSeoCheck>,
): string[] {
	const issues: string[] = [];
	const push = (label: string, check: TechnicalSeoCheck | undefined): void => {
		if (!check) return;
		if (check.status === "critical" || check.status === "warning") {
			issues.push(`${label}: ${check.note}`);
		}
	};
	push("Title", core.title);
	push("Meta description", core.metaDescription);
	push("Viewport", core.viewport);
	push("Robots", core.robots);
	push("Canonical", core.canonical);
	push("og:image", og.ogImage);
	push("og:title", og.ogTitle);
	push("og:description", og.ogDescription);
	push("twitter:card", twitter.twitterCard);
	push("Structured data", structured.jsonLd);
	return issues.slice(0, 8);
}

function buildQuickWins(
	core: Record<string, TechnicalSeoCheck>,
	og: Record<string, TechnicalSeoCheck>,
	twitter: Record<string, TechnicalSeoCheck>,
	structured: Record<string, TechnicalSeoCheck>,
): string[] {
	const wins: string[] = [];
	if (core.metaDescription?.status !== "ok")
		wins.push("Write a 120–160 character meta description that previews the page clearly.");
	if (og.ogImage?.status !== "ok")
		wins.push("Add an absolute og:image URL (1200×630 recommended) for rich social previews.");
	if (og.ogTitle?.status !== "ok" || og.ogDescription?.status !== "ok")
		wins.push("Add og:title and og:description so shared links show proper text.");
	if (twitter.twitterCard?.status !== "ok")
		wins.push("Add twitter:card=summary_large_image so Twitter shows a big preview.");
	if (core.canonical?.status !== "ok")
		wins.push('Add a <link rel="canonical"> pointing to the absolute URL of this page.');
	if (core.lang?.status !== "ok") wins.push("Add a lang attribute to the <html> element.");
	if (structured.jsonLd?.status !== "ok")
		wins.push("Add JSON-LD structured data (e.g. Product, Organization) for rich results.");
	if (core.viewport?.status !== "ok")
		wins.push('Add <meta name="viewport" content="width=device-width, initial-scale=1">.');
	return wins.slice(0, 8);
}

function isAbsoluteUrl(value: string): boolean {
	return /^https?:\/\//i.test(value);
}
