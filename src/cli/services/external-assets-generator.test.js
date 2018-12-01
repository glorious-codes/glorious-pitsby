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
    fileService.read = jest.fn((filepath, onSuccess) => onSuccess('some content'));
    fileService.write = jest.fn();
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

  it('should write external styles in webapp external directory', () => {
    externalAssetsGenerator.init('/client', mockExternalAssets());
    const webappExternalDirectory = getWebappExternalDirectory();
    expect(fileService.write).toHaveBeenCalledWith(
      `${webappExternalDirectory}/css/vendors.css`, 'some content'
    );
    expect(fileService.write).toHaveBeenCalledWith(
      `${webappExternalDirectory}/css/main.css`, 'some content'
    );
  });

  it('should write external scripts in webapp external directory', () => {
    externalAssetsGenerator.init('/client', mockExternalAssets());
    const webappExternalDirectory = getWebappExternalDirectory();
    expect(fileService.write).toHaveBeenCalledWith(
      `${webappExternalDirectory}/scripts/base.js`, 'some content'
    );
    expect(fileService.write).toHaveBeenCalledWith(
      `${webappExternalDirectory}/scripts/components.js`, 'some content'
    );
  });
});
