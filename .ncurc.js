/** @type {import('npm-check-updates').RunOptions} */
module.exports = {
  dep: ['prod', 'dev', 'optional', 'peer'],
  removeRange: true,
  reject: ['@types/node', 'uuid'],
  target: (name) => {
    if(['slonik'].includes(name)) return 'minor';
    return 'latest';
  },
};
