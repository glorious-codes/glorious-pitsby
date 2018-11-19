import textService from '@scripts/services/text';
import template from './external-component-markup.html';

function controller($element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    injectMarkupIntoPreElement($ctrl.markup);
  };

  function injectMarkupIntoPreElement(markup){
    const preElement = $element.find('pre')[0];
    preElement.innerHTML = escapeMarkup(markup);
  }

  function escapeMarkup(markup){
    return textService.normalizeIndentation(markup).replace(/</gm, '&lt;');
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
