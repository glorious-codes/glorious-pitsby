import playgroundCodeSearchParam from './playground-code-search-param';

describe('Playground Code Search Param', () => {
  it('should parse code search param into preview object', () => {
    const template = '<div>Hello!</div>';
    const controller = 'function() { console.log("Hello!") }';
    const styles = '.class { display: none; }';
    const codeParam = btoa(JSON.stringify({ template, controller, styles}));
    const preview = playgroundCodeSearchParam.parse(codeParam);
    expect(preview.template).toEqual(template);
    expect(preview.controller).toEqual(controller);
    expect(preview.styles).toEqual(styles);
  });

  it('should return nothing if no code has been given to be parsed', () => {
    const preview = playgroundCodeSearchParam.parse();
    expect(preview).toEqual(undefined);
  });

  it('should format preview object into code search param', () => {
    const template = '<div>Hello!</div>';
    const controller = 'function() { console.log("Hello!") }';
    const styles = '.class { display: none; }';
    const codeParam = playgroundCodeSearchParam.format({ template, controller, styles});
    const expectedCodeParam = [
      'eyJ0ZW1wbGF0ZSI6eyJ0ZW1wbGF0ZSI6IjxkaXY+SGVsbG8hPC9kaXY+IiwiY29udHJvbGx',
      'lciI6ImZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZyhcIkhlbGxvIVwiKSB9Iiwic3R5bGVzIj',
      'oiLmNsYXNzIHsgZGlzcGxheTogbm9uZTsgfSJ9fQ=='
    ].join('');
    expect(codeParam).toEqual(expectedCodeParam);
  });
});
