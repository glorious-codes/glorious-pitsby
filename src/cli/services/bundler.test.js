const webpack = require('webpack');
const bundler = require('./bundler');

jest.mock('webpack');

describe('Bundler', () => {
  afterEach(() => {
    webpack.mockClear();
  });

  it('should bundle using webpack', () => {
    const configMock = {some: 'config'};
    const onCompleteCallback = jest.fn();
    bundler.compile(configMock, onCompleteCallback);
    expect(webpack).toHaveBeenCalledWith(configMock, onCompleteCallback);
  });
});
