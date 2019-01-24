const fs = require('fs');
const fsextra = require('fs-extra');
const glob = require('glob');
const writefile = require('writefile');

class FileService {
  constructor(dependencies = {}){
    this.fs = getDependency(dependencies, 'fs', fs);
    this.fsextra = getDependency(dependencies, 'fsextra', fsextra);
    this.glob = getDependency(dependencies, 'glob', glob);
    this.writefile = getDependency(dependencies, 'writefile', writefile);
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

  collect(pattern, onSuccess){
    this.glob(pattern, (err, files) => {
      if(err)
        console.log(`Failed to collect ${pattern} files!`, err);
      else
        onSuccess(files);
    });
  }

  copy(source, destination, onSuccess){
    this.fsextra.copy(source, destination, err => {
      if(err)
        console.log(`Failed to copy ${source}!`, err);
      else
        onSuccess();
    });
  }

  write(filepath, data){
    this.writefile(filepath, data);
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
