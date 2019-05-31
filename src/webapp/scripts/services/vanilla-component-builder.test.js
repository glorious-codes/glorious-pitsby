import vanillaComponentBuilder from './vanilla-component-builder';

describe('Vanilla Component Builder', () => {
  it('should build a component with no controller', () => {
    const component = {
      template: '<div><p>Hello</p></div>'
    };
    const element = vanillaComponentBuilder.build(component);
    expect(element.querySelector('p').innerHTML).toEqual('Hello');
  });

  it('should build component containing a controller', () => {
    window.alert = jest.fn();
    const component = {
      controller: function(element) {
        const button = element.querySelector('button');
        button.addEventListener('click', () => window.alert('Rafael'));
      },
      template: '<button>Greet</button>'
    };
    const element = vanillaComponentBuilder.build(component);
    element.querySelector('button').click();
    expect(window.alert).toHaveBeenCalledWith('Rafael');
  });

  it('should return an empty div if no component has been given', () => {
    const element = vanillaComponentBuilder.build();
    expect(element.tagName).toEqual('DIV');
    expect(element.innerHTML).toEqual('');
  });
});
