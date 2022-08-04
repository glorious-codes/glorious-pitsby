import projectsResource from '@scripts/resources/projects';

function engineRedirectionService(routeService){
  const _public = {};

  _public.init = () => {
    projectsResource.get().then(onGetProjectsSuccess, onGetProjectsError);
  };

  function onGetProjectsError(err){
    console.log(`Failed to redirect to the appropriate engine: ${err}`);
  }

  function onGetProjectsSuccess(projects){
    if(!routeService.getParams('engine'))
      redirect(projects);
  }

  function redirect(projects){
    routeService.go('app.external-components', {
      engine: projects[0].engine
    });
  }

  return _public;
}

engineRedirectionService.$inject = ['routeService'];

export default engineRedirectionService;
