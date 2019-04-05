const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.save = (filename, data, onSuccess, onError) => {
  fileService.write(buildFullFilepath(filename), buildFileContent(data), onSuccess, onError);
};

function buildFullFilepath(filename){
  return path.join(__dirname, `../../webapp/data/${filename}`);
}

function buildFileContent(data){
  return typeof data == 'object' ? JSON.stringify(data) : data;
}

module.exports = _public;
