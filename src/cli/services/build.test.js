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

  function mockPromiseAll(responseType, { err } = {}){
    Promise.all = jest.fn(() => {
      return {
        then: function(onSuccess, onError){
          if(responseType == 'success')
            return onSuccess();
          return onError(err);
        }
      };
    });
  }

  beforeEach(() => {
    externalProjectsDataGenerator.init = jest.fn();
    externalComponentsDataGenerator.init = jest.fn();
    externalAssetsGenerator.init = jest.fn();
    webappHtmlIndexGenerator.init = jest.fn();
    webappIndexGenerator.init = jest.fn();
    docsGenerator.init = jest.fn();
    configService.get = jest.fn(() => mockPitsbyConfig());
  });

  it('should generate data for external projects', () => {
    const config = mockPitsbyConfig();
    mockPromiseAll('success');
    buildService.init();
    expect(externalProjectsDataGenerator.init).toHaveBeenCalledWith(config.projects);
  });

  it('should generate data for external components', () => {
    const projectsMock = mockPitsbyConfig().projects;
    mockPromiseAll('success');
    buildService.init();
    expect(externalComponentsDataGenerator.init).toHaveBeenCalledWith(
      process.cwd(), projectsMock
    );
  });

  it('should generate external assets', () => {
    mockPromiseAll('success');
    buildService.init();
    expect(externalAssetsGenerator.init).toHaveBeenCalledWith(
      process.cwd(), {
        styles: ['./dist/styles.css'],
        scripts: ['./dist/bundle.js'],
        other: ['./images/']
      });
  });

  it('should generate webapp html index', () => {
    const projectsMock = mockPitsbyConfig().projects;
    mockPromiseAll('success');
    buildService.init();
    expect(webappHtmlIndexGenerator.init).toHaveBeenCalledWith({
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js'],
      other: ['./images/']
    }, projectsMock);
  });

  it('should log error if external files generation fails', () => {
    console.log = jest.fn();
    mockPromiseAll('error', {err: 'err'});
    buildService.init();
    expect(console.log).toHaveBeenCalledWith('err');
  });

  it('should generate webapp javascript index', () => {
    const projectsMock = mockPitsbyConfig().projects;
    mockPromiseAll('success');
    buildService.init();
    expect(webappIndexGenerator.init).toHaveBeenCalledWith(projectsMock);
  });

  it('should generate docs', () => {
    mockPromiseAll('success');
    buildService.init();
    expect(docsGenerator.init).toHaveBeenCalledWith(
      process.cwd(),
      './docs'
    );
  });
});
