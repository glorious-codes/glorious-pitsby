import componentsResource from '@scripts/resources/components';
import { PromiseMock } from '@mocks/promise';

describe('External Components List', () => {
  let compile, instantiateController;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile, $componentController) => {
      const scope = $rootScope.$new(true);
      compile = () => {
        const template = '<p-external-components-list></p-external-components-list>';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
      instantiateController = () => {
        return $componentController('pExternalComponentsList');
      };
    });
    componentsResource.get = jest.fn(() => new PromiseMock('success', {}));
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-external-components-list');
  });

  it('should fetch components', () => {
    const controller = instantiateController();
    controller.fetch();
    expect(componentsResource.get).toHaveBeenCalled();
  });

  it('should set components on fetch success', () => {
    const componentsMock = [{some: 'component'}];
    const controller = instantiateController();
    controller.fetchSuccess(componentsMock);
    expect(controller.components).toEqual(componentsMock);
  });
});
