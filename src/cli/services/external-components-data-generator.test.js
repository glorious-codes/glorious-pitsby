const externalComponentsDataGenerator = require('./external-components-data-generator');
const webappDataService = require('./webapp-data');
const { fileService } = require('./file');

describe('External Components Data Generator', () => {
  function mockProjects(){
    return [
      {engine: 'angular', collectDocsFrom: './src/angular'},
      {engine: 'vue', collectDocsFrom: './src/vue'}
    ];
  }
  function mockFilesData(){
    return {
      '/client/src/angular/**/*.doc.js': {
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
        },
        'async-content-wrapper.doc.js': {
          name: 'Async Content Wrapper'
        }
      },
      '/client/src/vue/**/*.doc.js': {
        'badge.doc.js': {
          name: 'Badge'
        }
      }
    };
  }

  beforeEach(() => {
    fileService.collect = jest.fn((pattern, onSuccess) => {
      const data = mockFilesData();
      onSuccess(Object.keys(data[pattern]));
    });
    fileService.require = jest.fn(filepath => {
      const data = mockFilesData();
      return  data['/client/src/angular/**/*.doc.js'][filepath] ||
              data['/client/src/vue/**/*.doc.js'][filepath];
    });
    webappDataService.save = jest.fn((filename, data, onSuccess) => onSuccess());
  });

  it('should return a promise', () => {
    const promise = externalComponentsDataGenerator.init('/client', mockProjects());
    expect(promise.then).toBeDefined();
  });

  it('should resolve its promise', done => {
    let count = 0;
    externalComponentsDataGenerator.init('/client', mockProjects()).then(() => {
      count++;
      expect(count).toEqual(1);
      done();
    });
  });

  it('should collect all *.doc.js in the specified collect from directory', () => {
    externalComponentsDataGenerator.init('/client', mockProjects());
    expect(fileService.collect.mock.calls[0][0]).toEqual('/client/src/angular/**/*.doc.js');
    expect(typeof fileService.collect.mock.calls[0][1]).toEqual('function');
    expect(typeof fileService.collect.mock.calls[0][2]).toEqual('function');
    expect(fileService.collect.mock.calls[1][0]).toEqual('/client/src/vue/**/*.doc.js');
    expect(typeof fileService.collect.mock.calls[1][1]).toEqual('function');
    expect(typeof fileService.collect.mock.calls[1][2]).toEqual('function');
  });

  it('should write a JSON containing angular external components data', () => {
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
      {name: 'Email Input', id: 'email-input'},
      {name: 'Async Content Wrapper', id: 'async-content-wrapper'}
    ];
    externalComponentsDataGenerator.init('/client', mockProjects());
    expect(webappDataService.save.mock.calls[0][0]).toEqual('components-angular.json');
    expect(webappDataService.save.mock.calls[0][1]).toEqual(data);
    expect(typeof webappDataService.save.mock.calls[0][2]).toEqual('function');
    expect(typeof webappDataService.save.mock.calls[0][3]).toEqual('function');
  });

  it('should write a JSON containing vue external components data', () => {
    const data = [ {name: 'Badge', id: 'badge'} ];
    externalComponentsDataGenerator.init('/client', mockProjects());
    expect(webappDataService.save.mock.calls[1][1]).toEqual(data);
  });

  it('should not write any JSON if no projects have been given', () => {
    externalComponentsDataGenerator.init('/client');
    expect(webappDataService.save).not.toHaveBeenCalled();
  });

  it('should reject promise on collect error', () => {
    const errorMock = 'some error';
    fileService.collect = jest.fn((pattern, onSuccess, onError) => onError(errorMock));
    externalComponentsDataGenerator.init('/client').then(() => {}, err => {
      expect(err).toEqual(errorMock);
    });
  });

  it('should reject promise on write JSON error', () => {
    const errorMock = 'some error';
    webappDataService.save = jest.fn((filename, data, onSuccess, onError) => onError(errorMock));
    externalComponentsDataGenerator.init('/client').then(() => {}, err => {
      expect(err).toEqual(errorMock);
    });
  });
});
