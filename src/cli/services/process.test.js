const processService = require('./process');

describe('Process Service', () => {
  it('should set Node environment', () => {
    const env = 'production';
    processService.setNodeEnv(env);
    expect(process.env.NODE_ENV).toEqual(env);
  });
});
