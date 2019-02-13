const webpackConfigBuilder = require('../../../webpack.conf.builder.js');
const docsGeneratorService = require('./docs-generator');
const bundler = require('./bundler');

describe('Docs Generator Service', () => {
  function stubBundler(response){
    bundler.compile = jest.fn((config, onComplete) => onComplete(response));
  }

  beforeEach(() => {
    console.log = jest.fn();
    webpackConfigBuilder.build = jest.fn(() => {
      return {};
    });
    stubBundler();
  });

  it('should log files generation start', () => {
    docsGeneratorService.init('/client');
    expect(console.log).toHaveBeenCalledWith('Generating docs...');
  });

  it('should compile files to a custom directory', () => {
    docsGeneratorService.init('/client', './docs');
    expect(bundler.compile.mock.calls[0][0]).toEqual({
      output: {
        path: '/client/docs'
      }
    });
  });

  it('should compile files to pitsby directory if no output directory has been given', () => {
    docsGeneratorService.init('/client');
    expect(bundler.compile.mock.calls[0][0]).toEqual({
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
    stubBundler('some error');
    docsGeneratorService.init('/client');
    expect(console.log).toHaveBeenCalledWith(
      'Ops! Something went wrong...',
      'some error'
    );
  });
});
