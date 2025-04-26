/** @type {import('npm-check-updates').RunOptions} */
module.exports = {
  dep: ['prod', 'dev', 'optional', 'peer'],
  reject: [
    // wallaby errors on vitest 3.1.2
    '@vitest/coverage-v8',
    'vitest'
  ],
};
