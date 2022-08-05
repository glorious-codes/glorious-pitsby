const { fileService } = require('./file');
const jsxJsonService = require('./jsx-json');
const moduleService = require('./module');
const processService = require('./process');
const webappDataService = require('./webapp-data');
const externalComponentsDataGenerator = require('./external-components-data-generator');

describe('External Components Data Generator', () => {
  function mockProjects(){
    return [
      {engine: 'angular', collectDocsFrom: './src/angular'},
      {engine: 'vue', collectDocsFrom: './src/vue'},
      {engine: 'react', collectDocsFrom: './src/react'},
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
      },
      '/client/src/react/**/*.doc.js': {
        'tag.doc.js': {
          name: 'Tag'
        }
      }
    };
  }

  beforeEach(() => {
    fileService.collect = jest.fn((pattern, onSuccess) => {
      onSuccess(Object.keys(mockFilesData()[pattern]));
    });
    fileService.require = jest.fn(filepath => {
      const data = mockFilesData();
      return  data['/client/src/angular/**/*.doc.js'][filepath] ||
              data['/client/src/vue/**/*.doc.js'][filepath];
    });
    jsxJsonService.stringifyFunctions = jest.fn(filepath => {
      return mockFilesData()['/client/src/react/**/*.doc.js'][filepath];
    });
    moduleService.compileInMemoryModule = jest.fn(data => data);
    webappDataService.save = jest.fn((filename, data, onSuccess) => onSuccess());
    processService.getCwd = jest.fn(() => '/client');
  });

  it('should write a JSON containing Angular external components data', done => {
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
    externalComponentsDataGenerator.init(mockProjects()).then(() => {
      expect(webappDataService.save).toHaveBeenCalledWith(
        'components-angular.json',
        data,
        expect.any(Function),
        expect.any(Function),
      );
      done();
    });
  });

  it('should write a JSON containing Vue external components data', done => {
    externalComponentsDataGenerator.init(mockProjects()).then(() => {
      expect(webappDataService.save).toHaveBeenCalledWith(
        'components-vue.json',
        [ {name: 'Badge', id: 'badge'} ],
        expect.any(Function),
        expect.any(Function),
      );
      done();
    });
  });

  it('should write a JSON containing React external components data', done => {
    externalComponentsDataGenerator.init(mockProjects()).then(() => {
      expect(webappDataService.save).toHaveBeenCalledWith(
        'components-react.json',
        [{ id: 'tag', name: 'Tag' }],
        expect.any(Function),
        expect.any(Function),
      );
      done();
    });
  });

  it('should not write any JSON if no projects have been given', done => {
    externalComponentsDataGenerator.init().then(() => {
      expect(webappDataService.save).not.toHaveBeenCalled();
      done();
    });
  });

  it('should reject promise on collect error', () => {
    const errorMock = 'some error';
    fileService.collect = jest.fn((pattern, onSuccess, onError) => onError(errorMock));
    externalComponentsDataGenerator.init().then(() => {}, err => {
      expect(err).toEqual(errorMock);
    });
  });

  it('should reject promise on write JSON error', () => {
    const errorMock = 'some error';
    webappDataService.save = jest.fn((filename, data, onSuccess, onError) => onError(errorMock));
    externalComponentsDataGenerator.init(mockProjects()).then(() => {}, err => {
      expect(err).toEqual(errorMock);
    });
  });
});
