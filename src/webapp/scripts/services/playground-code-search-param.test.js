import playgroundCodeSearchParam from './playground-code-search-param';

describe('Playground Code Search Param', () => {
  function buildExampleCode(){
    return {
      template: '<div>Hello!</div>',
      controller: 'function() { console.log("Hello!") }',
      styles: '.class { display: none; }'
    };
  }

  function buildUrlSearchParam(){
    return [
      'eyJ0ZW1wbGF0ZSI6IjxkaXY%2BSGVsbG8hPC9kaXY%2BIiwiY29udHJvbGxlciI6ImZ1bmN',
      '0aW9uKCkgeyBjb25zb2xlLmxvZyhcIkhlbGxvIVwiKSB9Iiwic3R5bGVzIjoiLmNsYXNzIH',
      'sgZGlzcGxheTogbm9uZTsgfSJ9'
    ].join('');
  }

  it('should parse code search param into preview object', () => {
    const urlSearchParam = buildUrlSearchParam();
    const { template, controller, styles } = buildExampleCode();
    const code = playgroundCodeSearchParam.parse(urlSearchParam);
    expect(code.template).toEqual(template);
    expect(code.controller).toEqual(controller);
    expect(code.styles).toEqual(styles);
  });

  it('should return nothing if no stringified code has been given', () => {
    const code = playgroundCodeSearchParam.parse();
    expect(code).toEqual(undefined);
  });

  it('should stringify code object', () => {
    const { template, controller, styles } = buildExampleCode();
    const expectedUrlSearchParam = buildUrlSearchParam();
    const stringifiedCode = playgroundCodeSearchParam.stringify(template, controller, styles);
    expect(stringifiedCode).toEqual(expectedUrlSearchParam);
  });
});
