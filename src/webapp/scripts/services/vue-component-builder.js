import generate from 'nanoid/generate';
import domService from '@scripts/services/dom';

const _public = {};

_public.build = ({controller = {}, template = ''} = {}, container) => {
  const attr = buildContainerComponentIdAttribute();
  container.setAttribute(attr.name, attr.value);
  container.append(domService.parseHtml(template));
  return new Vue(controller).$mount(`[${attr.name}="${attr.value}"]`);
};

function buildContainerComponentIdAttribute(){
  return {
    name: 'data-component-id',
    value: generate(getValidChars(), 8)
  };
}

function getValidChars(){
  return '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
}

export default _public;
