import '@styles/external-components-playground.styl';
import playgroundCodeSearchParamService from '@scripts/services/playground-code-search-param';
import externalComponentsPlaygroundCodeBuilder from '@scripts/services/external-components-playground-code-builder';
import template from './external-components-playground.html';

function controller($timeout, $element, routeService){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    setEngine(routeService.getParams('engine'));
    setTemplateTabVisibility(getTemplateTabVisibility());
    setControllerCodeEditorLanguage(($ctrl.engine == 'react' ? 'jsx' : 'javascript'));
    setCssClasses(buildCssClasses());
    handleCodeSearchParam(routeService.getParams('code'));
  };

  $ctrl.onPreviewRender = () => {
    const code = buildPreviewCode($ctrl);
    handlePreviewCodeParts(code);
    renderPreview($ctrl.engine, code);
  };

  $ctrl.onPreviewDestroy = () => {
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

  function setTemplateTabVisibility(shouldShow){
    $ctrl.shouldShowTemplateTab = shouldShow;
  }

  function buildCssClasses(){
    const cssClasses = ['p-external-components-playground'];
    if(routeService.getParams('source') == 'edit-link') cssClasses.push('p-external-components-playground-padding');
    return cssClasses.join(' ');
  }

  function setCssClasses(cssClasses){
    $ctrl.cssClasses = cssClasses;
  }

  function getTemplateTabVisibility(){
    return $ctrl.engine != 'react';
  }

  function setControllerCodeEditorLanguage(language){
    $ctrl.controllerCodeLanguage = language;
  }

  function handleCodeSearchParam(code){
    const { parse } = playgroundCodeSearchParamService;
    const previewCode = code ? parse(code) : buildPreviewCode($ctrl);
    handlePreviewCodeParts(previewCode);
    renderPreview($ctrl.engine, previewCode);
  }

  function handlePreviewCodeParts({ controller, styles, template }){
    $ctrl.setTemplate(template);
    $ctrl.setController(controller);
    $ctrl.setStyles(styles);
  }

  function buildPreviewCode({ engine, template, controller, styles }){
    return externalComponentsPlaygroundCodeBuilder.build(engine, template, controller, styles);
  }

  function renderPreview(engine, { template, controller, styles }){
    setPreview(buildPreview(engine, { template, controller, styles }));
    setPreviewVisibility(true);
    $timeout(() => routeService.setParam('code', playgroundCodeSearchParamService.stringify(template, controller, styles)));
  }

  function buildPreview(engine, { controller, template, styles }){
    return {
      controller: engine == 'react' ? controller : eval(`(function(){ ${controller} }())`),
      styles,
      template
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
