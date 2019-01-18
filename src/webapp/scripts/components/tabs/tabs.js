import '@styles/tabs.styl';
import template from './tabs.html';

function controller($timeout, $element, tabsRouteParamsService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    $timeout(() => {
      setTabs(buildTabs());
      activateTab(getTab(getTabIndexQueryParam()));
    });
  };

  $ctrl.selectTab = (tab, tabIndex) => {
    activateTab(tab);
    setTabIndexQueryParam(tabIndex);
  };

  function buildTabs(){
    return getTabElements().map(tab => {
      return {
        name: tab.getAttribute('data-name')
      };
    });
  }

  function activateTab(tab){
    showTabContent(tab);
    toggleActiveTab(tab);
  }

  function getTabElements(){
    return Array.from($element[0].querySelectorAll('p-tab'));
  }

  function setTabs(tabs){
    $ctrl.tabs = tabs;
  }

  function getTabIndexQueryParam(){
    if($ctrl.queryParamKey)
      return tabsRouteParamsService.get($ctrl.queryParamKey, {
        tabGroupKey: $ctrl.queryParamGroupKey
      });
  }

  function setTabIndexQueryParam(tabIndex){
    if($ctrl.queryParamKey)
      tabsRouteParamsService.set($ctrl.queryParamKey, tabIndex, {
        tabGroupKey: $ctrl.queryParamGroupKey
      });
  }

  function getTab(tabIndex){
    return $ctrl.tabs[tabIndex || 0];
  }

  function showTabContent(tab){
    getTabElements().forEach(tabElement => {
      handleCssClass(tabElement, 'remove', 'p-tab-active');
      if(tabElement.getAttribute('data-name') === tab.name)
        handleCssClass(tabElement, 'add', 'p-tab-active');
    });
  }

  function handleCssClass(element, action, cssClass){
    element.classList[action](cssClass);
  }

  function toggleActiveTab(tab){
    deactivateAllTabs();
    setActiveTab(tab);
  }

  function deactivateAllTabs(){
    $ctrl.tabs.forEach(tab => {
      delete tab.isActive;
    });
  }

  function setActiveTab(tab){
    tab.isActive = true;
  }
}

controller.$inject = ['$timeout', '$element', 'tabsRouteParamsService'];

export default {
  transclude: true,
  bindings: {
    queryParamGroupKey: '@',
    queryParamKey: '@'
  },
  controller,
  template
};
