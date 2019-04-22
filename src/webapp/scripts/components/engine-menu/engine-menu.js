import '@styles/engine-menu.styl';
import projectsResource from '@scripts/resources/projects';
import template from './engine-menu.html';

function controller(routeService) {
  const $ctrl = this;

  $ctrl.$onInit = () => {
    fetchProjects().then(onFetchProjectsSuccess, onFetchProjectsError);
  };

  function fetchProjects(){
    return projectsResource.get();
  }

  function onFetchProjectsSuccess(projects){
    setProjects(projects);
    configMenuVisibility(projects);
    if(!isNoProjectSelected())
      selectProject(projects[0]);
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

  function isNoProjectSelected(){
    return routeService.getParams('engine');
  }

  function selectProject(project){
    routeService.go('app.external-components', {
      engine: project.engine
    });
  }
}

controller.$inject = ['routeService'];

export default {
  controller,
  template
};
