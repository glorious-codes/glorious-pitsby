const path = require('path');
const { fileService } = require('./file');
const docService = require('./doc');

describe('Doc Service', () => {
  function stubReadFileSync(content){
    fileService.readSync = jest.fn(() => content);
  }

  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should log documentation', () => {
    const content = 'Hello!';
    stubReadFileSync(content);
    docService.log('build');
    expect(console.log).toHaveBeenCalledWith(content);
  });

  it('should read documentation', () => {
    const doc = 'build';
    const filepath = path.join(__dirname, `../docs/${doc}.txt`);
    stubReadFileSync();
    docService.log(doc);
    expect(fileService.readSync).toHaveBeenCalledWith(filepath);
  });

  it('should identify help flag', () => {
    expect(docService.isHelpFlag('-h')).toEqual(true);
    expect(docService.isHelpFlag('--help')).toEqual(true);
  });

  it('should identify version flag', () => {
    expect(docService.isVersionFlag('-v')).toEqual(true);
    expect(docService.isVersionFlag('--version')).toEqual(true);
  });

  it('should log unknown option', () => {
    const command = 'build';
    const option = 'whatever';
    docService.logUnknownOption(command, option);
    expect(console.log).toHaveBeenCalledWith(
      `Unknown option "${option}". Try "pitsby ${command} --help" to see available options.`
    );
  });
});
