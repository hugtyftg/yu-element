import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

const tsOffRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-require-imports': 'off',
};

const jsOffRules = {
  'no-irregular-whitespace': 'off',
};

const getJsLint = (originRules) => ({
  rules: Object.assign({}, originRules, jsOffRules),
});
console.log();

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  getJsLint(pluginJs.configs.recommended.rules),
  ...tseslint.configs.recommended.map((rulesObj) => {
    if (rulesObj.name === 'typescript-eslint/recommended') {
      return {
        name: 'typescript-eslint/recommended',
        rules: {
          ...rulesObj.rules,
          ...tsOffRules,
        },
      };
    }
    return rulesObj;
  }),
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
];
