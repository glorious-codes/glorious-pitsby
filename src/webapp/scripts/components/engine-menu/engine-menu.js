import '@styles/engine-menu.styl';
import projectsResource from '@scripts/resources/projects';
import template from './engine-menu.html';

function controller() {
  const $ctrl = this;

  $ctrl.$onInit = () => {
    fetchProjects();
  };

  function fetchProjects(){
    projectsResource.get().then(setProjects, err => {
      console.log('Failed to get projects', err);
    });
  }

  function setProjects(projects){
    $ctrl.projects = projects;
  }
}

export default {
  controller,
  template
};
