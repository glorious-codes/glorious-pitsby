const chokidar = require('chokidar');
const argsService = require('./args');

const _public = {};

_public.init = (files, onFileChange) => {
  const watcher = chokidar.watch(files);
  watcher.on('change', path => {
    watcher.close();
    setTimeout(() => {
      handleChange(path, files, onFileChange);
    }, getAggregateTime());
  });
};

function getAggregateTime(){
  return argsService.getCliArgs('--aggregateTimeout') || 0;
}

function handleChange(changedFile, files, onFileChange){
  console.log(`${changedFile} changed!`);
  handleChangeCallbak(files, onFileChange);
}

function handleChangeCallbak(files, onFileChange){
  const promise = onFileChange();
  return promise && promise.then ? promise.then(() => {
    _public.init(files, onFileChange);
  }) : _public.init(files, onFileChange);
}

module.exports = _public;
