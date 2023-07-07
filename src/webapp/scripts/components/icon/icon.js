import '@styles/icon.styl';
import { IMAGES_ROOT_PATH } from '@scripts/constants/images';
import template from './icon.html';

function controller() {
  const $ctrl = this;

  $ctrl.$onInit = () => {
    configIcon($ctrl.iconName);
  };

  $ctrl.$onChanges = ({ iconName }) => {
    configIcon(iconName.currentValue);
  };

  function configIcon(iconName){
    setClasses(buildClasses(iconName));
    setStyles(buildStyles(iconName));
  }

  function buildClasses(iconName){
    const baseClass = 'p-icon';
    return iconName ? `${baseClass} p-icon-${iconName}` : baseClass;
  }

  function setClasses(classes){
    $ctrl.classes = classes;
  }

  function buildStyles(iconName){
    const maskImageUrl = iconName && buildMaskImageUrl(iconName);
    return maskImageUrl ?
      {'-webkit-mask-image': maskImageUrl, 'mask-image': maskImageUrl } :
      {};
  }

  function buildMaskImageUrl(iconName){
    return `url("${IMAGES_ROOT_PATH}/icon-${iconName}.svg")`;
  }

  function setStyles(styles){
    $ctrl.styles = styles;
  }
}

export default {
  bindings: {
    iconName: '@'
  },
  controller,
  template
};
