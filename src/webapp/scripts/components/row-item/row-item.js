import '@styles/row-item.styl';
import template from './row-item.html';

function controller (){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setSizeCssClass(buildSizeCssClass($ctrl.size));
  };

  function buildSizeCssClass(size){
    return size ? `p-row-item-size-${size}` : '';
  }

  function setSizeCssClass(cssClass){
    $ctrl.sizeCssClass = cssClass;
  }
}

export default {
  transclude: true,
  bindings: {
    size: '@',
    label: '@',
    value: '='
  },
  controller,
  template
};
