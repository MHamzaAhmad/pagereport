import puppeteer from "@cloudflare/puppeteer";
import type {
	BrowserClient,
	ScreenshotOptions,
	SectionScreenshotOptions,
} from "@/external/browser/browser.client";

type LifeCycleEvent = NonNullable<ScreenshotOptions["waitUntil"]>;

const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 900;
const DEFAULT_NAVIGATION_TIMEOUT_MS = 30_000;
const DEFAULT_WAIT_UNTIL: LifeCycleEvent = "networkidle2";
const DEFAULT_MAX_SECTIONS = 6;
const DEFAULT_SETTLE_DELAY_MS = 250;

export class CloudflareBrowserClient implements BrowserClient {
	constructor(private readonly binding: Fetcher) {}

	async screenshot(url: string, options: ScreenshotOptions = {}): Promise<Uint8Array> {
		const width = options.viewportWidth ?? DEFAULT_VIEWPORT_WIDTH;
		const height = options.viewportHeight ?? DEFAULT_VIEWPORT_HEIGHT;
		const waitUntil = options.waitUntil ?? DEFAULT_WAIT_UNTIL;
		const timeout = options.navigationTimeoutMs ?? DEFAULT_NAVIGATION_TIMEOUT_MS;

		const browser = await puppeteer.launch(this.binding);
		try {
			const page = await browser.newPage();
			await page.setViewport({ width, height, deviceScaleFactor: 1 });
			await page.goto(url, { waitUntil, timeout });
			const buffer = await page.screenshot({ type: "jpeg", fullPage: false });
			return new Uint8Array(buffer);
		} finally {
			await browser.close();
		}
	}

	async screenshotSections(
		url: string,
		options: SectionScreenshotOptions = {},
	): Promise<Uint8Array[]> {
		const width = options.viewportWidth ?? DEFAULT_VIEWPORT_WIDTH;
		const height = options.viewportHeight ?? DEFAULT_VIEWPORT_HEIGHT;
		const waitUntil = options.waitUntil ?? DEFAULT_WAIT_UNTIL;
		const timeout = options.navigationTimeoutMs ?? DEFAULT_NAVIGATION_TIMEOUT_MS;
		const maxSections = options.maxSections ?? DEFAULT_MAX_SECTIONS;
		const settleDelayMs = options.settleDelayMs ?? DEFAULT_SETTLE_DELAY_MS;

		const browser = await puppeteer.launch(this.binding);
		try {
			const page = await browser.newPage();
			await page.setViewport({ width, height, deviceScaleFactor: 1 });
			await page.goto(url, { waitUntil, timeout });

			const pageHeight = await page.evaluate(() => {
				const g = globalThis as unknown as {
					document: { documentElement: { scrollHeight: number } };
				};
				return g.document.documentElement.scrollHeight;
			});
			const rawCount = Math.max(1, Math.ceil(pageHeight / height));
			const sections = Math.min(rawCount, Math.max(1, maxSections));

			const shots: Uint8Array[] = [];
			for (let i = 0; i < sections; i += 1) {
				const y = i * height;
				await page.evaluate((scrollY: number) => {
					const g = globalThis as unknown as { scrollTo: (x: number, y: number) => void };
					g.scrollTo(0, scrollY);
				}, y);
				await new Promise((resolve) => setTimeout(resolve, settleDelayMs));
				const buffer = await page.screenshot({ type: "jpeg", fullPage: false });
				shots.push(new Uint8Array(buffer));
			}
			return shots;
		} finally {
			await browser.close();
		}
	}
}
