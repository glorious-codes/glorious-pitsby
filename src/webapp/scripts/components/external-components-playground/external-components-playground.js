import '@styles/external-components-playground.styl';
import playgroundCodeSearchParamService from '@scripts/services/playground-code-search-param';
import externalComponentsPlaygroundCodeBuilder from '@scripts/services/external-components-playground-code-builder';
import template from './external-components-playground.html';

function controller($timeout, $element, routeService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setEngine(routeService.getParams('engine'));
    handleCodeSearchParam(routeService.getParams('code'));
  };

  $ctrl.onPreviewRendering = () => {
    const code = buildPreviewCode();
    handlePreviewCodeParts(code);
    renderPreview(code);
  };

  $ctrl.onPreviewDestroying = () => {
    setPreviewVisibility(false);
  };

  $ctrl.setTemplate = template => {
    $ctrl.template = template;
  };

  $ctrl.setController = controller => {
    $ctrl.controller = controller;
  };

  $ctrl.setStyles = styles => {
    $ctrl.styles = styles;
  };

  function setEngine(engine){
    $ctrl.engine = engine;
  }

  function handleCodeSearchParam(code){
    const { parse } = playgroundCodeSearchParamService;
    const previewCode = code ? parse(code) : buildPreviewCode();
    handlePreviewCodeParts(previewCode);
    renderPreview(previewCode);
  }

  function handlePreviewCodeParts({ controller, styles, template }){
    $ctrl.setTemplate(template);
    $ctrl.setController(controller);
    $ctrl.setStyles(styles);
  }

  function buildPreviewCode(){
    const { build } = externalComponentsPlaygroundCodeBuilder;
    return build($ctrl.engine, $ctrl.template, $ctrl.controller, $ctrl.styles);
  }

  function renderPreview(previewCode){
    const { template, controller, styles } = previewCode;
    setPreview(buildPreview(previewCode));
    setPreviewVisibility(true);
    const param = playgroundCodeSearchParamService.format(template, controller, styles);
    $timeout(() => routeService.setParam('code', param));
  }

  function buildPreview(code){
    return {
      controller: eval(`(function(){ ${code.controller} }())`),
      styles: code.styles,
      template: code.template
    };
  }

  function setPreview(preview){
    $ctrl.preview = preview;
  }

  function setPreviewVisibility(shouldShow){
    $ctrl.shouldShowPreview = shouldShow;
  }
}

controller.$inject = ['$timeout', '$element', 'routeService'];

export default {
  controller,
  template
};
