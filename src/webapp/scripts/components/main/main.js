import '@styles/main.styl';
import template from './main.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setTopOffsetCssClass(buildTopOffsetCssClass());
  };

  function buildTopOffsetCssClass(){
    return hasEngineMenu() ? 'p-main-top-offset' : '';
  }

  function hasEngineMenu(){
    return document.querySelector('[data-engine-menu-container]');
  }

  function setTopOffsetCssClass(cssClass){
    $ctrl.topOffsetCssClass = cssClass;
  }
}

export default {
  transclude: true,
  controller,
  template
};
