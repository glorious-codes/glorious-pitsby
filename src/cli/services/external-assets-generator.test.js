const { buildPitsbyConfigMock } = require('../mocks/pitsby-config');
const { fileService } = require('./file');
const processService = require('./process');
const externalAssetsGenerator = require('./external-assets-generator');

describe('External Assets Generator', () => {
  function mockConfig(customConfig){
    return { ...buildPitsbyConfigMock(), ...customConfig };
  }

  beforeEach(() => {
    console.log = jest.fn();
    fileService.copy = jest.fn((source, dest, onSuccess) => onSuccess());
    processService.getCwd = jest.fn(() => '/client');
  });

  it('should copy external styles to webapp external directory if external styles has been given', done => {
    const config = mockConfig({
      styles: ['./dist/vendors.css', 'dist/main.css', 'https://some.cdn/styles.css'],
      scripts: [],
      other: [],
    });
    externalAssetsGenerator.init(config).then(() => {
      expect(fileService.copy).toHaveBeenCalledWith(
        '/client/dist/vendors.css',
        '/client/docs/external/dist/vendors.css',
        expect.any(Function),
        expect.any(Function)
      );
      expect(fileService.copy).toHaveBeenCalledWith(
        '/client/dist/main.css',
        '/client/docs/external/dist/main.css',
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should copy external scripts to webapp external directory if external scripts has been given', done => {
    const config = mockConfig({
      styles: [],
      scripts: ['./dist/scripts/base.js', 'dist/scripts/components.js', 'http://some.cdn/script.js'],
      other: [],
    });
    externalAssetsGenerator.init(config).then(() => {
      expect(fileService.copy).toHaveBeenCalledWith(
        '/client/dist/scripts/base.js',
        '/client/docs/external/dist/scripts/base.js',
        expect.any(Function),
        expect.any(Function)
      );
      expect(fileService.copy).toHaveBeenCalledWith(
        '/client/dist/scripts/components.js',
        '/client/docs/external/dist/scripts/components.js',
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should copy other external resources to webapp external directory if other external resources have been given', done => {
    const config = mockConfig({
      styles: [],
      scripts: [],
      other: ['./images/', './other/specific.png'],
    });
    externalAssetsGenerator.init(config).then(() => {
      expect(fileService.copy).toHaveBeenCalledWith(
        '/client/images/',
        '/client/docs/external/images/',
        expect.any(Function),
        expect.any(Function)
      );
      expect(fileService.copy).toHaveBeenCalledWith(
        '/client/other/specific.png',
        '/client/docs/external/other/specific.png',
        expect.any(Function),
        expect.any(Function)
      );
      done();
    });
  });

  it('should log error on copy error', () => {
    const errMock = 'some error';
    const config = mockConfig({ other: ['./images/', './other/specific.png'] });
    fileService.copy = jest.fn((source, dest, onSuccess, onError) => onError(errMock));
    externalAssetsGenerator.init(config).then(() => {}, err => {
      expect(err).toEqual(errMock);
      expect(console.log).toHaveBeenCalledWith(errMock);
    });
  });
});
