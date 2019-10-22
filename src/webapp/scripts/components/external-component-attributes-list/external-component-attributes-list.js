import template from './external-component-attributes-list.html';

function controller(){
  const $ctrl = this;

  $ctrl.$onInit = () => {
    parseAttributesRequiredProp($ctrl.attributes);
  };

  function parseAttributesRequiredProp(attributes){
    attributes.forEach(attr => {
      attr.required = attr.required === true || isRequiredAPositiveStringValue(attr.required);
    });
  }

  function isRequiredAPositiveStringValue(required){
    return typeof required == 'string' && required.toLowerCase() === 'yes';
  }
}

export default {
  bindings: {
    attributes: '<',
    title: '@'
  },
  controller,
  template
};
