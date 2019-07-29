import '@styles/external-components-playground.styl';
import externalComponentsPlaygroundCodeBuilder from '@scripts/services/external-components-playground-code-builder';
import template from './external-components-playground.html';

function controller(routeService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setEngine(routeService.getParams('engine'));
    $ctrl.renderPreview();
  };

  $ctrl.renderPreview = () => {
    const code = buildPreviewCode();
    handlePreviewCodeParts(code);
    setPreview(buildPreview(code));
    setPreviewVisibility(true);
  };

  $ctrl.destroyPreview = () => {
    setPreviewVisibility(false);
  };

  function setEngine(engine){
    $ctrl.engine = engine;
  }

  function handlePreviewCodeParts({ controller, styles, template }){
    setTemplate(template);
    setController(controller);
    setStyles(styles);
  }

  function buildPreviewCode(){
    const { build } = externalComponentsPlaygroundCodeBuilder;
    return build($ctrl.engine, $ctrl.template, $ctrl.controller, $ctrl.styles);
  }

  function buildPreview(code){
    return {
      controller: eval(`(function(){ ${code.controller} }())`),
      styles: code.styles,
      template: code.template
    };
  }

  function setTemplate(template){
    $ctrl.template = template;
  }

  function setController(controller){
    $ctrl.controller = controller;
  }

  function setStyles(styles){
    $ctrl.styles = styles;
  }

  function setPreview(preview){
    $ctrl.preview = preview;
  }

  function setPreviewVisibility(shouldShow){
    $ctrl.shouldShowPreview = shouldShow;
  }
}

controller.$inject = ['routeService'];

export default {
  controller,
  template
};
