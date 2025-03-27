import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import js from '@eslint/js';

export default defineConfig([
	globalIgnores(['.angular/*']),
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.browser },
	},
	tseslint.configs.recommended,
	{
		files: ['**/*.js'],
		plugins: {
			js,
		},
		extends: ['js/recommended'],
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
		},
	},
	eslintConfigPrettier,
]);
