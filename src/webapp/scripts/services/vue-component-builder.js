const _public = {};

_public.build = ({controller = {}, template} = {}) => {
  return template ? mountComponent({ controller, template }) : null;
};

function mountComponent({ controller, template }){
  const vm = new Vue({ template, ...controller });
  vm.$mount();
  return vm.$el;
}

export default _public;
