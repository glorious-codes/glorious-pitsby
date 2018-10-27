import '@styles/btn.styl';
import template from './btn.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setThemeCssClass(buildThemeCssClass($ctrl.theme));
    setSizeCssClass(buildSizeCssClass($ctrl.size));
  };

  $ctrl.onButtonClick = () => {
    if($ctrl.onClick)
      $ctrl.onClick();
  };

  function buildThemeCssClass(theme){
    return buildCssClass(theme, ['danger']);
  }

  function buildSizeCssClass(size){
    return buildCssClass(size, ['small']);
  }

  function buildCssClass(cssClassModifier, validModifiers){
    return validModifiers.includes(cssClassModifier) ? `p-btn-${cssClassModifier}` : '';
  }

  function setThemeCssClass(cssClass){
    $ctrl.themeCssClass = cssClass;
  }

  function setSizeCssClass(cssClass){
    $ctrl.sizeCssClass = cssClass;
  }
}

export default {
  transclude: true,
  bindings: {
    theme: '@',
    size: '@',
    onClick: '='
  },
  controller,
  template
};
