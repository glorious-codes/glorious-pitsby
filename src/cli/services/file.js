const fs = require('fs');
const glob = require('glob');
const writefile = require('writefile');

class FileService {
  constructor(dependencies = {}){
    this.fs = dependencies.fs || fs;
    this.glob = dependencies.glob || glob;
    this.writefile = dependencies.writefile || writefile;
    this.console = dependencies.console || console;
    this.req = dependencies.require || require;
  }

  require(filepath){
    return this.req(filepath);
  }

  read(filepath, onSuccess){
    this.fs.readFile(filepath, (err, data) => {
      if(err)
        this.console.log(`Failed to read ${filepath}`, err);
      else
        onSuccess(data);
    });
  }

  readSync(filepath){
    return this.fs.readFileSync(filepath, 'utf-8');
  }

  readJSONSync(filepath){
    return JSON.parse(this.readSync(filepath));
  };

  collect(pattern, onSuccess){
    this.glob(pattern, (err, files) => {
      if(err)
        this.console.log(`Failed to collect ${pattern} files!`, err);
      else
        onSuccess(files);
    });
  }

  write(filepath, data){
    this.writefile(filepath, data);
  };
}

let fileService = new FileService();

module.exports = {
  fileService,
  FileService
};
