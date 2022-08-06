const liveServer = require('live-server');
const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const argsService = require('./args');
const configService = require('./config');
const docsGenerator = require('./docs-generator');
const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalGlobalDataGenerator = require('./external-global-data');
const logger = require('./logger');
const processService = require('./process');
const watchService = require('./watch');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const buildService = require('./build');

describe('Build Service', () => {
  beforeEach(() => {
    liveServer.start = jest.fn();
    argsService.getCliArgs = jest.fn();
    configService.get = jest.fn(() => buildPitsbyConfigMock());
    docsGenerator.init = jest.fn(() => Promise.resolve());
    externalAssetsGenerator.init = jest.fn(() => Promise.resolve());
    externalComponentsDataGenerator.init = jest.fn(() => Promise.resolve());
    externalGlobalDataGenerator.init = jest.fn(() => Promise.resolve());
    logger.msg = jest.fn();
    processService.getCwd = jest.fn(() => '/client');
    watchService.init = jest.fn();
    webappHtmlIndexGenerator.init = jest.fn(() => Promise.resolve());
    webappIndexGenerator.init = jest.fn(() => Promise.resolve());
    watchService.init = jest.fn();
  });

  it('should generate external assets', () => {
    const config = buildPitsbyConfigMock();
    buildService.init().then(() => {}, () => {});
    expect(externalAssetsGenerator.init).toHaveBeenCalledWith(config);
  });

  it('should generate data for external components data', () => {
    const { projects } = buildPitsbyConfigMock();
    buildService.init().then(() => {}, () => {});
    expect(externalComponentsDataGenerator.init).toHaveBeenCalledWith(projects);
  });

  it('should generate webapp html index', done => {
    const config = buildPitsbyConfigMock();
    buildService.init().then(() => {
      expect(webappHtmlIndexGenerator.init).toHaveBeenCalledWith(config);
      done();
    });
  });

  it('should generate webapp javascript index', () => {
    const projectsMock = buildPitsbyConfigMock().projects;
    buildService.init().then(() => {
      expect(webappIndexGenerator.init).toHaveBeenCalledWith(projectsMock);
    });
  });

  it('should not generate webapp indexes if external files generation fails', () => {
    externalComponentsDataGenerator.init = jest.fn(() => Promise.reject('some error'));
    buildService.init().then(() => {}, () => {
      expect(webappIndexGenerator.init).not.toHaveBeenCalled();
      expect(webappHtmlIndexGenerator.init).not.toHaveBeenCalled();
    });
  });

  it('should generate docs', done => {
    buildService.init().then(() => {
      expect(docsGenerator.init).toHaveBeenCalledWith(buildPitsbyConfigMock());
      done();
    });
  });

  it('should not generate docs if webapp indexes generation fails', () => {
    webappHtmlIndexGenerator.init = jest.fn(() => Promise.reject('some error'));
    buildService.init().then(() => {}, () => {
      expect(docsGenerator.init).not.toHaveBeenCalled();
    });
  });

  it('should serve documentation if "watch" flag has been given', done => {
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    buildService.init().then(() => {
      expect(liveServer.start).toHaveBeenCalledWith({
        port: 7000,
        host: '0.0.0.0',
        root: '/client/docs',
        open: false,
        file: 'index.html',
        noCssInject: true,
        logLevel: 0
      });
      expect(logger.msg).toHaveBeenCalledWith('Docs served on http://localhost:7000');
      done();
    });
  });

  it('should watch file changes if "watch" flag has been given', done => {
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    buildService.init().then(() => {
      expect(watchService.init).toHaveBeenCalledWith(buildPitsbyConfigMock());
      done();
    });
  });
});
