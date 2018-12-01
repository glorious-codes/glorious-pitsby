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

  it('should initialize build service if option given is valid', () => {
    command.exec(['--watch']);
    expect(buildService.init).toHaveBeenCalled();
  });

  it('should initialize build service passing options if they have been given', () => {
    const options = ['--watch'];
    command.exec(options);
    expect(buildService.init).toHaveBeenCalledWith(options);
  });

  it('should initialize build service with no options if options have not been given', () => {
    command.exec();
    expect(buildService.init).toHaveBeenCalledWith(undefined);
  });

  it('should log unkown option if option is not valid', () => {
    const options = ['whatever'];
    command.exec(options);
    expect(docService.logUnknownOption).toHaveBeenCalledWith('build', options[0]);
  });
});
