export interface Readability {
	wordCount: number;
	avgSentenceLength: number;
	youPronounCount: number;
	wePronounCount: number;
	iPronounCount: number;
	readerCentricityRatio: number;
}

export function computeReadability(plainText: string): Readability {
	const words = plainText.match(/\b[\w'-]+\b/g) ?? [];
	const wordCount = words.length;
	const sentences = plainText.split(/[.!?]+\s/).filter((s) => s.trim().length > 0);
	const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
	const lower = plainText.toLowerCase();
	const youPronounCount =
		countWord(lower, "you") + countWord(lower, "your") + countWord(lower, "yours");
	const wePronounCount =
		countWord(lower, "we") +
		countWord(lower, "our") +
		countWord(lower, "ours") +
		countWord(lower, "us");
	const iPronounCount =
		countWord(lower, "i") +
		countWord(lower, "my") +
		countWord(lower, "mine") +
		countWord(lower, "me");
	const founderPronouns = wePronounCount + iPronounCount;
	const readerCentricityRatio =
		founderPronouns === 0
			? youPronounCount > 0
				? youPronounCount
				: 0
			: youPronounCount / founderPronouns;
	return {
		wordCount,
		avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
		youPronounCount,
		wePronounCount,
		iPronounCount,
		readerCentricityRatio: Math.round(readerCentricityRatio * 100) / 100,
	};
}

function countWord(text: string, word: string): number {
	const pattern = new RegExp(`\\b${word}\\b`, "g");
	return (text.match(pattern) ?? []).length;
}
