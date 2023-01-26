module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['google', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'require-jsdoc': 'off',
    'max-len': [2, 120, 4],
    'no-invalid-this': 'off',
    'no-extra-bind': 'off',
  },
  ignorePatterns: ['**/widget/app', '**/plugin/targets', 'node_modules'],
};
