const argsService = require('./args');

describe('Args Service', () => {
  it('should log doc if help flag has been given', () => {
    const args = process.argv.slice(2);
    expect(argsService.getCliArgs()).toEqual(args);
  });
});
