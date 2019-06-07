describe('Link', () => {
  let compile;

  function buildTargetAttr(target){
    return target ? `target="${target}"` : '';
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}, content = '') => {
        const template = `<p-link
                            data-href="{{ $ctrl.href }}"
                            ${buildTargetAttr(bindings.target)}>
                            ${content}
                          </p-link>`;
        const element = $compile(template)(scope);
        scope.$ctrl = bindings;
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('a').hasClass('p-link')).toEqual(true);
  });

  it('should accept a href', () => {
    const href = 'https://rafaelcamargo.com';
    const element = compile({ href });
    expect(element.find('a').attr('href')).toEqual(href);
  });

  it('should set target as self by default', () => {
    const element = compile();
    expect(element.find('a').attr('target')).toEqual('_self');
  });

  it('should optionally set a custom target', () => {
    const target = '_blank';
    const element = compile({ target });
    expect(element.find('a').attr('target')).toEqual(target);
  });

  it('should transclude some content', () => {
    const element = compile({}, 'Hello!');
    expect(element.find('ng-transclude').text().trim()).toEqual('Hello!');
  });
});
