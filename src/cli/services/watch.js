const chokidar = require('chokidar');

const _public = {};

_public.init = (files, onFileChange) => {
  console.log('Watching for changes...');
  const watcher = chokidar.watch(files);
  watcher.on('change', path => {
    watcher.close();
    handleChange(path, files, onFileChange);
  });
};

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
