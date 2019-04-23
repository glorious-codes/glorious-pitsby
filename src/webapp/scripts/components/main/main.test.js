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

  it('should transclude some content', () => {
    const element = compile('<p>Hello!</p>');
    expect(element.find('p').text()).toEqual('Hello!');
  });
});
