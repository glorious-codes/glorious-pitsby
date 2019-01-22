const path = require('path');
const externalComponentsDataGenerator = require('./external-components-data-generator');
const { fileService } = require('./file');

describe('External Components Data Generator', () => {
  function mockFilesData(){
    return {
      'button.doc.js': {
        name: 'Button',
        examples: [{
          controller: function() {
            const $ctrl = this;
            $ctrl.type = 'success';
            $ctrl.greet = function(name){ console.log(name); };
          }
        }]
      },
      'card.doc.js': {
        name: 'Card',
        examples: [{
          template: '<card></card>'
        }]
      },
      'email-input.doc.js': {
        name: 'Email Input'
      }
    };
  }

  beforeEach(() => {
    fileService.collect = jest.fn((patter, onSuccess) => onSuccess(Object.keys(mockFilesData())));
    fileService.require = jest.fn(file => mockFilesData()[file]);
    fileService.write = jest.fn();
  });

  it('should return a promise', () => {
    const promise = externalComponentsDataGenerator.init('/client', './src');
    expect(promise.then).toBeDefined();
  });

  it('should resolve its promise', done => {
    let count = 0;
    externalComponentsDataGenerator.init('/client', './src').then(() => {
      count++;
      expect(count).toEqual(1);
      done();
    });
  });

  it('should collect all *.doc.js in the specified collect from directory', () => {
    externalComponentsDataGenerator.init('/client', './src');
    expect(fileService.collect.mock.calls[0][0]).toEqual('/client/src/**/*.doc.js');
    expect(typeof fileService.collect.mock.calls[0][1]).toEqual('function');
  });

  it('should write a JSON containing external components data', () => {
    externalComponentsDataGenerator.init('/client', './src');
    const filepath = path.join(__dirname, '../../webapp/data/components.json');
    const data = [
      {name: 'Button', examples: [{
        controller: `function controller() {
            var $ctrl = this;
            $ctrl.type = 'success';
            $ctrl.greet = function (name) {
              console.log(name);
            };
          }`
      }], id: 'button', },
      {name: 'Card', examples: [{ template: '<card></card>'}], id: 'card'},
      {name: 'Email Input', id: 'email-input'}
    ];
    expect(fileService.write).toHaveBeenCalledWith(filepath, JSON.stringify(data));
  });
});
