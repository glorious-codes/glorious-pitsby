import '@styles/sidebar.styl';
import PUBSUB_EVENT_NAMES from '@scripts/constants/pubsub-event-names';
import pubsubService from '@scripts/services/pubsub';
import template from './sidebar.html';

function controller(){
  const $ctrl = this;

  let menuTriggerSubscriberId;

  $ctrl.$onInit = () => {
    menuTriggerSubscriberId = pubsubService.subscribe(
      PUBSUB_EVENT_NAMES.MENU_TRIGGER_CLICKED,
      onMenuTriggerClick
    );
  };

  $ctrl.$onDestroy = () => {
    pubsubService.unsubscribe(menuTriggerSubscriberId);
  };

  $ctrl.hideSidebar = () => setSidebarVisibilityCssClass('');

  $ctrl.onComponentsMenuItemClick = item => {
    if(!item.children) $ctrl.hideSidebar();
  };

  function onMenuTriggerClick(){
    setSidebarVisibilityCssClass('p-sidebar-visible');
  }

  function setSidebarVisibilityCssClass(cssClass){
    $ctrl.sidebarVisibilityCssClass = cssClass;
  }
}

export default {
  template,
  controller
};
