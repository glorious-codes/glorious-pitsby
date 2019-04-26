import '@styles/engine-menu.styl';
import projectsResource from '@scripts/resources/projects';
import template from './engine-menu.html';

function controller() {
  const $ctrl = this;

  $ctrl.$onInit = () => {
    projectsResource.get().then(onFetchProjectsSuccess, onFetchProjectsError);
  };

  function onFetchProjectsSuccess(projects){
    setProjects(projects);
    setItemsWidth(buildItemsWidth(projects.length));
    configMenuVisibility(projects);
  }

  function onFetchProjectsError(err){
    console.log('Failed to get projects', err);
  }

  function setProjects(projects){
    $ctrl.projects = projects;
  }

  function buildItemsWidth(numberOfProjects){
    return `${parseFloat(100 / numberOfProjects).toFixed(3)}%`;
  }

  function setItemsWidth(width){
    $ctrl.itemsWidth = width;
  }

  function configMenuVisibility(projects){
    const shouldShow = projects.length > 1;
    setMenuVisibility(shouldShow);
  }

  function setMenuVisibility(shouldShow){
    $ctrl.shouldShowMenu = shouldShow;
  }
}

export default {
  controller,
  template
};
