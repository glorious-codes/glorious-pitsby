import Prism from 'prismjs';
import codeService from '@scripts/services/code';
import textService from '@scripts/services/text';

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
    codeService.improveStringifiedCodeSyntax = jest.fn(code => code);
    textService.normalizeIndentation = jest.fn(code => code);
  });

  it('should have appropriate css class', () => {
    const code = '<p>Hello</p>';
    const element = compile({code, language: 'html'});
    expect(element.find('div').attr('class')).toEqual('p-external-component-code');
  });

  it('should improve stringified code syntax', () => {
    const code = 'function () {}';
    const language = 'javascript';
    compile({code, language});
    expect(codeService.improveStringifiedCodeSyntax).toHaveBeenCalledWith(code, language);
  });

  it('should render component template code into pre element', () => {
    const code = '<p>Hello</p>';
    stubPrism(code);
    const element = compile({code, language: 'html'});
    expect(Prism.highlight).toHaveBeenCalledWith(code, Prism.languages.html, 'html');
    expect(element.find('pre')[0].innerHTML).toEqual(code);
  });

  it('should render component controller code into pre element', () => {
    const code = 'function(){}';
    stubPrism(code);
    const element = compile({code, language: 'javascript'});
    expect(Prism.highlight).toHaveBeenCalledWith(code, Prism.languages.javascript, 'javascript');
    expect(element.find('pre')[0].innerHTML).toEqual(code);
  });

  it('should render component controller code into pre element when controller is a plain object', () => {
    const controller = {methods: {greet: 'function () { alert("Hello!"); }'}};
    const stringifiedController = JSON.stringify(controller, null, 2);
    stubPrism(stringifiedController);
    const element = compile({code: controller, language: 'javascript'});
    expect(Prism.highlight).toHaveBeenCalledWith(stringifiedController, Prism.languages.javascript, 'javascript');
    expect(element.find('pre').text()).toEqual(stringifiedController);
  });
});
