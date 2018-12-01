const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const webappIndexGenerator = require('./webapp-index-generator');
const docsGenerator = require('./docs-generator');
const { fileService } = require('./file');
const buildService = require('./build');

describe('Build Service', () => {
  function mockPitsbyConfig(){
    return {
      collectFrom: './src/angular',
      moduleName: 'external',
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js'],
      outputDirectory: './docs'
    };
  }

  function mockPromiseAll(){
    Promise.all = jest.fn(() => {
      return {
        then: function(onSuccess){
          onSuccess();
        }
      };
    });
  }

  beforeEach(() => {
    externalComponentsDataGenerator.init = jest.fn();
    externalAssetsGenerator.init = jest.fn();
    webappHtmlIndexGenerator.init = jest.fn();
    webappIndexGenerator.init = jest.fn();
    docsGenerator.init = jest.fn();
    fileService.readJSONSync = jest.fn(() => mockPitsbyConfig());
  });

  it('should generate data for external components', () => {
    buildService.init();
    expect(externalComponentsDataGenerator.init).toHaveBeenCalledWith(
      process.cwd(),
      './src/angular'
    );
  });

  it('should generate external assets', () => {
    buildService.init();
    expect(externalAssetsGenerator.init).toHaveBeenCalledWith(
      process.cwd(), {
        styles: ['./dist/styles.css'],
        scripts: ['./dist/bundle.js']
      });
  });

  it('should generate webapp html index', () => {
    mockPromiseAll();
    buildService.init();
    expect(webappHtmlIndexGenerator.init).toHaveBeenCalledWith({
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js']
    });
  });

  it('should generate webapp javascript index', () => {
    buildService.init();
    expect(webappIndexGenerator.init).toHaveBeenCalledWith('external');
  });

  it('should generate docs', () => {
    buildService.init();
    expect(docsGenerator.init).toHaveBeenCalledWith(
      process.cwd(),
      './docs'
    );
  });
});
