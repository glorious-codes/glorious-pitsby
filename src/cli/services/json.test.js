import jsonService from './json';

describe('JSON Service', () => {
  it('should stringify an attribute that contains a function', () => {
    const obj = {a: 1, b: 'hello', c: function(){ return 1; }};
    expect(jsonService.stringifyFunctions(obj)).toEqual({
      a: 1,
      b: 'hello',
      c: `function c() {
        return 1;
      }`
    });
  });

  it('should stringify functions contained in an object', () => {
    const obj = {a: 1, b: 'hello', c: { d: function(){ return 1; } }};
    expect(jsonService.stringifyFunctions(obj)).toEqual({
      a: 1,
      b: 'hello',
      c: {
        d: `function d() {
          return 1;
        }`
      }
    });
  });

  it('should stringify functions contained in a array', () => {
    const obj = {a: 1, b: 'hello', c: [function d(){ return 1; }]};
    expect(jsonService.stringifyFunctions(obj)).toEqual({
      a: 1,
      b: 'hello',
      c: [`function d() {
        return 1;
      }`]
    });
  });

  it('should stringify functions contained in an object inside an array', () => {
    const obj = {a: 1, b: 'hello', c: { d: [function e(){ return 1; }] }};
    expect(jsonService.stringifyFunctions(obj)).toEqual({
      a: 1,
      b: 'hello',
      c: {
        d: [`function e() {
          return 1;
        }`]
      }
    });
  });

  it('should not stringify any attribute other than function', () => {
    const obj = {a: 1, b: 'hello', c: NaN, d: 3.2, e: null, f: {}, g: []};
    expect(jsonService.stringifyFunctions(obj)).toEqual({
      a: 1,
      b: 'hello',
      c: NaN,
      d: 3.2,
      e: null,
      f: {},
      g: []
    });
  });

  it('should just return the value given if value is not an object when stringifying functions', () => {
    expect(jsonService.stringifyFunctions('string')).toEqual('string');
  });

  it('should parse an attribute that contains a stringified function', () => {
    const rawObj = {a: 1, b: 'hello', c: 'function(){ return 1; }'};
    const parsedObj = jsonService.parseFunctions(rawObj);
    expect(parsedObj.c()).toEqual(1);
  });

  it('should parse stringified functions contained in an object', () => {
    const rawObj = {a: 1, b: 'hello', c: {d: 'function(){ return 1; }'}};
    const parsedObj = jsonService.parseFunctions(rawObj);
    expect(parsedObj.c.d()).toEqual(1);
  });

  it('should parse functions contained in a array', () => {
    const rawObj = {a: 1, b: 'hello', c: ['function(){ return 1; }']};
    const parsedObj = jsonService.parseFunctions(rawObj);
    expect(parsedObj.c[0]()).toEqual(1);
  });

  it('should parse stringified functions contained in an object inside an array', () => {
    const rawObj = {a: 1, b: 'hello', c: [{d: 'function(){ return 1; }'}]};
    const parsedObj = jsonService.parseFunctions(rawObj);
    expect(parsedObj.c[0].d()).toEqual(1);
  });

  it('should not parse any attrbute other than stringified functions', () => {
    const obj = {a: 1, b: 'hello', c: NaN, d: 3.2, e: null, f: {}, g: []};
    expect(jsonService.parseFunctions(obj)).toEqual({
      a: 1,
      b: 'hello',
      c: NaN,
      d: 3.2,
      e: null,
      f: {},
      g: []
    });
  });

  it('should just return the value given if value is not an object when parsing functions', () => {
    expect(jsonService.parseFunctions('string')).toEqual('string');
  });
});
