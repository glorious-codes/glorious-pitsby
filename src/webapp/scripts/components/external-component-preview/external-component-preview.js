import jsonService from '../../../../cli/services/json';
import pageFoldService from '@scripts/services/page-fold';
import vueComponentBuilder from '@scripts/services/vue-component-builder';
import vanillaComponentBuilder from '@scripts/services/vanilla-component-builder';
import template from './external-component-preview.html';

function controller($scope, $timeout, $element, angularComponentBuilder){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    $timeout(() => {
      const id = pageFoldService.subscribe($element[0], () => {
        $scope.$apply(() => onShowUp());
      });
      setPageFoldSubscriberId(id);
    });
  };

  $ctrl.$onDestroy = () => {
    if($ctrl.pageFoldSubscriptionId)
      unsubscribeFromPageFoldService($ctrl.pageFoldSubscriptionId);
  };

  function onShowUp(){
    return !$ctrl.rendered ? render(angular.copy($ctrl.example)) : null;
  }

  function render(example){
    buildComponent($ctrl.engine, jsonService.parseFunctions(example));
    handleExampleStyles(getExampleStyles(example));
    unsubscribeFromPageFoldService($ctrl.pageFoldSubscriptionId);
    setPageFoldSubscriberId(null);
    setRendered(true);
  }

  function getExampleStyles(example){
    return example && example.styles;
  }

  /* eslint-disable complexity */
  function buildComponent(engine, component){
    switch (engine) {
    case 'angular':
      return handleAngularComponent(component);
    case 'vue':
      return handleVueComponent(component);
    case 'vanilla':
      return handleVanillaComponent(component);
    }
  }

  function handleAngularComponent(component){
    const element = angularComponentBuilder.build(component, $scope);
    $element.find('div').append(element);
  }

  function handleVueComponent(component){
    vueComponentBuilder.build(component, $element.find('div')[0]);
  }

  function handleVanillaComponent(component){
    const element = vanillaComponentBuilder.build(component);
    $element.find('div').append(element);
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
