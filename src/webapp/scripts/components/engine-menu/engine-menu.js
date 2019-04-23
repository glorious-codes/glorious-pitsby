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
    configMenuVisibility(projects);
  }

  function onFetchProjectsError(err){
    console.log('Failed to get projects', err);
  }

  function setProjects(projects){
    $ctrl.projects = projects;
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
