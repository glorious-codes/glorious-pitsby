const build = require('./build');
const help = require('./help');
const version = require('./version');
const index = require('./index');

describe('Commands Index', () => {
  it('should contain all commands', () => {
    expect(index).toEqual({
      build,
      help,
      version
    });
  });
});
