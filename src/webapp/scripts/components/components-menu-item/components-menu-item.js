import '@styles/components-menu-item.styl';
import template from './components-menu-item.html';

function controller($timeout, $element, routeService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setHasChildrenCssClass(buildHasChildrenCssClass());
    setChildrenVisibilityCssClass(buildChildrenVisibilityCssClass());
  };

  $ctrl.handleItemClick = () => {
    const item = $ctrl.item;
    handleNavigation(item.route);
    if($ctrl.onItemClick)
      $ctrl.onItemClick(item);
  };

  function handleNavigation(route){
    return route ?
      goToRoute({ name: route.name, params: route.params }) :
      setChildrenVisibilityCssClass(buildChildrenVisibilityCssClass());
  }

  function buildHasChildrenCssClass(){
    return $ctrl.item.children ? 'p-components-menu-item-has-children' : '';
  }

  function setHasChildrenCssClass(cssClass){
    $ctrl.hasChildrenCssClass = cssClass;
  }

  function goToRoute({ name, params }){
    routeService.go(name, params, { resetUrlPath: true });
  }

  function buildChildrenVisibilityCssClass(){
    return $ctrl.item.children && !$ctrl.childrenVisibilityCssClass ? 'p-components-menu-item-children-visible' : '';
  }

  function setChildrenVisibilityCssClass(cssClass){
    $ctrl.childrenVisibilityCssClass = cssClass;
  }
}

controller.$inject = ['$timeout', '$element', 'routeService'];

export default {
  transclude: true,
  bindings: {
    item: '<',
    onItemClick: '<'
  },
  controller,
  template
};
