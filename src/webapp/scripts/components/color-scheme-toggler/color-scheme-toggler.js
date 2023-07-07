import PUBSUB_EVENT_NAMES from '@scripts/constants/pubsub-event-names';
import { storeColorScheme, getStoredColorScheme, flushStoredColorScheme } from '@scripts/services/color-scheme';
import externalGlobalDataService from '@scripts/services/external-global-data';
import pubsubService from '@scripts/services/pubsub';
import template from './color-scheme-toggler.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    const scheme = getConfiguredColorScheme();
    if(scheme) {
      ensureStoredColorSchemeFreshness();
      configScheme(getInitialScheme(scheme.initial));
      setTogglerVisibility(!!scheme.onChange);
    }
  };

  $ctrl.onClick = () => {
    const currentScheme = document.querySelector('html').getAttribute(getColorSchemeAttrName());
    toggleScheme(getSchemeByType(currentScheme));
  };

  function ensureStoredColorSchemeFreshness(){
    if(!getColorSchemeChangeListener()) flushStoredColorScheme();
  }

  function getConfiguredColorScheme(){
    return externalGlobalDataService.get().colorScheme;
  }

  function getInitialScheme(configInitialScheme){
    const schemeType = getStoredColorScheme() || configInitialScheme || 'light';
    return getSchemeByType(schemeType);
  }

  function getSchemeByType(type){
    return getAvailableSchemes().find(scheme => scheme.type === type);
  }

  function toggleScheme(currentScheme){
    const scheme = getAvailableSchemes().find(scheme => scheme.type != currentScheme.type);
    pubsubService.publish(PUBSUB_EVENT_NAMES.COLOR_SCHEME_CHANGED, { scheme: scheme.type });
    configScheme(scheme);
  }

  function configScheme(scheme){
    shouldStoreColorScheme() && storeColorScheme(scheme.type);
    handleThirdPartyColorSchemeChange(scheme.type);
    setHtmlColorScheme(scheme.type);
    setScheme(scheme);
  }

  function shouldStoreColorScheme(){
    return !!getColorSchemeChangeListener();
  }

  function handleThirdPartyColorSchemeChange(schemeType){
    const onChange = getColorSchemeChangeListener();
    onChange && onChange(schemeType);
  }

  function getColorSchemeChangeListener(){
    const colorScheme = getConfiguredColorScheme();
    return colorScheme && colorScheme.onChange;
  }

  function setHtmlColorScheme(scheme){
    document.querySelector('html').setAttribute(getColorSchemeAttrName(), scheme);
  }

  function setScheme(scheme){
    $ctrl.scheme = scheme;
  }

  function setTogglerVisibility(shouldShowToggler){
    $ctrl.shouldShowToggler = shouldShowToggler;
  }

  function getAvailableSchemes(){
    return [
      { type: 'light', label: 'dark mode', icon: 'moon' },
      { type: 'dark', label: 'light mode', icon: 'sun' }
    ];
  }

  function getColorSchemeAttrName(){
    return 'data-pitsby-color-scheme';
  }
}

export default {
  controller,
  template
};
