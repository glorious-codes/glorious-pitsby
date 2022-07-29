const webpack = require('webpack');
const Server = require('webpack-dev-server');
const argsService = require('./args');
const processService = require('./process');
const { fileService } = require('./file');
const docsGeneratorService = require('./docs-generator');
const compilerObjectMock = {};
const webpackMock = { response: '' };

jest.mock('webpack');
jest.mock('webpack-dev-server');

describe('Docs Generator Service', () => {
  function mockConfig(){
    return {
      projects: []
    };
  }

  beforeEach(() => {
    console.log = jest.fn();
    fileService.require = jest.fn(() => {
      return { entry: [], output: {}, externals: {} };
    });
    fileService.remove = jest.fn();
    argsService.getCliArgs = jest.fn();
    webpack.mockImplementation((config, onComplete) => {
      if(onComplete) onComplete(webpackMock.response);
      return compilerObjectMock;
    });
    Server.mockImplementation(() => {
      return { startCallback: jest.fn(callback => callback()) };
    });
  });

  afterEach(() => {
    webpackMock.response = null;
    webpack.mockClear();
    processService.setNodeEnv = jest.fn();
  });

  it('should log files generation start', () => {
    docsGeneratorService.init('/client', mockConfig());
    expect(console.log).toHaveBeenCalledWith('Generating docs...');
  });

  it('should output compiled files to a custom directory', () => {
    const config = mockConfig();
    config.outputDirectory = './docs';
    docsGeneratorService.init('/client', config);
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: [],
      output: {
        path: '/client/docs'
      },
      externals: {}
    });
  });

  it('should output compiled files to pitsby directory if no output directory has been given', () => {
    docsGeneratorService.init('/client', mockConfig());
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: [],
      output: {
        path: '/client/pitsby'
      },
      externals: {}
    });
  });

  it('should log success on successfully generate files', () => {
    console.log = jest.fn();
    docsGeneratorService.init('/client', mockConfig()).then(() => {
      expect(console.log).toHaveBeenCalledWith('Docs successfully generated!');
    });
  });

  it('should serve generated docs if "watch" flag has been provided', () => {
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    docsGeneratorService.init('/client', mockConfig());
    expect(webpack).toHaveBeenCalledWith({
      entry: ['webpack-dev-server/client?http://localhost:7000/'],
      output: {
        path: '/client/pitsby'
      },
      externals: {}
    });
    expect(Server).toHaveBeenCalledWith({
      compress: true,
      hot: false,
      host: '0.0.0.0',
      port: 7000,
      static: { directory: '/client/pitsby', watch: true },
      client: { overlay: false }
    }, compilerObjectMock);
  });

  it('should log succes on serve generated documentation on serve success', () => {
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    docsGeneratorService.init('/client', mockConfig()).then(() => {
      const message = 'Documentation successfully served on http://localhost:7000';
      expect(console.log).toHaveBeenCalledWith(message);
    });
  });

  it('should serve files on custom server port if port has been given', () => {
    const params = { '--watch': true, '--port': 5000 };
    argsService.getCliArgs = jest.fn(param => params[param]);
    docsGeneratorService.init('/client', mockConfig()).then(() => {
      const message = 'Documentation successfully served on http://localhost:5000';
      expect(console.log).toHaveBeenCalledWith(message);
    });
    expect(Server).toHaveBeenCalledWith(expect.objectContaining({
      port: 7000
    }), compilerObjectMock);
  });

  it('should define externals in webpack\' configuration', () => {
    const config = mockConfig();
    config.projects = [{
      engine: 'vue',
      importFrom: './dist/my-lib',
      libraryName: 'myComponents'
    }];
    docsGeneratorService.init('/client', config);
    expect(webpack.mock.calls[0][0]).toEqual({
      entry: [],
      output: {
        path: '/client/pitsby'
      },
      externals: {
        '../external/dist/my-lib': 'myComponents'
      }
    });
  });

  it('should log error when files generation fails', () => {
    webpackMock.response = 'some error';
    docsGeneratorService.init('/client', mockConfig()).then(() => {}, err => {
      expect(err).toEqual('some error');
    });
  });
});
