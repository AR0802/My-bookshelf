import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import js from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';

export default defineConfig([
	tseslint.configs.recommended,
	tseslint.configs.stylistic,
	{
		files: ['**/*.ts'],
		languageOptions: { globals: globals.browser },
		plugins: {
			js,
			import: eslintPluginImport,
		},
		extends: ['js/recommended'],
		rules: {
			'no-unused-vars': 'error',
			'no-undef': 'error',
			'no-redeclare': 'error',
			'no-duplicate-imports': 'error',
			'no-useless-concat': 'error',
			'no-useless-escape': 'error',
			'no-useless-return': 'error',
			'no-useless-catch': 'error',
			'prefer-const': 'error',
			'prefer-template': 'error',
			'no-alert': 'error',
			'no-debugger': 'error',
			curly: ['error', 'all'],
			eqeqeq: ['error', 'always'],
			'no-multi-spaces': 'error',
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'always'],
			indent: ['error', 'tab'],
			'comma-dangle': ['error', 'always-multiline'],
			'import/order': [
				'error',
				{ groups: ['builtin', 'external', 'internal'] },
			],
		},
	},
	globalIgnores(['.angular/*']),
	eslintConfigPrettier,
]);
