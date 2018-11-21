import '@styles/external-component-example.styl';
import template from './external-component-example.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setTabsQueryParamKey(buildTabsQueryParamKey($ctrl.exampleIndex));
  };

  function buildTabsQueryParamKey(exampleIndex){
    return `externalComponentExample${exampleIndex}Tab`;
  }

  function setTabsQueryParamKey(key){
    $ctrl.tabsQueryParamKey = key;
  }
}

export default {
  bindings: {
    example: '<',
    exampleIndex: '<'
  },
  controller,
  template
};
