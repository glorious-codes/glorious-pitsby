import '@styles/row.styl';
import template from './row.html';

function controller (){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setVerticalOffsetCssClass(buildVerticalOffsetCssClass($ctrl.verticalOffset));
  };

  function buildVerticalOffsetCssClass(verticalOffset){
    return verticalOffset ? `p-row-vertical-offset-${verticalOffset}` : '';
  }

  function setVerticalOffsetCssClass(cssClass){
    $ctrl.verticalOffsetCssClass = cssClass;
  }
}

export default {
  transclude: true,
  bindings: {
    verticalOffset: '@'
  },
  controller,
  template
};
