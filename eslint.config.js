import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      // This repo exports contexts + helpers from the same files; Fast Refresh rule is too strict here.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Existing code uses `any` in a few places (e.g., voice command parsing); keep it allowed.
      '@typescript-eslint/no-explicit-any': 'off',

      // Some patterns intentionally use short-circuit expressions.
      '@typescript-eslint/no-unused-expressions': 'off',

      // This rule is overly restrictive for some legitimate effect-driven flows in the app.
      'react-hooks/set-state-in-effect': 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
