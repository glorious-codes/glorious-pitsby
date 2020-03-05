import ReactDOM from 'react-dom';
import reactComponentBuilder from '@scripts/services/react-component-builder';
import vanillaComponentBuilder from '@scripts/services/vanilla-component-builder';
import vueComponentBuilder from '@scripts/services/vue-component-builder';

const _public = {};

_public.render = (engine, component, { container, scope, angularComponentBuilder }) => {
  if(engine == 'angular')
    renderAngularComponent(angularComponentBuilder, scope, component, container);
  else
    getComponentRenderer(engine)(component, container);
};

_public.onDestroy = (engine, container) => {
  if(engine == 'react')
    unmountReactComponent(container);
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

function renderAngularComponent(builder, scope, component, container){
  const element = builder.build(component, scope);
  container.append(element);
}

function renderReactComponent({ controller }, container){
  const element = reactComponentBuilder.build(controller);
  ReactDOM.render(element, container);
}

function renderVueComponent(component, container){
  const element = vueComponentBuilder.build(component);
  container.append(element);
}

function renderVanillaComponent(component, container){
  const element = vanillaComponentBuilder.build(component);
  container.append(element);
}

function unmountReactComponent(container){
  ReactDOM.unmountComponentAtNode(container);
}

export default _public;
