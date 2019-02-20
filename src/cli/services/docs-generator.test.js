const path = require('path');
const webpack = require('webpack');
const Server = require('webpack-dev-server');
const argsService = require('./args');
const processService = require('./process');
const { fileService } = require('./file');
const docsGeneratorService = require('./docs-generator');
const serverListenMock = jest.fn();
const webpackMock = {
  response: ''
};

jest.mock('webpack');
webpack.mockImplementation((config, onComplete) => {
  return onComplete ?onComplete(webpackMock.response) : {};
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

  it('should compile files to a custom directory', () => {
    docsGeneratorService.init('/client', './docs');
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: [],
      output: {
        path: '/client/docs'
      }
    });
  });

  it('should compile files to pitsby directory if no output directory has been given', () => {
    docsGeneratorService.init('/client');
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: [],
      output: {
        path: '/client/pitsby'
      }
    });
  });

  it('should remove webapp external directories on docs generation finish', () => {
    const webappBasePath = path.join(__dirname, '../../webpapp');
    docsGeneratorService.init('/client');
    expect(fileService.remove).toHaveBeenCalledWith(`${webappBasePath}/data`);
    expect(fileService.remove).toHaveBeenCalledWith(`${webappBasePath}/external`);
  });

  it('should log success on successfully generate files', () => {
    console.log = jest.fn();
    docsGeneratorService.init('/client').then(() => {
      expect(console.log).toHaveBeenCalledWith('Docs successfully generated!');
    });
  });

  it('should serve generated docs if "watch" flag has been provided', () => {
    argsService.getCliArgs = jest.fn(param => {
      return param == '--watch';
    });
    docsGeneratorService.init('/client');
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: ['webpack-dev-server/client?http://localhost:7000/'],
      output: {
        path: '/client/pitsby'
      },
      devServer: { contentBase: '/client/pitsby', host: '0.0.0.0', hot: true }
    });
    expect(typeof Server.mock.calls[0][0]).toEqual('object');
    expect(serverListenMock).toHaveBeenCalledWith(7000);
  });

  it('should log error when files generation fails', () => {
    webpackMock.response = 'some error';
    docsGeneratorService.init('/client').then(() => {}, err => {
      expect(err).toEqual('some error');
    });
  });
});
