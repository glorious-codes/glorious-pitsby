import vueControllerSyntaxService from './vue-controller-syntax';

describe('Vue Controller Syntax Service', () => {
  it('should remove breakline marks', () => {
    const code = 'function () {\\n alert("Hello!");\\n}';
    const improvedText = vueControllerSyntaxService.improve(code, 'javascript');
    expect(improvedText).toEqual(`function () {
 alert("Hello!");
}`);
  });

  it('should remove character escaping', () => {
    const code = 'function () { alert(\\"Hello!\\"); }';
    const improvedText = vueControllerSyntaxService.improve(code, 'javascript');
    expect(improvedText).toEqual('function () { alert("Hello!"); }');
  });

  it('should deduplicate function names', () => {
    const code = `{
  "methods": {
    "greet": "greet() { alert('Hello!'); }"
  }
}`;
    const improvedText = vueControllerSyntaxService.improve(code, 'javascript');
    expect(improvedText).toEqual(`{
  "methods": {
    greet() { alert('Hello!'); }
  }
}`);
  });

  it('should remove quotes around functions', () => {
    const code = `{
  "methods": {
    "greet": "function () {
      alert('Hello!');
    }"
  }
}`;
    const improvedText = vueControllerSyntaxService.improve(code, 'javascript');
    expect(improvedText).toEqual(`{
  "methods": {
    greet() {
      alert('Hello!');
    }
  }
}`);
  });

  it('should return empty string if no code has been provided', () => {
    expect(vueControllerSyntaxService.improve()).toEqual('');
  });
});
