import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import eslint from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import security from 'eslint-plugin-security';

export const eslintNode = [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  prettierConfig,
  security.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      camelcase: 'error',
      'require-await': 'error',
      'init-declarations': 'error',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-warning-comments': 'warn',
      'no-console': 'error',
      'no-empty-function': ['error', { allow: ['constructors'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-restricted-types': ['error'],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-useless-constructor': ['error'],
      '@typescript-eslint/no-shadow': ['error'],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['eslint.config.mjs', 'prettier.config.js'],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
      ],
    },
  },
];
