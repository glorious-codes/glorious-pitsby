import '@styles/components-menu.styl';
import componentsMenuService from '@scripts/services/components-menu';
import template from './components-menu.html';

function controller($transitions, routeService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setTransitions($transitions);
    listenRouteChange();
  };

  $ctrl.fetch = () => {
    routeService.getAllRoutes();
    return componentsMenuService.build(routeService.getParams('engine'));
  };

  $ctrl.fetchSuccess = items => {
    setItems(items);
    setFilteredItems(items);
    configActiveItem(items);
  };

  $ctrl.onSearchTermChange = term => {
    if(!term)
      setFilteredItems($ctrl.items);
    else
      setFilteredItems(componentsMenuService.filter($ctrl.items, term));
  };

  function setTransitions(transitions){
    $ctrl.$transitions = transitions;
  }

  function listenRouteChange(){
    $ctrl.$transitions.onSuccess({}, () => {
      configActiveItem($ctrl.items);
    });
  }

  function setItems(items){
    $ctrl.items = items;
  }

  function setFilteredItems(items){
    $ctrl.filteredItems = items;
  }

  function configActiveItem(items = []){
    return items.forEach(item => {
      if(item.children)
        return configActiveItem(item.children);
      item.active = isCurrentRoute(item.route);
    });
  }

  function isCurrentRoute(route){
    return routeService.isCurrentRoute(route.name, route.params);
  }
}

controller.$inject = ['$transitions', 'routeService'];

export default {
  controller,
  template
};
