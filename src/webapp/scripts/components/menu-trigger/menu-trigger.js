import '@styles/menu-trigger.styl';
import PUBSUB_EVENT_NAMES from '@scripts/constants/pubsub-event-names';
import pubsubService from '@scripts/services/pubsub';
import template from './menu-trigger.html';

function controller(){
  const $ctrl = this;

  $ctrl.onClick = () => {
    pubsubService.publish(PUBSUB_EVENT_NAMES.MENU_TRIGGER_CLICKED);
  };
}

export default {
  controller,
  template
};
