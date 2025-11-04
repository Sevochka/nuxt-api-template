// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  ignores: [
    'dist',
    'node_modules',
    '.output',
    '.nuxt',
    '.storybook',
    'storybook-static',
    '.github',
    'coverage',
    '*.log',
    'nuxt.d.ts',
    '.DS_Store',
    '.vscode',
    '*.md',
    'package.json',
    'package-lock.json',
    'babel.config.js',
    'graphql',
    'types.ts',
    'generated',
    'components.d.ts',
    'icons.d.ts',
    'auto.d.ts',
    'src-tauri',
    'auto-imports.d.ts',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/no-reserved-component-names': 'off',
    'func-style': ['error', 'expression'],
    'antfu/top-level-function': 'off',
    'semi': ['error', 'always'],
    '@stylistic/semi': 'off', // отключаем конфликтующее правило
    '@stylistic/member-delimiter-style': 'off',
    '@stylistic/max-statements-per-line': 'off',
    // cause vue 3 template can have multiple root
    'vue/no-multiple-template-root': 'off',
  },
  languageOptions: {
    globals: {
      ref: 'readonly',
      computed: 'readonly',
      watch: 'readonly',
      watchEffect: 'readonly',
    },
  },
});
