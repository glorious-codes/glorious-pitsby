const prettier = require('prettier');
const { fileService } = require('./file');

const _public = {};

let isCursorInsideController;
let numberOfLeadingSpaces;

_public.stringifyFunctions = filepath => {
  const lines = readFile(filepath).split('\n');
  return lines.map(line => parseLine(line)).join('\n');
};

function readFile(filepath){
  return prettier.format(fileService.readSync(filepath), {
    singleQuote: true,
    parser: 'babel'
  });
}

function parseLine(line){
  if(isControllerDefinitionLine(line))
    return parseControllerDefinitionLine(line);
  if(isControllerClosingLine(line))
    return parseControllerClosingLine(line);
  return parseRegularLine(line);
}

function parseControllerDefinitionLine(line){
  setCursorContext({ isInsideController: true });
  setNumberOfLeadingSpaces(countLeadingSpacesInLine(line));
  return line.replace('controller: function', 'controller: `function');
}

function parseControllerClosingLine(line){
  setCursorContext({ isInsideController: false });
  return line.replace('}', '}`');
}

function parseRegularLine(line){
  if (isCursorInsideController)
    return line.replace(/`/g, '\\`').replace(/\${/g, '\\${');
  return line;
}

function isControllerDefinitionLine(line){
  return line.includes('controller: function');
}

function isControllerClosingLine(line){
  const regex = new RegExp(`^ {${numberOfLeadingSpaces}}},?`);
  return isCursorInsideController && regex.test(line);
}

function countLeadingSpacesInLine(line){
  return line.search(/\S/);
}

function setCursorContext({ isInsideController }){
  isCursorInsideController = isInsideController;
}

function setNumberOfLeadingSpaces(number){
  numberOfLeadingSpaces = number;
}

module.exports = _public;
