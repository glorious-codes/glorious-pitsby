const webpack = require('webpack');
const argsService = require('./args');
const processService = require('./process');
const { fileService } = require('./file');
const docsGeneratorService = require('./docs-generator');
const webpackMock = {
  response: ''
};

jest.mock('webpack');
webpack.mockImplementation((config, onComplete) => {
  onComplete(webpackMock.response);
});

describe('Docs Generator Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
    fileService.require = jest.fn(() => {
      return { output: {} };
    });
  });

  afterEach(() => {
    webpackMock.response = null;
    webpack.mockClear();
    argsService.getCliArgs = jest.fn();
    processService.setNodeEnv = jest.fn();
  });

  it('should log files generation start', () => {
    docsGeneratorService.init('/client');
    expect(console.log).toHaveBeenCalledWith('Generating docs...');
  });

  it('should set node environment as development if no environment has been provided', () => {
    docsGeneratorService.init('/client');
    expect(processService.setNodeEnv).toHaveBeenCalledWith('development');
  });

  it('should set node environment according the given environment', () => {
    argsService.getCliArgs = jest.fn(param => {
      if(param == '--env')
        return 'production';
    });
    docsGeneratorService.init('/client');
    expect(processService.setNodeEnv).toHaveBeenCalledWith('production');
  });

  it('should compile files to a custom directory', () => {
    docsGeneratorService.init('/client', './docs');
    expect(webpack.mock.calls[0][0]).toEqual({
      output: {
        path: '/client/docs'
      }
    });
  });

  it('should compile files to pitsby directory if no output directory has been given', () => {
    docsGeneratorService.init('/client');
    expect(webpack.mock.calls[0][0]).toEqual({
      output: {
        path: '/client/pitsby'
      }
    });
  });

  it('should log success on successfully generate files', () => {
    docsGeneratorService.init('/client');
    expect(console.log).toHaveBeenCalledWith(
      'Docs successfully generated!'
    );
  });

  it('should log error when files generation fails', () => {
    webpackMock.response = 'some error';
    docsGeneratorService.init('/client');
    expect(console.log).toHaveBeenCalledWith(
      'Ops! Something went wrong...',
      'some error'
    );
  });
});
