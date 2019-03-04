const docService = require('../services/doc');
const buildService = require('../services/build');
const command = require('./build');

describe('Build Command', () => {
  beforeEach(() => {
    docService.log = jest.fn();
    docService.logUnknownOption = jest.fn();
    buildService.init = jest.fn();
  });

  it('should log doc if help flag has been given', () => {
    command.exec(['--help']);
    expect(docService.log).toHaveBeenCalledWith('build');
  });

  it('should initialize build service', () => {
    command.exec();
    expect(buildService.init).toHaveBeenCalled();
  });
});
