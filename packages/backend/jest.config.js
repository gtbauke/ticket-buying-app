const { name } = require('./package.json');

module.exports = {
  displayName: name,
  name,
  preset: 'ts-jest',
  rootDir: '../../',
  testPathIgnorePatterns: ['__tests__/utils/*.ts'],
};
