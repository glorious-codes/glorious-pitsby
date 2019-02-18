const path = require('path');
const externalAssetsGenerator = require('./external-assets-generator');
const { fileService } = require('./file');

describe('External Assets Generator', () => {
  function mockExternalAssets(){
    return {
      styles: ['./css/vendors.css', 'css/main.css'],
      scripts: ['scripts/base.js', './scripts/components.js']
    };
  }

  function getWebappExternalDirectory(){
    return path.join(__dirname, '../../webapp/external');
  }

  beforeEach(() => {
    fileService.copy = jest.fn((source, dest, onSuccess) => onSuccess());
    console.log = jest.fn();
  });

  it('should return a promise', () => {
    const promise = externalAssetsGenerator.init('/client', mockExternalAssets());
    expect(promise.then).toBeDefined();
  });

  it('should resolve its promise', done => {
    let count = 0;
    externalAssetsGenerator.init('/client', mockExternalAssets()).then(() => {
      count++;
      expect(count).toEqual(1);
      done();
    });
  });

  it('should copy external styles to webapp external directory if external styles has been given', () => {
    const externalAssets = { styles: ['./css/vendors.css', 'css/main.css'] };
    const webappExternalDirectory = getWebappExternalDirectory();
    externalAssetsGenerator.init('/client', externalAssets);
    expect(fileService.copy.mock.calls[0][0]).toEqual('/client/css/vendors.css');
    expect(fileService.copy.mock.calls[0][1]).toEqual(`${webappExternalDirectory}/css/vendors.css`);
    expect(typeof fileService.copy.mock.calls[0][2]).toEqual('function');
    expect(fileService.copy.mock.calls[1][0]).toEqual('/client/css/main.css');
    expect(fileService.copy.mock.calls[1][1]).toEqual(`${webappExternalDirectory}/css/main.css`);
    expect(typeof fileService.copy.mock.calls[1][2]).toEqual('function');
    expect(typeof fileService.copy.mock.calls[1][3]).toEqual('function');
  });

  it('should copy external scripts to webapp external directory if external scripts has been given', () => {
    const externalAssets = { scripts: ['./scripts/base.js', './scripts/components.js'] };
    const webappExternalDirectory = getWebappExternalDirectory();
    externalAssetsGenerator.init('/client', externalAssets);
    expect(fileService.copy.mock.calls[0][0]).toEqual('/client/scripts/base.js');
    expect(fileService.copy.mock.calls[0][1]).toEqual(`${webappExternalDirectory}/scripts/base.js`);
    expect(typeof fileService.copy.mock.calls[0][2]).toEqual('function');
    expect(fileService.copy.mock.calls[1][0]).toEqual('/client/scripts/components.js');
    expect(fileService.copy.mock.calls[1][1]).toEqual(`${webappExternalDirectory}/scripts/components.js`);
    expect(typeof fileService.copy.mock.calls[1][2]).toEqual('function');
    expect(typeof fileService.copy.mock.calls[1][3]).toEqual('function');
  });

  it('should copy other external resources to webapp external directory if other external resources have been given', () => {
    const externalAssets = { other: ['./images/', './other/specific.png'] };
    const webappExternalDirectory = getWebappExternalDirectory();
    externalAssetsGenerator.init('/client', externalAssets);
    expect(fileService.copy.mock.calls[0][0]).toEqual('/client/images/');
    expect(fileService.copy.mock.calls[0][1]).toEqual(`${webappExternalDirectory}/images/`);
    expect(typeof fileService.copy.mock.calls[0][2]).toEqual('function');
    expect(fileService.copy.mock.calls[1][0]).toEqual('/client/other/specific.png');
    expect(fileService.copy.mock.calls[1][1]).toEqual(`${webappExternalDirectory}/other/specific.png`);
    expect(typeof fileService.copy.mock.calls[1][2]).toEqual('function');
    expect(typeof fileService.copy.mock.calls[1][3]).toEqual('function');
  });

  it('should log error on copy error', () => {
    const externalAssets = { styles: ['./css/vendors.css', 'css/main.css'] };
    fileService.copy = jest.fn((source, dest, onSuccess, onError) => onError('some error'));
    externalAssetsGenerator.init('/client', externalAssets).then(() => {}, err => {
      expect(console.log).toHaveBeenCalledWith(err);
      expect(err).toEqual('some error');
    });
  });
});
