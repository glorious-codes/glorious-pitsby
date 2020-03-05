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
    if($ctrl.pageFoldSubscriptionId)
      unsubscribeFromPageFoldService($ctrl.pageFoldSubscriptionId);
    externalComponentsPreviewRenderer.onDestroy($ctrl.engine, getContainer());
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
    externalComponentsPreviewRenderer.render(engine, component, {
      container: getContainer(),
      scope: $scope,
      angularComponentBuilder
    });
  }

  function getContainer(){
    return $element.find('div')[0];
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
