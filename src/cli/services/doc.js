const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.log = doc => {
  console.log(_public.read(doc));
};

_public.isHelpFlag = flag => {
  return flag == '--help' || flag == '-h';
};

_public.isVersionFlag = flag => {
  return flag == '--version' || flag == '-v';
};

_public.logUnknownOption = (command, option) => {
  console.log(`Unknown option "${option}". Try "pitsby ${command} --help" to see available options.`);
};

_public.read = doc => {
  const filepath = path.join(__dirname, `../docs/${doc}.txt`);
  return fileService.readSync(filepath);
};

module.exports = _public;
