import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,vue}'], // Define applicable file types
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Define additional custom rules if needed
      "endOfLine": "lf"
    },
  },
  // JavaScript Recommended Config
  pluginJs.configs.recommended,
  // Vue Essential Config
  ...pluginVue.configs['flat/essential'],
  // Prettier Config Integration
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error', // Use Prettier as an ESLint rule
    },
  },
  // Disable conflicting rules between Prettier and ESLint
  configPrettier,
];
