import PUBSUB_EVENT_NAMES from '@scripts/constants/pubsub-event-names';
import { storeColorScheme, getStoredColorScheme } from '@scripts/services/color-scheme';
import pubsubService from '@scripts/services/pubsub';
import template from './color-scheme-toggler.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => configScheme(getInitialScheme());

  $ctrl.onClick = () => toggleScheme($ctrl.scheme);

  function getInitialScheme(){
    const schemes = getAvailableSchemes();
    const stored = getStoredColorScheme();
    return stored ? schemes.find(({ type }) => type === stored) : schemes[0];
  }

  function toggleScheme(currentScheme){
    const scheme = getAvailableSchemes().find(scheme => scheme.type != currentScheme.type);
    configScheme(scheme);
    storeColorScheme(scheme.type);
    pubsubService.publish(PUBSUB_EVENT_NAMES.COLOR_SCHEME_CHANGED, { scheme: scheme.type });
  }

  function configScheme(scheme){
    setHtmlColorScheme(scheme.type);
    setScheme(scheme);
  }

  function setHtmlColorScheme(scheme){
    document.querySelector('html').setAttribute('data-pitsby-color-scheme', scheme);
  }

  function setScheme(scheme){
    $ctrl.scheme = scheme;
  }

  function getAvailableSchemes(){
    return [
      { type: 'light', label: 'dark mode', icon: 'moon' },
      { type: 'dark', label: 'light mode', icon: 'sun' }
    ];
  }
}

export default {
  controller,
  template
};
