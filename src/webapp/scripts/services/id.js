import { customAlphabet } from 'nanoid';

class IdService {
  constructor(){
    const chars = getValidChars();
    const size = 12;
    this.generateNanoId = customAlphabet(chars, size);
  }

  generate(){
    return this.generateNanoId();
  }
}

function getValidChars(){
  return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_';
}

const idService = new IdService();

export {
  idService
};
