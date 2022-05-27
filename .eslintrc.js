module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
	  project: 'tsconfig.json',
	  sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
	  'plugin:@typescript-eslint/recommended',
	  'plugin:prettier/recommended',
	],
	root: true,
	env: {
	  node: true,
	  jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
	  'quotes': 'off',
	  '@typescript-eslint/quotes': ['error', 'single'],
	  'indent': 'off',
	  '@typescript-eslint/indent': ['error', 2],
	  '@typescript-eslint/comma-dangle': ['error', 'only-multiline'],
	  '@typescript-eslint/interface-name-prefix': 'off',
	  '@typescript-eslint/explicit-function-return-type': 'error',
	  '@typescript-eslint/explicit-module-boundary-types': 'off',
	  '@typescript-eslint/no-explicit-any': 'off',
	  'prettier/prettier': [
		'error',
		{
		  endOfLine: 'auto',
		},
	  ],
	},
};