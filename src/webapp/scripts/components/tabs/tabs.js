import '@styles/tabs.styl';
import template from './tabs.html';

function controller($timeout, $element, tabsRouteParamsService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setBarItemsPositionCssClass(buildPositionBarItemsCssClass($ctrl.barItemsPosition));
    $timeout(() => {
      setTabs(buildTabs());
      activateTab(getTab(getTabIndexQueryParam()));
    });
  };

  $ctrl.selectTab = (tab, tabIndex) => {
    activateTab(tab);
    setTabIndexQueryParam(tabIndex);
    tab.select();
  };

  function buildPositionBarItemsCssClass(position){
    return position == 'center' ? 'p-tabs-bar-items-centered' : '';
  }

  function setBarItemsPositionCssClass(cssClass){
    $ctrl.barItemsPositionCssClass = cssClass;
  }

  function buildTabs(){
    return getTabElements().map(tab => angular.element(tab).isolateScope().$ctrl);
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
    const cssClass = 'p-tab-active';
    getTabElements().forEach(tabElement => {
      tabElement.classList.remove(cssClass);
      if(tabElement.getAttribute('data-name') === tab.name)
        tabElement.classList.add(cssClass);
    });
  }

  function toggleActiveTab(tab){
    deactivateAllTabs();
    setActiveTab(tab);
  }

  function deactivateAllTabs(){
    $ctrl.tabs.forEach(tab => delete tab.isActive);
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
    queryParamKey: '@',
    barItemsPosition: '@'
  },
  controller,
  template
};
