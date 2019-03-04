const webpack = require('webpack');
const Server = require('webpack-dev-server');
const argsService = require('./args');
const processService = require('./process');
const { fileService } = require('./file');
const docsGeneratorService = require('./docs-generator');
const serverListenMock = jest.fn((port, host, onSuccess) => onSuccess());
const compilerObjectMock = {};
const webpackMock = {
  response: ''
};

jest.mock('webpack');
webpack.mockImplementation((config, onComplete) => {
  if(onComplete)
    onComplete(webpackMock.response);
  return compilerObjectMock;
});

jest.mock('webpack-dev-server');
Server.mockImplementation(() => {
  return { listen: serverListenMock };
});

describe('Docs Generator Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
    fileService.require = jest.fn(() => {
      return { entry: [], output: {} };
    });
    fileService.remove = jest.fn();
    argsService.getCliArgs = jest.fn();
  });

  afterEach(() => {
    webpackMock.response = null;
    webpack.mockClear();
    Server.mockClear();
    processService.setNodeEnv = jest.fn();
  });

  it('should log files generation start', () => {
    docsGeneratorService.init('/client');
    expect(console.log).toHaveBeenCalledWith('Generating docs...');
  });

  it('should output compiled files to a custom directory', () => {
    docsGeneratorService.init('/client', './docs');
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: [],
      output: {
        path: '/client/docs'
      }
    });
  });

  it('should output compiled files to pitsby directory if no output directory has been given', () => {
    docsGeneratorService.init('/client');
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: [],
      output: {
        path: '/client/pitsby'
      }
    });
  });

  it('should log success on successfully generate files', () => {
    console.log = jest.fn();
    docsGeneratorService.init('/client').then(() => {
      expect(console.log).toHaveBeenCalledWith('Docs successfully generated!');
    });
  });

  it('should serve generated docs if "watch" flag has been provided', () => {
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    docsGeneratorService.init('/client');
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: ['webpack-dev-server/client?http://localhost:7000/'],
      output: {
        path: '/client/pitsby'
      }
    });
    expect(Server).toHaveBeenCalledWith(compilerObjectMock, {
      contentBase: '/client/pitsby',
      clientLogLevel: 'none',
      host: '0.0.0.0',
      progress: true,
      quiet: true
    });
    expect(serverListenMock.mock.calls[0][0]).toEqual(7000);
    expect(serverListenMock.mock.calls[0][1]).toEqual('localhost');
    expect(typeof serverListenMock.mock.calls[0][2]).toEqual('function');
  });

  it('should log succes on serve generated documentation on serve success', () => {
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    docsGeneratorService.init('/client').then(() => {
      const message = 'Documentation successfully served on http://localhost:7000';
      expect(console.log).toHaveBeenCalledWith(message);
    });
  });

  it('should log error when files generation fails', () => {
    webpackMock.response = 'some error';
    docsGeneratorService.init('/client').then(() => {}, err => {
      expect(err).toEqual('some error');
    });
  });
});
