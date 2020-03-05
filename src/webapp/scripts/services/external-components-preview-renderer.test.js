import ReactDOM from 'react-dom';
import reactComponentBuilder from '@scripts/services/react-component-builder';
import vanillaComponentBuilder from '@scripts/services/vanilla-component-builder';
import vueComponentBuilder from '@scripts/services/vue-component-builder';
import externalComponentsPreviewRenderer from './external-components-preview-renderer';

describe('External Component Preview Renderer Service', () => {
  function mockBuiltComponent(){
    const component = document.createElement('h1');
    component.textContent = 'Hello!';
    return component;
  }

  function buildContainer(){
    return document.createElement('div');
  }

  function buildComponentMock(){
    return { controller: 'function controller(){}' };
  }

  it('should render an external Angular component', () => {
    const container = buildContainer();
    const component = buildComponentMock();
    const scope = {some: 'scope'};
    const builder = { build: jest.fn(() => mockBuiltComponent()) };
    externalComponentsPreviewRenderer.render('angular', component, {
      angularComponentBuilder: builder,
      container,
      scope
    });
    expect(builder.build).toHaveBeenCalledWith(component, scope);
    expect(container.querySelector('h1').textContent).toEqual('Hello!');
  });

  it('should render an external React component', () => {
    const container = buildContainer();
    const component = buildComponentMock();
    const reactComponentMock = { some: 'react component' };
    ReactDOM.render = jest.fn();
    reactComponentBuilder.build = jest.fn(() => reactComponentMock);
    externalComponentsPreviewRenderer.render('react', component, { container });
    expect(reactComponentBuilder.build).toHaveBeenCalledWith(component.controller);
    expect(ReactDOM.render).toHaveBeenCalledWith(reactComponentMock, container);
  });

  it('should render an external Vanilla component', () => {
    const container = buildContainer();
    const component = buildComponentMock();
    vanillaComponentBuilder.build = jest.fn(() => mockBuiltComponent());
    externalComponentsPreviewRenderer.render('vanilla', component, { container});
    expect(vanillaComponentBuilder.build).toHaveBeenCalledWith(component);
    expect(container.querySelector('h1').textContent).toEqual('Hello!');
  });

  it('should render an external Vue component', () => {
    const container = buildContainer();
    const component = buildComponentMock();
    vueComponentBuilder.build = jest.fn(() => mockBuiltComponent());
    externalComponentsPreviewRenderer.render('vue', component, { container });
    expect(vueComponentBuilder.build).toHaveBeenCalledWith(component);
    expect(container.querySelector('h1').textContent).toEqual('Hello!');
  });

  it('should unmount component on destroy if engine is React', () => {
    const container = buildContainer();
    ReactDOM.unmountComponentAtNode = jest.fn();
    externalComponentsPreviewRenderer.onDestroy('react', container);
    expect(ReactDOM.unmountComponentAtNode).toHaveBeenCalledWith(container);
  });

  it('should do nothing on destroy if engine is not React', () => {
    ReactDOM.unmountComponentAtNode = jest.fn();
    externalComponentsPreviewRenderer.onDestroy('vue', buildContainer());
    expect(ReactDOM.unmountComponentAtNode).not.toHaveBeenCalled();
  });
});
