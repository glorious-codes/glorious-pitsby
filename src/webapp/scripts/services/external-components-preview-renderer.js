import reactComponentBuilder from '@scripts/services/react-component-builder';
import vanillaComponentBuilder from '@scripts/services/vanilla-component-builder';
import vueComponentBuilder from '@scripts/services/vue-component-builder';

const _public = {};

_public.render = (engine, component, { container, scope, angularComponentBuilder, angularContainer }) => {
  if(engine == 'angular')
    renderAngularComponent(angularComponentBuilder, angularContainer, scope, component);
  else
    getComponentRenderer(engine)(component, container);
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
}

function renderVueComponent(component, container){
  vueComponentBuilder.build(component, container);
}

function renderVanillaComponent(component, container){
  const element = vanillaComponentBuilder.build(component);
  container.append(element);
}

export default _public;
