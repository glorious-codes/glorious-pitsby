import '@styles/heading.styl';
import template from './heading.html';

function controller($element) {
  const $ctrl = this;

  $ctrl.$onInit = () => {
    const headingElement = buildHeading($ctrl.size, $ctrl.text);
    $element.find('div').append(headingElement);
  };

  function buildHeading(size, text){
    const tagName = isValidSize(size) ? `h${size}` : 'h1';
    const element = document.createElement(tagName);
    element.innerHTML = text;
    return element;
  }

  function isValidSize(size){
    return size && parseInt(size) <= 6;
  }
}

controller.$inject = ['$element'];

export default {
  bindings: {
    size: '@',
    text: '@'
  },
  controller,
  template
};
