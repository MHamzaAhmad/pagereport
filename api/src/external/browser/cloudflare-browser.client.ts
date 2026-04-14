import puppeteer from "@cloudflare/puppeteer";
import type { BrowserClient, ScreenshotOptions } from "@/external/browser/browser.client";

type LifeCycleEvent = NonNullable<ScreenshotOptions["waitUntil"]>;

const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 900;
const DEFAULT_NAVIGATION_TIMEOUT_MS = 30_000;
const DEFAULT_WAIT_UNTIL: LifeCycleEvent = "networkidle2";

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
			const buffer = await page.screenshot({ type: "png", fullPage: false });
			return new Uint8Array(buffer);
		} finally {
			await browser.close();
		}
	}
}
