import { PUBLIC_API_BASE_URL } from '$env/static/public';

if (!PUBLIC_API_BASE_URL) {
	throw new Error('PUBLIC_API_BASE_URL is not set. Copy .env.example to .env and configure it.');
}

export const API_BASE_URL: string = PUBLIC_API_BASE_URL.replace(/\/$/, '');
