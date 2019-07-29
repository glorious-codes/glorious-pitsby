import externalComponentsPlaygroundDefaultCodeBuilder from '@scripts/services/external-components-playground-default-code-builder';

const _public = {};

_public.build = (engine, template, controller, styles) => {
  if(shouldBuildDefaultPreview(template, controller))
    return externalComponentsPlaygroundDefaultCodeBuilder.build(engine);
  return { controller, styles, template };
};

function shouldBuildDefaultPreview(template, controller){
  return !template && !controller;
}

export default _public;
