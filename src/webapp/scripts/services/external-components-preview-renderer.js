import reactComponentBuilder from '@scripts/services/react-component-builder';
import vanillaComponentBuilder from '@scripts/services/vanilla-component-builder';
import vueComponentBuilder from '@scripts/services/vue-component-builder';

const _public = {};

_public.render = (engine, component, { container, scope, angularComponentBuilder, angularContainer }) => {
  if(engine == 'angular')
    renderAngularComponent(angularComponentBuilder, angularContainer, scope, component);
  else
    return getComponentRenderer(engine)(component, container);
};

_public.destroy = (engine, instance) => {
  switch (engine) {
  case 'react':
    return reactComponentBuilder.unbuild(instance);
  case 'vue':
    return vueComponentBuilder.unbuild(instance);
  }
};

function getComponentRenderer(engine){
  return getAvailableComponentRenderes()[engine];
}

function getAvailableComponentRenderes(){
  return {
    react: renderReactComponent,
    vanilla: renderVanillaComponent,
    vue: renderVueComponent
  };
}

function renderAngularComponent(builder, container, scope, component){
  const element = builder.build(component, scope);
  container.append(element);
}

function renderReactComponent({ controller }, container){
  const element = reactComponentBuilder.build(controller);
  ReactDOM.render(element, container);
  return container;
}

function renderVueComponent(component, container){
  const vm = vueComponentBuilder.build(component, container);
  return vm;
}

function renderVanillaComponent(component, container){
  const element = vanillaComponentBuilder.build(component);
  container.append(element);
}

export default _public;
