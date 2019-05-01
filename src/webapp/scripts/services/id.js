import generateNanoId from 'nanoid/generate';

class IdService {
  constructor(dependencies = {}){
    this.generateNanoId = dependencies.generateNanoId || generateNanoId;
  }

  generate(){
    return this.generateNanoId(getValidChars(), 12);
  }
}

function getValidChars(){
  return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_';
}

const idService = new IdService();

export {
  idService,
  IdService
};
