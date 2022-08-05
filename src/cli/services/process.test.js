const processService = require('./process');

describe('Process Service', () => {
  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should get Node environment', () => {
    const env = 'production';
    process.env.NODE_ENV = env;
    expect(processService.getNodeEnv()).toEqual(env);
  });

  it('should respond environment as development if Node environment has not been specified', () => {
    process.env.NODE_ENV = '';
    expect(processService.getNodeEnv()).toEqual('development');
  });

  it('should return the current working directory', () => {
    expect(processService.getCwd()).toEqual(process.cwd());
  });
});
