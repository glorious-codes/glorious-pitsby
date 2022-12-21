const chokidar = require('chokidar');
const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const argsService = require('./args');
const externalAssetsGenerator = require('./external-assets-generator');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const logger = require('./logger');
const processService = require('./process');
const watchService = require('./watch');

describe('Watch Service', () => {
  function stubWatcher(){
    const evtHandler = {};
    const chokidarInstance = {
      on: jest.fn((evtType, cb) => evtHandler[evtType] = cb)
    };
    chokidar.watch = jest.fn(() => chokidarInstance);
    return { simulateEvent: (evtType, params) => evtHandler[evtType](params) };
  }

  beforeEach(() => {
    argsService.getCliArgs = jest.fn();
    externalComponentsDataGenerator.buildComponentsDataByProject = jest.fn(
      (project, onSuccess) => onSuccess()
    );
    externalAssetsGenerator.copySingleFile = jest.fn(
      (filepath, config, onSuccess) => onSuccess()
    );
    logger.msg = jest.fn();
    processService.getCwd = () => '/client';
    stubWatcher();
  });

  it('should watch files according to config file', () => {
    const config = buildPitsbyConfigMock();
    config.styles.push({ href: './dist/any-other.css', rel: 'prefetch', as: 'style' });
    config.scripts.push({ src: './dist/es6/components.js', type: 'module' });
    watchService.init(config);
    expect(chokidar.watch).toHaveBeenCalledWith(
      [
        './src/vue/**/*.doc.js',
        './src/angular/**/*.doc.js',
        './dist/styles.css',
        './dist/any-other.css',
        'dist/bundle.js',
        './dist/es6/components.js',
        './images/'
      ],
      {
        cwd: '/client'
      }
    );
  });

  it('should not watch files if no projects/assets have been found on config file', () => {
    watchService.init();
    expect(chokidar.watch).not.toHaveBeenCalled();
  });

  it('should log file watching', () => {
    watchService.init(buildPitsbyConfigMock());
    expect(logger.msg).toHaveBeenCalledWith('Watching for changes...');
  });

  it('should regenerate external components data if any doc.js file change', () => {
    const watcherStub = stubWatcher();
    const config = buildPitsbyConfigMock();
    watchService.init(config);
    watcherStub.simulateEvent('change', 'src/vue/alert/alert.doc.js');
    expect(logger.msg).toHaveBeenCalledWith('alert.doc.js changed...');
    expect(externalComponentsDataGenerator.buildComponentsDataByProject).toHaveBeenCalledWith(
      config.projects.find(project => project.engine == 'vue'),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('should log success on documentation update success', () => {
    const watcherStub = stubWatcher();
    watchService.init(buildPitsbyConfigMock());
    watcherStub.simulateEvent('change', 'src/vue/alert/alert.doc.js');
    expect(logger.msg).toHaveBeenCalledWith('Docs updated!', { theme: 'success' });
  });

  it('should log error on documentation update error', () => {
    const errMock = 'Some error';
    const watcherStub = stubWatcher();
    externalComponentsDataGenerator.buildComponentsDataByProject = jest.fn(
      (project, onSuccess, onError) => onError(errMock)
    );
    watchService.init(buildPitsbyConfigMock());
    watcherStub.simulateEvent('change', 'src/vue/alert/alert.doc.js');
    expect(logger.msg).toHaveBeenCalledWith(errMock, { theme: 'error' });
  });

  it('should not regenerate external components data if doc.js file does not relates to any project', () => {
    const watcherStub = stubWatcher();
    watchService.init(buildPitsbyConfigMock());
    watcherStub.simulateEvent('change', 'src/whatever/alert/alert.doc.js');
    expect(externalComponentsDataGenerator.buildComponentsDataByProject).not.toHaveBeenCalled();
  });

  it('should regenerate external asset if any asset file change', () => {
    const watcherStub = stubWatcher();
    const config = buildPitsbyConfigMock();
    watchService.init(config);
    watcherStub.simulateEvent('change', 'dist/styles.css');
    expect(externalAssetsGenerator.copySingleFile).toHaveBeenCalledWith(
      'dist/styles.css',
      config,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('should log success on asset update success', () => {
    const watcherStub = stubWatcher();
    watchService.init(buildPitsbyConfigMock());
    watcherStub.simulateEvent('change', 'dist/styles.css');
    expect(logger.msg).toHaveBeenCalledWith('Asset updated!', { theme: 'success' });
  });

  it('should log success on asset update success', () => {
    const errMock = 'Some error';
    const watcherStub = stubWatcher();
    externalAssetsGenerator.copySingleFile = jest.fn(
      (filepath, config, onSuccess, onError) => onError(errMock)
    );
    watchService.init(buildPitsbyConfigMock());
    watcherStub.simulateEvent('change', 'dist/styles.css');
    expect(logger.msg).toHaveBeenCalledWith(errMock, { theme: 'error' });
  });
});
