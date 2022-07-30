const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const argsService = require('./args');
const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalMetricsIdsModuleGenerator = require('./external-metrics-ids-module-generator');
const externalProjectsDataGenerator = require('./external-projects-data-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const webappLogoGenerator = require('./webapp-logo-generator');
const docsGenerator = require('./docs-generator');
const configService = require('./config');
const watchService = require('./watch');
const buildService = require('./build');

describe('Build Service', () => {
  function stubFileChange(){
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    watchService.init = jest.fn((files, changeCallback) => {
      changeCallback();
    });
  }

  beforeEach(() => {
    externalAssetsGenerator.init = jest.fn(() => Promise.resolve());
    externalComponentsDataGenerator.init = jest.fn(() => Promise.resolve());
    externalMetricsIdsModuleGenerator.init = jest.fn(() => Promise.resolve());
    externalProjectsDataGenerator.init = jest.fn(() => Promise.resolve());
    webappHtmlIndexGenerator.init = jest.fn(() => Promise.resolve());
    webappIndexGenerator.init = jest.fn(() => Promise.resolve());
    webappLogoGenerator.init = jest.fn(() => Promise.resolve());
    docsGenerator.init = jest.fn(() => Promise.resolve());
    configService.get = jest.fn(() => buildPitsbyConfigMock());
    argsService.getCliArgs = jest.fn();
    watchService.init = jest.fn();
  });

  it('should generate data for external projects', () => {
    const { projects } = buildPitsbyConfigMock();
    buildService.init().then(() => {}, () => {});
    expect(externalProjectsDataGenerator.init).toHaveBeenCalledWith(projects);
  });

  it('should generate data for external components', () => {
    const { projects } = buildPitsbyConfigMock();
    buildService.init().then(() => {}, () => {});
    expect(externalComponentsDataGenerator.init).toHaveBeenCalledWith(projects);
  });

  it('should generate external assets', () => {
    buildService.init().then(() => {}, () => {});
    expect(externalAssetsGenerator.init).toHaveBeenCalledWith(
      process.cwd(), {
        styles: ['./dist/styles.css'],
        scripts: ['./dist/bundle.js'],
        other: ['./images/']
      });
  });

  it('should generate external metrics ids module', () => {
    buildService.init().then(() => {}, () => {});
    expect(externalMetricsIdsModuleGenerator.init).toHaveBeenCalledWith({
      googleAnalyticsId: '123'
    });
  });

  it('should generate webapp html index', done => {
    const config = buildPitsbyConfigMock();
    buildService.init().then(() => {
      expect(webappHtmlIndexGenerator.init).toHaveBeenCalledWith(config);
      done();
    });
  });

  it('should generate webapp logo', done => {
    const customAttributes = {};
    configService.get = jest.fn(() => buildPitsbyConfigMock({ custom: customAttributes }));
    buildService.init().then(() => {
      expect(webappLogoGenerator.init).toHaveBeenCalledWith(customAttributes);
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
      expect(docsGenerator.init).toHaveBeenCalledWith(
        process.cwd(),
        buildPitsbyConfigMock()
      );
      done();
    });
  });

  it('should not generate docs if webapp indexes generation fails', () => {
    webappHtmlIndexGenerator.init = jest.fn(() => Promise.reject('some error'));
    buildService.init().then(() => {}, () => {
      expect(docsGenerator.init).not.toHaveBeenCalled();
    });
  });

  it('should watch for external assets changes if "watch" flag has been provided', () => {
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    const configFilepath = `${process.cwd()}/pitsby.config.js`;
    const docsFileGlob = `${process.cwd()}/**/*.doc.js`;
    buildService.init().then(() => {
      expect(watchService.init.mock.calls[0][0]).toEqual([
        configFilepath, docsFileGlob, './dist/styles.css', './dist/bundle.js', './images/'
      ]);
      expect(typeof watchService.init.mock.calls[0][1]).toEqual('function');
    });
  });

  it('should not pass undefined external assets attributes to watch service', () => {
    const config = buildPitsbyConfigMock();
    config.other = undefined;
    configService.get = jest.fn(() => config);
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    const configFilepath = `${process.cwd()}/pitsby.config.js`;
    const docsFileGlob = `${process.cwd()}/**/*.doc.js`;
    buildService.init().then(() => {
      expect(watchService.init.mock.calls[0][0]).toEqual([
        configFilepath, docsFileGlob, './dist/styles.css', './dist/bundle.js'
      ]);
    });
  });

  it('should not generate documentation if build is already watching docs changes', () => {
    console.log = jest.fn();
    stubFileChange();
    buildService.init().then(() => {
      expect(docsGenerator.init.mock.calls.length).toEqual(1);
    });
  });

  it('should log documentation update', () => {
    console.log = jest.fn();
    stubFileChange();
    buildService.init().then(() => {
      expect(console.log).toHaveBeenCalledWith('Updating docs...');
    });
  });
});
