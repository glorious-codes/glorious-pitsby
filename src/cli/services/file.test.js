const fs = require('fs');
const fsextra = require('fs-extra');
const glob = require('glob');
const writefile = require('writefile');
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

  it('should use raw writefile if no writefile has been given', () => {
    const fileService = new FileService();
    expect(fileService.writefile).toEqual(writefile);
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

  it('should log an error if collect fails', () => {
    const pattern = '**/*.js';
    const errorMock = {some: 'err'};
    const globMock = jest.fn((pattern, callback) => callback(errorMock));
    const fileService = new FileService({
      glob: globMock
    });
    fileService.collect(pattern);
    expect(console.log).toHaveBeenCalledWith('Failed to collect **/*.js files!', errorMock);
  });

  it('should copy files', () => {
    const fsextraMock = {copy: jest.fn((source, destination, callback) => callback())};
    const onSuccess = jest.fn();
    const fileService = new FileService({
      fsextra: fsextraMock
    });
    fileService.copy(
      '/some/source/file.js',
      '/some/dest/file.js',
      onSuccess
    );
    expect(fileService.fsextra.copy.mock.calls[0][0]).toEqual('/some/source/file.js');
    expect(fileService.fsextra.copy.mock.calls[0][1]).toEqual('/some/dest/file.js');
    expect(typeof fileService.fsextra.copy.mock.calls[0][2]).toEqual('function');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should log error if copy fails', () => {
    const fsextraMock = {copy: jest.fn((source, destination, callback) => callback('error'))};
    const fileService = new FileService({
      fsextra: fsextraMock
    });
    fileService.copy(
      '/some/source/file.js',
      '/some/dest/file.js',
      jest.fn()
    );
    expect(console.log).toHaveBeenCalledWith('Failed to copy /some/source/file.js!', 'error');
  });

  it('should write some file', () => {
    const writefileMock = jest.fn();
    const filepath = './some/path/to/file.js';
    const data = 'some data';
    const fileService = new FileService({
      writefile: writefileMock
    });
    fileService.write(filepath, data);
    expect(writefileMock).toHaveBeenCalledWith(filepath, data);
  });

  it('should export a singleton', () => {
    expect(fileService instanceof FileService).toEqual(true);
  });
});
