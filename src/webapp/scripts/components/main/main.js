import '@styles/main.styl';
import projectsResource from '@scripts/resources/projects';
import template from './main.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    projectsResource.get().then(projects => {
      setTopOffsetCssClass(buildTopOffsetCssClass(projects));
    }, err => console.log('Failed to get projects', err));
  };

  function buildTopOffsetCssClass(projects){
    return projects && projects.length > 1 ? 'p-main-top-offset' : '';
  }

  function setTopOffsetCssClass(cssClass){
    $ctrl.topOffsetCssClass = cssClass;
  }
}

export default {
  transclude: true,
  controller,
  template
};
