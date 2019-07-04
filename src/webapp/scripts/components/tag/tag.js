import '@styles/tag.styl';
import template from './tag.html';

function controller() {
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setThemeCssClass(buildThemeCssClass($ctrl.theme));
  };

  function buildThemeCssClass(theme){
    return theme ? `p-tag-${theme}` : '';
  }

  function setThemeCssClass(cssClass){
    $ctrl.themeCssClass = cssClass;
  }
}

export default {
  transclude: true,
  bindings: {
    theme: '@'
  },
  controller,
  template
};
