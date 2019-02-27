const fs = require('fs');
const fsextra = require('fs-extra');
const glob = require('glob');
const fileSystem = require('file-system');

class FileService {
  constructor(dependencies = {}){
    this.fs = getDependency(dependencies, 'fs', fs);
    this.fsextra = getDependency(dependencies, 'fsextra', fsextra);
    this.glob = getDependency(dependencies, 'glob', glob);
    this.fileSystem = getDependency(dependencies, 'fileSystem', fileSystem);
    this.req = getDependency(dependencies, 'req', require);
  }

  require(filepath){
    return this.req(filepath);
  }

  read(filepath, onSuccess){
    this.fs.readFile(filepath, (err, data) => {
      if(err)
        console.log(`Failed to read ${filepath}`, err);
      else
        onSuccess(data);
    });
  }

  readSync(filepath){
    return this.fs.readFileSync(filepath, 'utf-8');
  }

  readJSONSync(filepath){
    return JSON.parse(this.readSync(filepath));
  }

  remove(path){
    return this.fsextra.remove(path);
  }

  collect(pattern, onSuccess, onError){
    this.glob(pattern, (err, files) => {
      if(err)
        return onError ? onError(err) : console.log(`Failed to collect ${pattern} files`, err);
      onSuccess(files);
    });
  }

  copy(source, destination, onSuccess, onError){
    this.fsextra.copy(source, destination, err => {
      if(err)
        return onError ? onError(err) : console.log(`Failed to copy ${source}`, err);
      onSuccess();
    });
  }

  write(filepath, data, onSuccess, onError){
    this.fileSystem.writeFile(filepath, data, err => {
      if(err)
        return onError ? onError(err) : console.log(`Failed to write ${filepath}`, err);
      onSuccess();
    });
  }
}

function getDependency(dependencies, dependencyName, rawDependency){
  return dependencies[dependencyName] || rawDependency;
}

let fileService = new FileService();

module.exports = {
  fileService,
  FileService
};
