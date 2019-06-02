const { fileService } = require('./file');
const configService = require('./config');

describe('Config Service', () => {
  function buildConfigMock(){
    return {
      projects: [ { engine: 'vue', collectDocsFrom: './src/vue' } ],
      styles: [ './dist/ca-components.css' ],
      scripts: [ './dist/ca-components-vue.js' ],
      other: [ './dist/assets/images/' ]
    };
  }

  function stubFileRequire(filepath, config){
    fileService.require = jest.fn(param => {
      if(param == filepath)
        return config;
      throw 'File not found';
    });
  }

  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('should be able to get config from pitsby.config.js file', () => {
    const config = buildConfigMock();
    const clientDirectory = '/client';
    stubFileRequire(`${clientDirectory}/pitsby.config.js`, config);
    expect(configService.get('/client')).toEqual(config);
  });

  it('should be able to get config from pitsby.js file', () => {
    const config = buildConfigMock();
    const clientDirectory = '/client';
    stubFileRequire(`${clientDirectory}/pitsby.js`, config);
    expect(configService.get('/client')).toEqual(config);
  });

  it('should log a deprecation warning if config file has been named as pitsby.js', () => {
    const warn = 'pitsby.js is deprecated. Prefer to use pitsby.config.js as config filename.';
    const config = buildConfigMock();
    const clientDirectory = '/client';
    stubFileRequire(`${clientDirectory}/pitsby.js`, config);
    configService.get(clientDirectory);
    expect(console.warn).toHaveBeenCalledWith(warn);
  });

  it('should be able to get config from pitsby.json file', () => {
    const config = buildConfigMock();
    const clientDirectory = '/client';
    stubFileRequire(`${clientDirectory}/pitsby.json`, config);
    expect(configService.get('/client')).toEqual(config);
  });

  it('should log a deprecation warning if config file has been named as pitsby.json', () => {
    const warn = 'pitsby.json is deprecated. Prefer to use pitsby.config.js as config filename.';
    const config = buildConfigMock();
    const clientDirectory = '/client';
    stubFileRequire(`${clientDirectory}/pitsby.json`, config);
    configService.get(clientDirectory);
    expect(console.warn).toHaveBeenCalledWith(warn);
  });

  it('should log error if no config file has been found', () => {
    const err = 'No pitsby.config.js has been found.';
    const clientDirectory = '/client/';
    stubFileRequire(clientDirectory);
    configService.get(clientDirectory);
    expect(console.error).toHaveBeenCalledWith(err);
  });

  it('should normalize config attributes when angular config is outside projects', () => {
    const config = buildConfigMock();
    const clientDirectory = '/client';
    config.collectFrom = './src/angular';
    config.moduleName = 'my-components';
    stubFileRequire(`${clientDirectory}/pitsby.config.js`, config);
    expect(configService.get('/client').projects).toEqual([
      { engine: 'vue', collectDocsFrom: './src/vue' },
      { engine: 'angular', collectDocsFrom: './src/angular', moduleName: 'my-components' }
    ]);
  });

  it('should create projects attribute when config has no projects attribute', () => {
    const config = buildConfigMock();
    const clientDirectory = '/client';
    config.collectFrom = './src/angular';
    config.moduleName = 'my-components';
    delete config.projects;
    stubFileRequire(`${clientDirectory}/pitsby.config.js`, config);
    expect(configService.get('/client').projects).toEqual([
      { engine: 'angular', collectDocsFrom: './src/angular', moduleName: 'my-components' }
    ]);
  });

  it('should normalize project engine case', () => {
    const config = buildConfigMock();
    const clientDirectory = '/client';
    config.projects[0].engine = 'Vue';
    stubFileRequire(`${clientDirectory}/pitsby.config.js`, config);
    expect(configService.get('/client').projects[0].engine).toEqual('vue');
  });

  it('should not normalize anything if config has no projects at all', () => {
    const config = buildConfigMock();
    const clientDirectory = '/client';
    delete config.projects;
    stubFileRequire(`${clientDirectory}/pitsby.config.js`, config);
    expect(configService.get('/client')).toEqual(config);
  });
});
