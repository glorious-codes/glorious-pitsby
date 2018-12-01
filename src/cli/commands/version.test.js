const pkg = require('../../../package.json');
const command = require('./version');

describe('Version Command', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should log doc if help flag has been given', () => {
    command.exec();
    expect(console.log).toHaveBeenCalledWith(`v${pkg.version}`);
  });
});
