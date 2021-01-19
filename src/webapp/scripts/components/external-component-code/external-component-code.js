import '@styles/external-component-code.styl';
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import codeIndentationService from '@scripts/services/code-indentation';
import vueControllerSyntaxService from '@scripts/services/vue-controller-syntax';
import template from './external-component-code.html';

function controller($element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    injectCodeIntoPreElement(highlightCode(formatCode($ctrl.code), $ctrl.language));
  };

  function formatCode(code){
    if(typeof code == 'object') return vueControllerSyntaxService.stringify(code);
    return codeIndentationService.normalize(code);
  }

  function injectCodeIntoPreElement(code){
    const preElement = $element.find('pre')[0];
    preElement.innerHTML = code;
  }

  function highlightCode(code, language){
    return Prism.highlight(code, Prism.languages[language], language);
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
