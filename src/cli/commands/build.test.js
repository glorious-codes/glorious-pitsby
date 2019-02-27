const docService = require('../services/doc');
const buildService = require('../services/build');
const command = require('./build');

describe('Build Command', () => {
  beforeEach(() => {
    docService.log = jest.fn();
    docService.logUnknownOption = jest.fn();
    buildService.init = jest.fn(() => Promise.resolve());
  });

  it('should log doc if help flag has been given', () => {
    command.exec(['--help']);
    expect(docService.log).toHaveBeenCalledWith('build');
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

  it('should log success on build success', () => {
    buildService.init = jest.fn(() => Promise.resolve('success'));
    command.exec().then(response => {
      expect(response).toEqual('success');
    });
  });

  it('should log error on build error', () => {
    buildService.init = jest.fn(() => Promise.resolve('some error'));
    command.exec().then(() => {}, err => {
      expect(err).toEqual('some error');
    });
  });
});
