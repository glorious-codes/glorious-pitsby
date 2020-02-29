const fs = require('fs');
const path = require('path');
const service = require('./module');

describe('Module Service', () => {
  function getModuleMock(){
    return fs.readFileSync(path.resolve(__dirname, '../mocks/module.js'), 'utf-8');
  }

  it('should compile an in-memory module', () => {
    const content = getModuleMock();
    const compiledModule = service.compileInMemoryModule(content);
    expect(compiledModule.sum(7, 3)).toEqual(10);
  });
});
