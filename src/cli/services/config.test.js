const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const { fileService } = require('./file');
const configService = require('./config');
const processService = require('./process');

describe('Config Service', () => {

  function stubFileRequire(filename, data){
    fileService.require = jest.fn(param => {
      if(param === `${processService.getCwd()}/${filename}`) return data;
      throw 'File not found';
    });
  }

  beforeEach(() => {
    processService.getCwd = () => '/client';
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('should be able to get config from pitsby.config.js file', () => {
    const filename = 'pitsby.config.js';
    const config = buildPitsbyConfigMock();
    stubFileRequire(filename, config);
    expect(configService.get()).toEqual({ ...config, filename });
  });

  it('should be able to get config from pitsby.js file', () => {
    const filename = 'pitsby.js';
    const config = buildPitsbyConfigMock();
    stubFileRequire(filename, config);
    expect(configService.get()).toEqual({ ...config, filename });
  });

  it('should log a deprecation warning if config file has been named as pitsby.js', () => {
    const filename = 'pitsby.js';
    const warning = `${filename} is deprecated. Prefer to use pitsby.config.js as config filename.`;
    const config = buildPitsbyConfigMock();
    stubFileRequire(filename, config);
    configService.get();
    expect(console.warn).toHaveBeenCalledWith(warning);
  });

  it('should be able to get config from pitsby.json file', () => {
    const filename = 'pitsby.json';
    const config = buildPitsbyConfigMock();
    stubFileRequire(filename, config);
    expect(configService.get()).toEqual({ ...config, filename });
  });

  it('should log a deprecation warning if config file has been named as pitsby.json', () => {
    const filename = 'pitsby.json';
    const warning = `${filename} is deprecated. Prefer to use pitsby.config.js as config filename.`;
    const config = buildPitsbyConfigMock();
    stubFileRequire(filename, config);
    configService.get();
    expect(console.warn).toHaveBeenCalledWith(warning);
  });

  it('should log error if no config file has been found', () => {
    const err = 'No pitsby.config.js has been found.';
    stubFileRequire();
    configService.get();
    expect(console.error).toHaveBeenCalledWith(err);
  });

  it('should normalize config attributes when angular config is outside projects', () => {
    const config = {
      ...buildPitsbyConfigMock(),
      projects: buildPitsbyConfigMock().projects.filter(project => project.engine != 'angular'),
      collectFrom: './src/angular',
      moduleName: 'my-components',
    };
    stubFileRequire('pitsby.config.js', config);
    expect(configService.get().projects).toEqual([
      { engine: 'vue', collectDocsFrom: './src/vue' },
      { engine: 'angular', collectDocsFrom: './src/angular', moduleName: 'my-components' }
    ]);
  });

  it('should create projects attribute when config has no projects attribute', () => {
    const config = {
      ...buildPitsbyConfigMock(),
      projects: buildPitsbyConfigMock().projects.filter(project => project.engine != 'angular'),
      collectFrom: './src/angular',
      moduleName: 'my-components',
    };
    delete config.projects;
    stubFileRequire('pitsby.config.js', config);
    expect(configService.get().projects).toEqual([
      { engine: 'angular', collectDocsFrom: './src/angular', moduleName: 'my-components' }
    ]);
  });

  it('should normalize project engine case', () => {
    const config = buildPitsbyConfigMock();
    config.projects[0].engine = 'Vue';
    stubFileRequire('pitsby.config.js', config);
    expect(configService.get().projects[0].engine).toEqual('vue');
  });
});
