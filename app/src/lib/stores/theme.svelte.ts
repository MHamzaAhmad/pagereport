export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'pagereport.theme';

function readInitial(): Theme {
	if (typeof window === 'undefined') return 'light';
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export class ThemeState {
	current = $state<Theme>('light');

	constructor() {
		if (typeof window === 'undefined') return;
		this.current = readInitial();
		this.#apply();
	}

	toggle(origin?: { x: number; y: number }): void {
		const next: Theme = this.current === 'dark' ? 'light' : 'dark';

		const doc = typeof document !== 'undefined' ? document : null;
		const reduced =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const supportsViewTransition =
			doc !== null &&
			'startViewTransition' in doc &&
			typeof (doc as Document & { startViewTransition?: unknown }).startViewTransition ===
				'function';

		if (!doc || !supportsViewTransition || reduced) {
			this.#set(next);
			return;
		}

		type ViewTransition = { ready: Promise<void> };
		type DocWithVT = Document & {
			startViewTransition: (cb: () => void) => ViewTransition;
		};
		const transition = (doc as DocWithVT).startViewTransition(() => this.#set(next));

		void transition.ready.then(() => {
			const x = origin?.x ?? window.innerWidth;
			const y = origin?.y ?? 0;
			const endRadius = Math.hypot(
				Math.max(x, window.innerWidth - x),
				Math.max(y, window.innerHeight - y)
			);
			const clipFrom = `circle(0 at ${x}px ${y}px)`;
			const clipTo = `circle(${endRadius}px at ${x}px ${y}px)`;
			doc.documentElement.animate(
				{ clipPath: [clipFrom, clipTo] },
				{
					duration: 500,
					easing: 'ease-in-out',
					pseudoElement: '::view-transition-new(root)'
				}
			);
		});
	}

	#set(next: Theme): void {
		this.current = next;
		this.#apply();
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(STORAGE_KEY, next);
		}
	}

	#apply(): void {
		if (typeof document === 'undefined') return;
		document.documentElement.classList.toggle('dark', this.current === 'dark');
	}
}

export const theme = new ThemeState();
