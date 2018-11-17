// const fileService = require('./file');
const externalAssetsGenerator = require('./services/external-assets-generator');
const externalComponentsDataGenerator = require('./services/external-components-data-generator');
const webappHtmlIndexGenerator = require('./services/webapp-html-index-generator');
const webappIndexGenerator = require('./services/webapp-index-generator');
const { fileService } = require('./services/file');
let cliIndex;

describe('CLI Index', () => {
  function mockPitsbyConfig(){
    return {
      collectFrom: './src/angular',
      moduleName: 'exeternal',
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js']
    };
  }

  beforeEach(() => {
    externalComponentsDataGenerator.init = jest.fn();
    externalAssetsGenerator.init = jest.fn();
    webappHtmlIndexGenerator.init = jest.fn();
    webappIndexGenerator.init = jest.fn();
    fileService.readJSONSync = jest.fn(() => mockPitsbyConfig());
    cliIndex = require('./index');
  });

  it('should generate data for external components', () => {
    cliIndex.init();
    expect(externalComponentsDataGenerator.init).toHaveBeenCalledWith(
      process.cwd(),
      './src/angular'
    );
  });

  it('should generate external assets', () => {
    cliIndex.init();
    expect(externalAssetsGenerator.init).toHaveBeenCalledWith(
      process.cwd(), {
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js']
    });
  });

  it('should generate webapp html index', () => {
    cliIndex.init();
    expect(webappHtmlIndexGenerator.init).toHaveBeenCalledWith(
      process.cwd(), {
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js']
    });
  });

  it('should generate webapp javascript index', () => {
    cliIndex.init();
    expect(webappIndexGenerator.init).toHaveBeenCalledWith(
      process.cwd(),
      'exeternal'
    );
  });
});
