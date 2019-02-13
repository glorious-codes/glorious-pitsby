const argsService = require('./args');

describe('Args Service', () => {
  it('should get CLI Arguments', () => {
    const args = process.argv.slice(2);
    expect(argsService.getCliArgs()).toEqual(args);
  });

  it('should get specific argument value', () => {
    process.argv.slice = jest.fn(() => ['--env=production']);
    expect(argsService.getCliArgs('--env')).toEqual('production');
  });

  it('should get specific flag argument value', () => {
    process.argv.slice = jest.fn(() => ['--watch']);
    expect(argsService.getCliArgs('--watch')).toEqual(true);
  });

  it('should get undefined if no specific argument has been found', () => {
    process.argv.slice = jest.fn(() => ['--env=production']);
    expect(argsService.getCliArgs('--watch')).toEqual(undefined);
  });
});
