import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import textService from '@scripts/services/text';
import template from './external-component-code.html';

function controller($element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    injectCodeIntoPreElement($ctrl.code);
  };

  function injectCodeIntoPreElement(code){
    const preElement = $element.find('pre')[0];
    preElement.innerHTML = highlightCode(code);
  }

  function highlightCode(code){
    return Prism.highlight(
      textService.normalizeIndentation(code),
      Prism.languages[$ctrl.language],
      `${$ctrl.language}`
    );
  }
}

controller.$inject = ['$element'];

export default {
  bindings: {
    code: '@',
    language: '@'
  },
  controller,
  template
};
