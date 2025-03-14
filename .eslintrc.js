module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  rules: {
    'no-console': 'off', // Allow console for demo purposes
    'no-debugger': 'off', // Allow debugger for demo purposes
    'vue/multi-word-component-names': 'off', // Allow single-word component names
    'no-unused-vars': 'warn', // Just warn on unused variables instead of error
    'no-undef': 'warn' // Just warn on undefined variables
  }
}
