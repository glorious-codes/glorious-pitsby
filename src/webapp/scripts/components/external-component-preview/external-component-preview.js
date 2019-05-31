import jsonService from '../../../../cli/services/json';
import vueComponentBuilder from '@scripts/services/vue-component-builder';
import vanillaComponentBuilder from '@scripts/services/vanilla-component-builder';
import template from './external-component-preview.html';

function controller($scope, $element, angularComponentBuilder){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    const exampleCopy = angular.copy($ctrl.example);
    buildComponent($ctrl.engine, jsonService.parseFunctions(exampleCopy));
    handleExampleStyles(getExampleStyles(exampleCopy));
  };

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
}

controller.$inject = ['$scope', '$element', 'angularComponentBuilder'];

export default {
  bindings: {
    example: '<',
    engine: '<'
  },
  controller,
  template
};
