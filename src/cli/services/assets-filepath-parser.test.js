const assetsFilepathParser = require('./assets-filepath-parser');

describe('Assets Filepath Parser', () => {
  it('should parse filepath', () => {
    const paths = [
      '/some/path/to/script.js',
      { src: '/some/path/to/es6.js', type: 'module' },
      { href: './dist/any-other.css', rel: 'prefetch', as: 'style' }
    ];
    expect(assetsFilepathParser.parse(paths[0])).toEqual('/some/path/to/script.js');
    expect(assetsFilepathParser.parse(paths[1])).toEqual('/some/path/to/es6.js');
    expect(assetsFilepathParser.parse(paths[2])).toEqual('./dist/any-other.css');
  });
});
