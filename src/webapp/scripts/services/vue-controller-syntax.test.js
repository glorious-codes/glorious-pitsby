import vueControllerSyntaxService from './vue-controller-syntax';

describe('Vue Controller Syntax Service', () => {
  it('should deduplicate function names', () => {
    const code = {
      methods: {
        greet: 'greet() { alert(\'Hello!\'); }'
      }
    };
    const improvedText = vueControllerSyntaxService.stringify(code);
    expect(improvedText).toEqual(`{
  "methods": {
    greet() { alert('Hello!'); }
  }
}`);
  });

  it('should remove quotes around functions', () => {
    const code = {
      methods: {
        greet: `function () {
      alert('Hello!');
    }`
      }
    };
    const improvedText = vueControllerSyntaxService.stringify(code);
    expect(improvedText).toEqual(`{
  "methods": {
    greet() {
      alert('Hello!');
    }
  }
}`);
  });

  it('should return empty string if no code has been provided', () => {
    expect(vueControllerSyntaxService.stringify()).toEqual('');
  });
});
