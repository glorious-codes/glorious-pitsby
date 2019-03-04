const argsService = require('./args');
const externalProjectsDataGenerator = require('./external-projects-data-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalAssetsGenerator = require('./external-assets-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const docsGenerator = require('./docs-generator');
const configService = require('./config');
const watchService = require('./watch');
const buildService = require('./build');

describe('Build Service', () => {
  function mockPitsbyConfig(){
    return {
      projects: [
        { engine: 'angular', collectFrom: './src/angular', moduleName: 'external' }
      ],
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js'],
      other: ['./images/'],
      outputDirectory: './docs'
    };
  }

  function stubFileChange(){
    argsService.getCliArgs = jest.fn(param => param == '--watch');
    watchService.init = jest.fn((files, changeCallback) => {
      changeCallback();
    });
  }

  beforeEach(() => {
    externalProjectsDataGenerator.init = jest.fn(() => Promise.resolve());
    externalComponentsDataGenerator.init = jest.fn(() => Promise.resolve());
    externalAssetsGenerator.init = jest.fn(() => Promise.resolve());
    webappHtmlIndexGenerator.init = jest.fn(() => Promise.resolve());
    webappIndexGenerator.init = jest.fn(() => Promise.resolve());
    docsGenerator.init = jest.fn(() => Promise.resolve());
    configService.get = jest.fn(() => mockPitsbyConfig());
    argsService.getCliArgs = jest.fn();
    watchService.init = jest.fn();
    console.log = jest.fn();
  });

  it('should generate data for external projects', () => {
    const config = mockPitsbyConfig();
    buildService.init().then(() => {}, () => {});
    expect(externalProjectsDataGenerator.init).toHaveBeenCalledWith(config.projects);
  });

  it('should generate data for external components', () => {
    const projectsMock = mockPitsbyConfig().projects;
    buildService.init().then(() => {}, () => {});
    expect(externalComponentsDataGenerator.init).toHaveBeenCalledWith(
      process.cwd(), projectsMock
    );
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

  it('should generate webapp html index', done => {
    const projectsMock = mockPitsbyConfig().projects;
    buildService.init().then(() => {
      expect(webappHtmlIndexGenerator.init).toHaveBeenCalledWith({
        styles: ['./dist/styles.css'],
        scripts: ['./dist/bundle.js'],
        other: ['./images/']
      }, projectsMock);
      done();
    });
  });

  it('should generate webapp javascript index', () => {
    const projectsMock = mockPitsbyConfig().projects;
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
        './docs'
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
    const configFilepath = `${process.cwd()}/pitsby.js`;
    const docsFileGlob = `${process.cwd()}/**/*.doc.js`;
    buildService.init().then(() => {
      expect(watchService.init.mock.calls[0][0]).toEqual([
        configFilepath, docsFileGlob, './dist/styles.css', './dist/bundle.js', './images/'
      ]);
      expect(typeof watchService.init.mock.calls[0][1]).toEqual('function');
    });
  });

  it('should not generate documentation if build is already watching docs changes', () => {
    stubFileChange();
    buildService.init().then(() => {
      expect(docsGenerator.init.mock.calls.length).toEqual(1);
    });
  });

  it('should log documentation update', () => {
    stubFileChange();
    buildService.init().then(() => {
      expect(console.log).toHaveBeenCalledWith('Updating docs...');
    });
  });
});
