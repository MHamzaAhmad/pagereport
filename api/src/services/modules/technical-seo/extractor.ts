export interface RawMetadata {
	title: string | null;
	metaTags: Record<string, string>;
	linkTags: { rel: string; href: string }[];
	htmlLang: string | null;
	charset: string | null;
	jsonLdBlocks: string[];
}

/**
 * Parse the `<head>` for SEO metadata via HTMLRewriter (Cloudflare Workers native).
 * Pure extraction — no scoring or interpretation.
 */
export async function extractTechnicalSeo(html: string): Promise<RawMetadata> {
	const raw: RawMetadata = {
		title: null,
		metaTags: {},
		linkTags: [],
		htmlLang: null,
		charset: null,
		jsonLdBlocks: [],
	};

	let titleBuffer = "";
	let jsonLdBuffer = "";
	let collectingJsonLd = false;

	const rewriter = new HTMLRewriter()
		.on("html", {
			element(el) {
				const lang = el.getAttribute("lang");
				if (lang) raw.htmlLang = lang.trim() || null;
			},
		})
		.on("title", {
			text(chunk) {
				titleBuffer += chunk.text;
			},
		})
		.on("meta", {
			element(el) {
				const charset = el.getAttribute("charset");
				if (charset) {
					raw.charset = charset.trim() || null;
					return;
				}
				const name = el.getAttribute("name");
				const property = el.getAttribute("property");
				const httpEquiv = el.getAttribute("http-equiv");
				const content = el.getAttribute("content");
				if (!content) return;
				const key = (name ?? property ?? httpEquiv ?? "").trim().toLowerCase();
				if (!key) return;
				raw.metaTags[key] = content.trim();
			},
		})
		.on("link", {
			element(el) {
				const rel = el.getAttribute("rel");
				const href = el.getAttribute("href");
				if (!rel || !href) return;
				raw.linkTags.push({ rel: rel.trim().toLowerCase(), href: href.trim() });
			},
		})
		.on('script[type="application/ld+json"]', {
			element(el) {
				collectingJsonLd = true;
				jsonLdBuffer = "";
				el.onEndTag(() => {
					raw.jsonLdBlocks.push(jsonLdBuffer);
					collectingJsonLd = false;
					jsonLdBuffer = "";
				});
			},
			text(chunk) {
				if (collectingJsonLd) jsonLdBuffer += chunk.text;
			},
		});

	await rewriter.transform(new Response(html)).arrayBuffer();

	const parsedTitle = titleBuffer.replace(/\s+/g, " ").trim();
	raw.title = parsedTitle || null;

	return raw;
}

export function findLinkHref(
	links: readonly { rel: string; href: string }[],
	rel: string,
): string | null {
	const match = links.find((l) => l.rel.split(/\s+/).includes(rel));
	return match ? match.href : null;
}
