import jsonService from './json';

describe('JSON Service', () => {
  it('should parse regular JSON functions', () => {
    const stringifiedFunction = 'function(a, b){ return a + b; }';
    const json = { sum: stringifiedFunction };
    const result = jsonService.handleFunctions(json);
    expect(result.sum(3,7)).toEqual(10);
  });

  it('should not parse JSON functions if engine is React', () => {
    const json = { sum: 'function(){}' };
    const result = jsonService.handleFunctions(json, { engine: 'react' });
    expect(typeof result.sum).toEqual('string');
  });
});
