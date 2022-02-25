const path = require('path');

module.exports = {
  entry: {
    base: './dist/base/index.js',
    basesync: './dist/basesync/index.js',
    posts: './dist/posts/index.js',
    now: './dist/now/index.js',
    relayresults: './dist/relay-results/index.js',
    sandbox: './dist/sandbox/index.js',
    settings: './dist/settings/index.js',
    support: './dist/support/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].bundle.js',
  },
  mode: 'production',
  watch: true,
};
