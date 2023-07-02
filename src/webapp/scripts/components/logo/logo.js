import PUBSUB_EVENT_NAMES from '@scripts/constants/pubsub-event-names';
import pubsubService from '@scripts/services/pubsub';
import externalGlobalDataService from '@scripts/services/external-global-data';
import template from './logo.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setImageAttrs(buildImageAttributes());
    listenColorSchemeChange();
  };

  $ctrl.$onDestroy = () => {
    pubsubService.unsubscribe($ctrl.colorSchemeListenerId);
  };

  function buildImageAttributes({ scheme } = {}){
    return getCustomImageAttrs(scheme) || getDefaultImageAttrs(scheme);
  }

  function getCustomImageAttrs(scheme){
    const { filepath, darkVersionFilepath, width, height, fingerprint } = getCustomLogoGlobalData();
    return filepath && {
      src: `${getCustomLogoSrc(filepath, darkVersionFilepath, scheme)}?t=${fingerprint}`,
      width: parseCustomImageAttrs(width),
      height: parseCustomImageAttrs(height)
    };
  }

  function getCustomLogoSrc(filepath, darkVersionFilepath, scheme){
    return scheme == 'dark' && darkVersionFilepath ? darkVersionFilepath : filepath;
  }

  function parseCustomImageAttrs(attr){
    return attr || '';
  }

  function getCustomLogoGlobalData(){
    const { custom, fingerprint } = getCustomGlobalData();
    return custom && custom.logo ? { ...custom.logo, fingerprint } : {};
  }

  function getCustomGlobalData(){
    const data = externalGlobalDataService.get();
    return data && { custom: data.custom, fingerprint: data.fingerprint };
  }

  function getDefaultImageAttrs(scheme){
    return {
      src: `/images/${getDefaultLogoFilename(scheme)}.svg`,
      width: '130px',
      height: '40px'
    };
  }

  function getDefaultLogoFilename(scheme){
    return scheme == 'dark' ? 'logo-dark' : 'logo';
  }

  function setImageAttrs(imageAttrs){
    $ctrl.imageAttrs = imageAttrs;
  }

  function listenColorSchemeChange(){
    setColorSchemeListenerId(
      pubsubService.subscribe(
        PUBSUB_EVENT_NAMES.COLOR_SCHEME_CHANGED,
        handleColorSchemeChange
      )
    );
  }

  function handleColorSchemeChange({ scheme }){
    setImageAttrs(buildImageAttributes({ scheme }));
  }

  function setColorSchemeListenerId(id){
    $ctrl.colorSchemeListenerId = id;
  }
}

export default {
  template,
  controller
};
