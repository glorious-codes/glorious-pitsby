const externalProjectsDataGenerator = require('./external-projects-data-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const externalAssetsGenerator = require('./external-assets-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const docsGenerator = require('./docs-generator');
const configService = require('./config');
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

  beforeEach(() => {
    externalProjectsDataGenerator.init = jest.fn(() => Promise.resolve());
    externalComponentsDataGenerator.init = jest.fn(() => Promise.resolve());
    externalAssetsGenerator.init = jest.fn(() => Promise.resolve());
    webappHtmlIndexGenerator.init = jest.fn(() => Promise.resolve());
    webappIndexGenerator.init = jest.fn(() => Promise.resolve());
    docsGenerator.init = jest.fn(() => Promise.resolve());
    configService.get = jest.fn(() => mockPitsbyConfig());
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
});
