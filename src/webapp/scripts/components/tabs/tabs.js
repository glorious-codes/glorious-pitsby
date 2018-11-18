import '@styles/tabs.styl';
import template from './tabs.html';

function controller($timeout, $element){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    $timeout(() => {
      setTabs(buildTabs($element));
      $ctrl.selectTab($ctrl.tabs[0]);
    });
  };

  $ctrl.selectTab = tab => {
    showTabContent(tab);
    toggleActiveTab(tab);
  };

  function buildTabs(element){
    return getTabElements().map(tab => {
      return {
        name: tab.getAttribute('data-name')
      };
    });
  }

  function getTabElements(){
    return Array.from($element[0].querySelectorAll('p-tab'));
  }

  function setTabs(tabs){
    $ctrl.tabs = tabs;
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

controller.$inject = ['$timeout', '$element']

export default {
  transclude: true,
  controller,
  template
};
