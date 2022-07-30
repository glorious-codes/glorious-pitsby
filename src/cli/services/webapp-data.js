const path = require('path');
const configService = require('./config');
const { fileService } = require('./file');
const processService = require('./process');

const _public = {};

_public.save = (filename, data, onSuccess, onError) => {
  const filepath = buildFullFilepath(filename);
  const fileData = buildFileContent(data)
  fileService.write(filepath, fileData, onSuccess, onError);
};

function buildFullFilepath(filename){
  const { outputDirectory } = configService.get();
  const target = path.join(processService.getCwd(), outputDirectory, 'data');
  return `${target}/${filename}`;
}

function buildFileContent(data){
  return typeof data == 'object' ? JSON.stringify(data) : data;
}

module.exports = _public;
