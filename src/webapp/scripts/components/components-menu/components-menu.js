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
    return componentsMenuService.build(routeService.getParams('engine'));
  };

  $ctrl.fetchSuccess = items => {
    setItems(items);
    configActiveItem(items);
  };

  $ctrl.onSearchTermChange = term => {
    componentsMenuService.configItemsVisibilityByTerm($ctrl.items, term);
    configNoResultsMessageVisibility(getVisibleItems($ctrl.items));
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

  function getVisibleItems(items){
    return componentsMenuService.getVisibleItems(items);
  }

  function configNoResultsMessageVisibility(visibleItems){
    const shouldShowNoResultsMessage = visibleItems.length === 0;
    setNoResultsMessageVisibility(shouldShowNoResultsMessage);
  }

  function setNoResultsMessageVisibility(shouldShow){
    $ctrl.shouldShowNoResultsMessage = shouldShow;
  }
}

controller.$inject = ['$transitions', 'routeService'];

export default {
  bindings: {
    onItemClick: '<'
  },
  controller,
  template
};
