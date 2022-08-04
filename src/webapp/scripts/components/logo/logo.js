import '@styles/logo.styl';
import externalGlobalDataService from '@scripts/services/external-global-data';
import template from './logo.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    const customImageAttrs = getCustomImageAttrs();
    const imageAttrs = customImageAttrs || getDefaultImageAttrs();
    setImageAttrs(imageAttrs);
  };

  function getCustomImageAttrs(){
    const { filepath, width, height, fingerprint } = getCustomLogoGlobalData();
    return filepath && {
      src: `${filepath}?t=${fingerprint}`,
      width: parseCustomImageAttrs(width),
      height: parseCustomImageAttrs(height)
    };
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

  function getDefaultImageAttrs(){
    return {
      src: '/images/logo.svg',
      width: '130px',
      height: '40px'
    };
  }

  function setImageAttrs(imageAttrs){
    $ctrl.imageAttrs = imageAttrs;
  }
}

export default {
  template,
  controller
};
