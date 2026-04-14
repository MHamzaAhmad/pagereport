export interface ScreenshotOptions {
	readonly viewportWidth?: number;
	readonly viewportHeight?: number;
	readonly waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
	readonly navigationTimeoutMs?: number;
}

export interface BrowserClient {
	/**
	 * Navigate to the given URL in a real browser and return a PNG screenshot
	 * of the initial above-the-fold view. The caller owns the returned bytes.
	 */
	screenshot(url: string, options?: ScreenshotOptions): Promise<Uint8Array>;
}
