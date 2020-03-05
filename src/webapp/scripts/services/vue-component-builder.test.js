import vueComponentBuilder from './vue-component-builder';

describe('Vue Component Builder', () => {
  it('should render a component with no controller', () => {
    const component = { template: '<p>Hello!</p>' };
    const builtComponent = vueComponentBuilder.build(component);
    expect(builtComponent.textContent).toEqual('Hello!');
  });

  it('should render a component containing a controller', () => {
    window.alert = jest.fn();
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
    const builtComponent = vueComponentBuilder.build(component);
    builtComponent.click();
    expect(window.alert).toHaveBeenCalledWith('Rafael');
  });

  it('should return null if no component has been given', () => {
    const builtComponent = vueComponentBuilder.build();
    expect(builtComponent).toEqual(null);
  });
});
