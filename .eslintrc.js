module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'airbnb-base', 'plugin:@typescript-eslint/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'html'],
  rules: {
    'object-curly-newline': 0,
    '@typescript-eslint/no-var-requires': 0,
    'class-methods-use-this': 0,
    'no-plusplus': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    'max-len': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'implicit-arrow-linebreak': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'lines-between-class-members': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-param-reassign': 0,
    'operator-linebreak': 0,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@src', './src'],
          ['@components', './src/components'],
          ['@assets', './src/assets'],
          ['@services', './src/services'],
          ['@utils', './src/utils'],
          ['@pages', './src/pages'],
        ],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      },
    },
  },
  globals: {
    uni: true,
    getCurrentPages: true,
    UniApp: true,
  },
};
