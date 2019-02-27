const fs = require('fs');
const fsextra = require('fs-extra');
const glob = require('glob');
// const writefile = require('writefile');
const fileSystem = require('file-system');
const { FileService, fileService } = require('./file');

describe('File Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should use raw fs if no fs has been given', () => {
    const fileService = new FileService();
    expect(fileService.fs).toEqual(fs);
  });

  it('should use raw fsextra if no fsextra has been given', () => {
    const fileService = new FileService();
    expect(fileService.fsextra).toEqual(fsextra);
  });

  it('should use raw glob if no glob has been given', () => {
    const fileService = new FileService();
    expect(fileService.glob).toEqual(glob);
  });

  it('should use raw fileSystem if no fileSystem has been given', () => {
    const fileService = new FileService();
    expect(fileService.fileSystem).toEqual(fileSystem);
  });

  it('should use raw require if no require has been given', () => {
    const fileService = new FileService();
    expect(fileService.req.cache).toEqual(require.cache);
  });

  it('should require a file', () => {
    const requireMock = jest.fn();
    const filepath = './test.json';
    const fileService = new FileService({
      req: requireMock
    });
    fileService.require(filepath);
    expect(requireMock).toHaveBeenCalledWith(filepath);
  });

  it('should read file async', () => {
    const filepath = './test.js';
    const onSuccess = jest.fn();
    const dataMock = 'content';
    const fsMock = { readFile: jest.fn((filepath, callback) => callback(null, dataMock)) };
    const fileService = new FileService({
      fs: fsMock
    });
    fileService.read(filepath, onSuccess);
    expect(fsMock.readFile.mock.calls[0][0]).toEqual(filepath);
    expect(onSuccess).toHaveBeenCalledWith(dataMock);
  });

  it('should log error when read file async fails', () => {
    const filepath = './test.js';
    const errorMock = {some: 'error'};
    const fsMock = { readFile: jest.fn((filepath, callback) => callback(errorMock)) };
    const fileService = new FileService({
      fs: fsMock
    });
    fileService.read(filepath);
    expect(console.log).toHaveBeenCalledWith('Failed to read ./test.js', errorMock);
  });

  it('should read file sync', () => {
    const fsMock = { readFileSync: jest.fn() };
    const fileService = new FileService({
      fs: fsMock
    });
    const filepath = './test.json';
    fileService.readSync(filepath);
    expect(fsMock.readFileSync).toHaveBeenCalledWith(filepath, 'utf-8');
  });

  it('should read JSON sync', () => {
    const dataMock = JSON.stringify({a:1});
    const fsMock = { readFileSync: jest.fn(() => dataMock) };
    const fileService = new FileService({
      fs: fsMock
    });
    const filepath = './test.json';
    const file = fileService.readJSONSync(filepath);
    expect(file).toEqual({a:1});
  });

  it('should remove a directory/file', () => {
    const path = '/some/path/to/directory/or/file';
    const fsextraMock = {remove: jest.fn()};
    const fileService = new FileService({
      fsextra: fsextraMock
    });
    fileService.remove(path);
    expect(fileService.fsextra.remove).toHaveBeenCalledWith(path);
  });

  it('should collect files that respect some pattern', () => {
    const successCallback = jest.fn();
    const filesMock = ['./test.json'];
    const globMock = jest.fn((pattern, callback) => callback(null, filesMock));
    const fileService = new FileService({
      glob: globMock
    });
    fileService.collect('**/*.json', successCallback);
    expect(globMock.mock.calls[0][0]).toEqual('**/*.json');
    expect(successCallback).toHaveBeenCalledWith(filesMock);
  });

  it('should execute error callback on collect error', () => {
    const errorMock = 'some error';
    const globMock = jest.fn((pattern, callback) => callback(errorMock));
    const onError = jest.fn();
    const fileService = new FileService({
      glob: globMock
    });
    fileService.collect('**/*.json', jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith(errorMock);
  });

  it('should log error on collect error if no error callback has been provided', () => {
    const pattern = '**/*.js';
    const errorMock = {some: 'err'};
    const globMock = jest.fn((pattern, callback) => callback(errorMock));
    const fileService = new FileService({
      glob: globMock
    });
    fileService.collect(pattern);
    expect(console.log).toHaveBeenCalledWith('Failed to collect **/*.js files', errorMock);
  });

  it('should copy files', () => {
    const fsextraMock = {copy: jest.fn((source, destination, callback) => callback())};
    const onSuccess = jest.fn();
    const fileService = new FileService({
      fsextra: fsextraMock
    });
    fileService.copy('source/file.js', 'dest/file.js', onSuccess);
    expect(fileService.fsextra.copy.mock.calls[0][0]).toEqual('source/file.js');
    expect(fileService.fsextra.copy.mock.calls[0][1]).toEqual('dest/file.js');
    expect(typeof fileService.fsextra.copy.mock.calls[0][2]).toEqual('function');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should execute error callback on copy error', () => {
    const fsextraMock = {copy: jest.fn((source, destination, callback) => callback('error'))};
    const onError = jest.fn();
    const fileService = new FileService({
      fsextra: fsextraMock
    });
    fileService.copy('/source/file', '/dest/file', jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith('error');
  });

  it('should log error on copy error if no error callback has been provided', () => {
    const fsextraMock = {copy: jest.fn((source, destination, callback) => callback('error'))};
    const fileService = new FileService({
      fsextra: fsextraMock
    });
    fileService.copy('source/file.js', 'dest/file.js', jest.fn());
    expect(console.log).toHaveBeenCalledWith('Failed to copy source/file.js', 'error');
  });

  it('should write some file', () => {
    const fileSystemMock = { writeFile: jest.fn() };
    const filepath = './some/path/to/file.js';
    const data = 'some data';
    const fileService = new FileService({
      fileSystem: fileSystemMock
    });
    fileService.write(filepath, data);
    expect(fileSystemMock.writeFile.mock.calls[0][0]).toEqual(filepath);
    expect(fileSystemMock.writeFile.mock.calls[0][1]).toEqual(data);
    expect(typeof fileSystemMock.writeFile.mock.calls[0][2]).toEqual('function');
  });

  it('should execute success callback on write file success if callback has been provided', () => {
    const fileSystemMock = { writeFile: jest.fn((filepath, data, onComplete) => {
      onComplete();
    }) };
    const onSuccess = jest.fn();
    const fileService = new FileService({
      fileSystem: fileSystemMock
    });
    fileService.write('./some/path/to/file.js', 'some data', onSuccess);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should execute error callback on write file error', () => {
    const errorMock = 'some error';
    const fileSystemMock = { writeFile: jest.fn((filepath, data, onComplete) => {
      onComplete(errorMock);
    }) };
    const onError = jest.fn();
    const fileService = new FileService({
      fileSystem: fileSystemMock
    });
    fileService.write('./some/path/to/file.js', 'some data', jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith(errorMock);
  });

  it('should log error on write file error if no error callback has been provided', () => {
    const errorMock = 'some error';
    const fileSystemMock = { writeFile: jest.fn((filepath, data, onComplete) => {
      onComplete(errorMock);
    }) };
    const fileService = new FileService({
      fileSystem: fileSystemMock
    });
    console.log = jest.fn();
    fileService.write('./path/to/file.js', 'some data');
    expect(console.log).toHaveBeenCalledWith('Failed to write ./path/to/file.js', errorMock);
  });

  it('should export a singleton', () => {
    expect(fileService instanceof FileService).toEqual(true);
  });
});
