const logger = require('./logger');

describe('Logger', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should log a default message', () => {
    const msg = 'Testing';
    logger.msg(msg);
    expect(console.log).toHaveBeenCalledWith(
      '\x1b[36m i [pitsby]:\x1b[0m %s',
      msg
    );
  });

  it('should log a success message', () => {
    const msg = 'Testing';
    logger.msg(msg, { theme: 'success' });
    expect(console.log).toHaveBeenCalledWith(
      '\x1b[32m ✔︎ [pitsby]:\x1b[0m %s',
      msg
    );
  });

  it('should log an error message', () => {
    const msg = 'Testing';
    logger.msg(msg, { theme: 'error' });
    expect(console.log).toHaveBeenCalledWith(
      '\x1b[31m ✗ [pitsby]: %s\x1b[0m',
      msg
    );
  });
});
