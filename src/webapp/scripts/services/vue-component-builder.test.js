import vueComponentBuilder from './vue-component-builder';

describe('Vue Component Builder', () => {
  function createContainer(){
    const container = document.createElement('div');
    document.body.append(container);
    return container;
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render a component with no controller', () => {
    const container = createContainer();
    const component = {
      template: '<p>Hello</p>'
    };
    const vm = vueComponentBuilder.build(component, container);
    expect(vm.$el.innerHTML).toEqual('Hello');
  });

  it('should render a component containing a controller', () => {
    window.alert = jest.fn();
    const container = createContainer();
    const component = {
      controller: {
        data(){
          return {
            name: 'Rafael'
          };
        },
        methods: {
          greet(){
            window.alert(this.name);
          }
        }
      },
      template: '<button @click="greet">Greet</button>'
    };
    const vm = vueComponentBuilder.build(component, container);
    vm.$el.click();
    expect(window.alert).toHaveBeenCalledWith('Rafael');
  });

  it('should append component into the given container', () => {
    const component = { template: '<div><p></p></div>' };
    const vm = vueComponentBuilder.build(component, createContainer());
    expect(vm.$el.querySelectorAll('p').length).toEqual(1);
  });

  it('should do nothing if no component has been given', () => {
    const container = createContainer();
    vueComponentBuilder.build(undefined, container);
    expect(container.innerHTML).toEqual('');
  });
});
