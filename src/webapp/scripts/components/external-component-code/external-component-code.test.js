import Prism from 'prismjs';
import codeIndentationService from '@scripts/services/code-indentation';
import vueControllerIndentationService from '@scripts/services/vue-controller-indentation';
import vueControllerSyntaxService from '@scripts/services/vue-controller-syntax';

describe('External Component Code', () => {
  let compile;

  function stubPrism(code){
    Prism.highlight = jest.fn(() => code);
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = (bindings = {}) => {
        const scope = $rootScope.$new(true);
        const template = `<p-external-component-code
                            data-code="$ctrl.code"
                            data-language="{{ $ctrl.language }}">
                          </p-external-component-code>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    codeIndentationService.normalize = jest.fn(code => code);
    vueControllerSyntaxService.stringify = jest.fn(code => code);
    vueControllerIndentationService.normalize = jest.fn(code => code);
  });

  it('should have appropriate css class', () => {
    const code = '<p>Hello</p>';
    const element = compile({code, language: 'html'});
    expect(element.find('div').attr('class')).toEqual('p-external-component-code');
  });

  it('should normalize code indentation', () => {
    const code = 'function () {}';
    stubPrism(code);
    compile({ code });
    expect(codeIndentationService.normalize).toHaveBeenCalledWith(code);
  });

  it('should render component template code into pre element', () => {
    const code = '<p>Hello</p>';
    stubPrism(code);
    const element = compile({code, language: 'html'});
    expect(Prism.highlight).toHaveBeenCalledWith(code, Prism.languages.html, 'html');
    expect(element.find('pre')[0].innerHTML).toEqual(code);
  });

  it('should render Angular controller code into pre element', () => {
    const code = 'function(){}';
    stubPrism(code);
    const element = compile({code, language: 'javascript'});
    expect(Prism.highlight).toHaveBeenCalledWith(code, Prism.languages.javascript, 'javascript');
    expect(element.find('pre')[0].innerHTML).toEqual(code);
  });

  it('should stringify Vue controller syntax', () => {
    const code = { data(){ return { user: 'Rafael' }; } };
    stubPrism(code);
    compile({ code });
    expect(vueControllerSyntaxService.stringify).toHaveBeenCalledWith(code);
  });
});
