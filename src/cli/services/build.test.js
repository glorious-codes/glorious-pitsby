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
    externalComponentsDataGenerator.init = jest.fn();
    externalAssetsGenerator.init = jest.fn();
    webappHtmlIndexGenerator.init = jest.fn();
    webappIndexGenerator.init = jest.fn();
    docsGenerator.init = jest.fn();
    fileService.readJSONSync = jest.fn(() => mockPitsbyConfig());
  });

  it('should generate data for external components', () => {
    mockPromiseAll('success');
    buildService.init();
    expect(externalComponentsDataGenerator.init).toHaveBeenCalledWith(
      process.cwd(),
      './src/angular'
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
    mockPromiseAll('success');
    buildService.init();
    expect(webappHtmlIndexGenerator.init).toHaveBeenCalledWith({
      styles: ['./dist/styles.css'],
      scripts: ['./dist/bundle.js'],
      other: ['./images/']
    });
  });

  it('should log error if external files generation fails', () => {
    console.log = jest.fn();
    mockPromiseAll('error', {err: 'err'});
    buildService.init();
    expect(console.log).toHaveBeenCalledWith('err');
  });

  it('should generate webapp javascript index', () => {
    mockPromiseAll('success');
    buildService.init();
    expect(webappIndexGenerator.init).toHaveBeenCalledWith('external');
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
