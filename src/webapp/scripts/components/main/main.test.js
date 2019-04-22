import { PromiseMock } from '@mocks/promise';
import projectsResource from '@scripts/resources/projects';

describe('Main', () => {
  let compile;

  function stubGetProjects(responseType, response){
    projectsResource.get = jest.fn(() => {
      return new PromiseMock(responseType, response);
    });
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (content = '') => {
        const template = `<p-main>${content}</p-main>`;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    stubGetProjects('success', []);
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('main').attr('class').trim()).toEqual('p-main');
  });

  it('should set top offset if project has more than one engine on initialize', () => {
    stubGetProjects('success', [{engine: 'angular'}, {engine: 'vue'}]);
    const element = compile();
    expect(element.find('main').hasClass('p-main-top-offset')).toEqual(true);
  });

  it('should not set top offset if project has only one engine on initialize', () => {
    stubGetProjects('success', [{engine: 'angular'}]);
    const element = compile();
    expect(element.find('main').hasClass('p-main-top-offset')).toEqual(false);
  });

  it('should transclude some content', () => {
    const element = compile('<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });

  it('should log error on get projects error', () => {
    console.log = jest.fn();
    const err = {some: 'error'};
    stubGetProjects('error', err);
    compile();
    expect(console.log).toHaveBeenCalledWith('Failed to get projects', err);
  });
});
