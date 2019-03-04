import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import codeService from '@scripts/services/code';
import textService from '@scripts/services/text';
import template from './external-component-code.html';

function controller($element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    injectCodeIntoPreElement(formatCode($ctrl.code), $ctrl.language);
  };

  function formatCode(code){
    return typeof code == 'object' ? JSON.stringify(code, null, 2) : code;
  }

  function injectCodeIntoPreElement(code, language){
    const preElement = $element.find('pre')[0];
    const improvedCodeSyntax = codeService.improveStringifiedCodeSyntax(code, language);
    preElement.innerHTML = highlightCode(improvedCodeSyntax, language);
  }

  function highlightCode(code, language){
    return Prism.highlight(
      textService.normalizeIndentation(code),
      Prism.languages[language],
      language
    );
  }
}

controller.$inject = ['$element'];

export default {
  bindings: {
    code: '<',
    language: '@'
  },
  controller,
  template
};
