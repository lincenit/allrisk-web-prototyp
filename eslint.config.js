import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

// Konvencia projektu (viď README „Pomenovania"):
//   česky  = viditeľný text, URL a taxonomické kľúče v dátach (?seg=rodiny, /pobocky)
//   anglicky = názvy súborov, komponentov, premenných a CSS tried
// Linter jazyk identifikátorov nevynúti; drží ale mŕtvy kód a chyby v hookoch,
// vďaka ktorým sa po refaktore nezabudnú nepoužité importy a konštanty.
export default [
  { ignores: ['dist/**', 'node_modules/**', 'figma-export/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.3' } },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',  // Vite + automatické JSX runtime
      'react/prop-types': 'off',          // prototyp bez typov
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Zostávajúce dva výskyty synchronizujú stav s vonkajším svetom (hash v URL,
      // prepnutie varianty hera v debug paneli), nie sú to odvodené dáta – držíme ako warn.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]
