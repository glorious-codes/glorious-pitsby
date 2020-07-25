import externalComponentsPreviewRenderer from '@scripts/services/external-components-preview-renderer';
import jsonService from '@scripts/services/json';
import pageFoldService from '@scripts/services/page-fold';
import template from './external-component-preview.html';

function controller($scope, $timeout, $element, angularComponentBuilder){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    $timeout(() => {
      const id = pageFoldService.subscribe($element[0], () => $scope.$apply(onShowUp));
      setPageFoldSubscriberId(id);
    });
  };

  $ctrl.$onDestroy = () => {
    const { engine, instance, pageFoldSubscriptionId } = $ctrl;
    if(pageFoldSubscriptionId)
      unsubscribeFromPageFoldService(pageFoldSubscriptionId);
    if(instance)
      externalComponentsPreviewRenderer.destroy(engine, instance);
  };

  function onShowUp(){
    const { rendered, engine, example, pageFoldSubscriptionId } = $ctrl;
    if(!rendered)
      render(engine, angular.copy(example), pageFoldSubscriptionId);
  }

  function render(engine, example, pageFoldSubscriptionId){
    handleExampleStyles(getExampleStyles(example));
    buildComponent(engine, jsonService.handleFunctions(example, { engine: engine }));
    unsubscribeFromPageFoldService(pageFoldSubscriptionId);
    setPageFoldSubscriberId(null);
    setRendered(true);
  }

  function getExampleStyles(example){
    return example && example.styles;
  }

  function handleExampleStyles(styles){
    if(!styles)
      return;
    const styleTag = buildStyleTag(styles);
    $element.prepend(styleTag);
  }

  function buildStyleTag(styles){
    const tag = document.createElement('style');
    tag.innerHTML = styles;
    return tag;
  }

  function buildComponent(engine, component){
    const instance = externalComponentsPreviewRenderer.render(engine, component, {
      container: getContainer()[0],
      scope: $scope,
      angularContainer: getContainer(),
      angularComponentBuilder
    });
    setInstance(instance);
  }

  function getContainer(){
    return $element.find('div');
  }

  function setPageFoldSubscriberId(id){
    $ctrl.pageFoldSubscriptionId = id;
  }

  function unsubscribeFromPageFoldService(subscriberId){
    pageFoldService.unsubscribe(subscriberId);
  }

  function setRendered(rendered){
    $ctrl.rendered = rendered;
  }

  function setInstance(instance){
    $ctrl.instance = instance;
  }
}

controller.$inject = ['$scope', '$timeout', '$element', 'angularComponentBuilder'];

export default {
  bindings: {
    example: '<',
    engine: '<'
  },
  controller,
  template
};
