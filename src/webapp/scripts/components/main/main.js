import '@styles/main.styl';
import template from './main.html';

function controller(){
  const $ctrl = this;

  $ctrl.onEngineMenuLoadComplete = engines => {
    setTopOffsetCssClass(buildTopOffsetCssClass(engines));
  };

  function buildTopOffsetCssClass(engines){
    return engines && engines.length > 1 ? 'p-main-top-offset' : '';
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
