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
    const key = getQueryParamKey();
    if(key)
      return tabsRouteParamsService.get(key);
  }

  function setTabIndexQueryParam(tabIndex){
    const key = getQueryParamKey();
    if(key)
      tabsRouteParamsService.set({[key]: tabIndex});
  }

  function getQueryParamKey(){
    return $ctrl.queryParamKey;
  }

  function getTab(tabIndex = 0){
    return $ctrl.tabs[tabIndex];
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
    queryParamKey: '@'
  },
  controller,
  template
};
