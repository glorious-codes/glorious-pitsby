import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import textService from '@scripts/services/text';
import template from './external-component-markup.html';

function controller($element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    injectMarkupIntoPreElement($ctrl.markup);
  };

  function injectMarkupIntoPreElement(markup){
    const preElement = $element.find('pre')[0];
    preElement.innerHTML = highlightMarkup(markup);
  }

  function highlightMarkup(markup){
    return Prism.highlight(
      textService.normalizeIndentation(markup),
      Prism.languages.html,
      'html'
    );
  }
}

controller.$inject = ['$element'];

export default {
  bindings: {
    markup: '@'
  },
  controller,
  template
};
