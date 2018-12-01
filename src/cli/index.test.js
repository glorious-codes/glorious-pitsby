const argsService = require('./services/args');
const commands = require('./commands');
let cli;

const HELPER_TEXT = 'Try "pitsby --help" to see available commands.';

describe('CLI Index', () => {
  function stubGetCLIArgs(args){
    argsService.getCliArgs = jest.fn(() => args);
  }

  beforeEach(() => {
    console.log = jest.fn();
    argsService.getCliArgs = jest.fn(() => []);
    commands.version.exec = jest.fn();
    commands.help.exec = jest.fn();
    commands.build.exec = jest.fn();
    cli = require('./index');
  });

  it('should exec version command', () => {
    stubGetCLIArgs(['-v']);
    cli.init();
    expect(commands.version.exec.mock.calls.length).toEqual(1);
    stubGetCLIArgs(['--version']);
    cli.init();
    expect(commands.version.exec.mock.calls.length).toEqual(2);
  });

  it('should exec help command', () => {
    stubGetCLIArgs(['-h']);
    cli.init();
    expect(commands.help.exec.mock.calls.length).toEqual(1);
    stubGetCLIArgs(['--help']);
    cli.init();
    expect(commands.help.exec.mock.calls.length).toEqual(2);
  });

  it('should exec build command', () => {
    stubGetCLIArgs(['build']);
    cli.init();
    expect(commands.build.exec).toHaveBeenCalled();
  });

  it('should pass remaining args on command execution', () => {
    stubGetCLIArgs(['build', '--watch']);
    cli.init();
    expect(commands.build.exec).toHaveBeenCalledWith(['--watch']);
  });

  it('should log unkown command', () => {
    const command = 'whatever';
    stubGetCLIArgs([command]);
    cli.init();
    expect(console.log).toHaveBeenCalledWith(
      `Unknown command "${command}". ${HELPER_TEXT}`
    );
  });

  it('should log no command given', () => {
    stubGetCLIArgs([]);
    cli.init();
    expect(console.log).toHaveBeenCalledWith(
      `No command given. ${HELPER_TEXT}`
    );
  });
});
