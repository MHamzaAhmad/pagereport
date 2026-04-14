import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import svelte from 'eslint-plugin-svelte';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const boundaryElements = [
	{ type: 'types', pattern: 'src/lib/types/**' },
	{ type: 'api', pattern: 'src/lib/api/**' },
	{ type: 'stores', pattern: 'src/lib/stores/**' },
	{ type: 'i18n', pattern: 'src/lib/i18n/**' },
	{ type: 'utils', pattern: 'src/lib/utils/**' },
	{ type: 'ui', pattern: 'src/lib/components/ui/**' },
	{ type: 'features', pattern: 'src/lib/features/**' },
	{ type: 'routes', pattern: 'src/routes/**' }
];

const boundaryRules = [
	{ from: { type: 'types' }, disallow: { to: { type: '*' } } },
	{ from: { type: 'utils' }, allow: { to: { type: 'utils' } } },
	{ from: { type: 'i18n' }, allow: { to: { type: 'utils' } } },
	{ from: { type: 'api' }, allow: { to: { type: ['types', 'utils'] } } },
	{ from: { type: 'stores' }, allow: { to: { type: ['api', 'types', 'utils'] } } },
	{ from: { type: 'ui' }, allow: { to: { type: ['ui', 'utils'] } } },
	{
		from: { type: 'features' },
		allow: {
			to: { type: ['api', 'stores', 'types', 'ui', 'i18n', 'utils', 'features'] }
		}
	},
	{
		from: { type: 'routes' },
		allow: {
			to: { type: ['features', 'stores', 'types', 'ui', 'i18n', 'utils'] }
		}
	}
];

export default tseslint.config(
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'src/worker-configuration.d.ts',
			'.wrangler/**'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				tsconfigRootDir: import.meta.dirname
			}
		},
		settings: {
			'boundaries/elements': boundaryElements,
			'boundaries/include': ['src/**/*']
		},
		plugins: {
			boundaries,
			'unused-imports': unusedImports
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports', fixStyle: 'inline-type-imports' }
			],
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_'
				}
			],
			'boundaries/dependencies': [
				'error',
				{
					default: 'disallow',
					rules: boundaryRules
				}
			],
			'boundaries/no-unknown': 'off',
			'boundaries/no-unknown-files': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser,
				projectService: true,
				extraFileExtensions: ['.svelte'],
				svelteFeatures: {
					experimentalGenerics: true
				}
			}
		}
	},
	{
		files: ['*.config.{js,ts}', 'eslint.config.js', 'svelte.config.js', 'vite.config.ts'],
		...tseslint.configs.disableTypeChecked
	}
);
