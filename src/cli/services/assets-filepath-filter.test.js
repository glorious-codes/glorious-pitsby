const assetsFilepathFilter = require('./assets-filepath-filter');

describe('Assets Filepath Filter', () => {
  it('should filter relative paths', () => {
    const paths = [
      '/some/relative/root/path',
      'some/relative/path',
      'http://not.relative.com/path'
    ];
    expect(assetsFilepathFilter.getRelative(paths)).toEqual([
      '/some/relative/root/path',
      'some/relative/path'
    ]);
  });

  it('should respond with no result if no paths have been given', () => {
    expect(assetsFilepathFilter.getRelative()).toEqual([]);
  });

  it('should identify a relative path', () => {
    expect(assetsFilepathFilter.isRelativePath('/root/relative/path')).toEqual(true);
    expect(assetsFilepathFilter.isRelativePath('relative/path')).toEqual(true);
  });

  it('shoud identify a non relative path', () => {
    expect(assetsFilepathFilter.isRelativePath('http://not.relative.com/path')).toEqual(false);
  });
});
