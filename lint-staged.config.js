/** @type {import('lint-staged').Configuration} */
export default {
  '!(*.css|*.ts|*.tsx)': 'eslint --cache',
  '*.css': 'stylelint --cache',
  '*.{ts,tsx}': ['eslint --cache', 'prettier --write'],
};
