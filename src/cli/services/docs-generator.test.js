const webpack = require('webpack');
const argsService = require('./args');
const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const processService = require('./process');
const { fileService } = require('./file');
const docsGeneratorService = require('./docs-generator');

jest.mock('webpack');

describe('Docs Generator Service', () => {
  function stubWebpackImplementation(response){
    webpack.mockImplementation((config, onComplete) => onComplete(response));
  }

  beforeEach(() => {
    argsService.getCliArgs = jest.fn();
    console.log = jest.fn();
    fileService.require = jest.fn(filename => {
      if(filename == '../../../webpack.config') return { output: { filename: '[name].js' } };
    });
    processService.getCwd = jest.fn(() => '/client');
    stubWebpackImplementation();
  });

  it('should log files generation start', done => {
    docsGeneratorService.init(buildPitsbyConfigMock()).then(() => {
      expect(console.log).toHaveBeenCalledWith('Generating docs...');
      done();
    });
  });

  it('should output compiled files to a custom directory', done => {
    docsGeneratorService.init(buildPitsbyConfigMock()).then(() => {
      expect(webpack).toHaveBeenCalledWith(expect.objectContaining({
        output: {
          filename: '[name].js',
          path: '/client/docs'
        }
      }), expect.any(Function));
      done();
    });
  });

  it('should log success on successfully generate files', () => {
    docsGeneratorService.init(buildPitsbyConfigMock()).then(() => {
      expect(console.log).toHaveBeenCalledWith('Docs successfully generated!');
    });
  });

  it('should log error when files generation fails', () => {
    const errMock = { response: 'some error' };
    stubWebpackImplementation(errMock);
    docsGeneratorService.init(buildPitsbyConfigMock()).then(() => {}, err => {
      expect(err).toEqual(errMock);
    });
  });
});
