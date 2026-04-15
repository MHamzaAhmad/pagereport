export interface ParsedHeading {
	level: number;
	text: string;
	order: number;
}

export interface ParsedCta {
	text: string;
	href: string | null;
	kind: "button" | "link";
	isPrimary: boolean;
	sectionHeading: string | null;
}

export interface ParsedSection {
	heading: string | null;
	headingLevel: number | null;
	bodyText: string;
	bullets: string[];
}

export interface ParsedOutline {
	headings: ParsedHeading[];
	sections: ParsedSection[];
	ctas: ParsedCta[];
	plainText: string;
}

export interface MetaTags {
	title: string | null;
	description: string | null;
	ogTitle: string | null;
	ogDescription: string | null;
}
