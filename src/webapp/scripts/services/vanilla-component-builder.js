import domService from '@scripts/services/dom';

const _public = {};

_public.build = ({controller, template = ''} = {}) => {
  const exampleElement = domService.parseHtml(`<div>${template}</div>`);
  if(controller)
    controller(exampleElement);
  return exampleElement;
};

export default _public;
