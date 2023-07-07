import pubsubService from '@scripts/services/pubsub';
import testingService from '@scripts/services/testing';

describe('Color Scheme Toggler', () => {
  let compile;

  function getColorSchemeAttr(){
    return 'data-pitsby-color-scheme';
  }

  function getColorSchemeStorageKey(){
    return 'pitsby-color-scheme';
  }

  function mockExternalGlobalData({ colorScheme = {} } = {}){
    testingService.mockExternalGlobalData({ colorScheme });
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-color-scheme-toggler></p-color-scheme-toggler>';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
    pubsubService.publish = jest.fn();
  });

  afterEach(() => {
    document.querySelector('html').removeAttribute('data-pitsby-color-scheme');
    localStorage.removeItem(getColorSchemeStorageKey());
    testingService.clearExternalGlobalData();
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-color-scheme-toggler');
  });

  it('should not render trigger by default', () => {
    const element = compile();
    expect(element.find('p-trigger')).toHaveLength(0);
  });

  it('should not render trigger if no color scheme change listener is present in external global data', () => {
    mockExternalGlobalData({ colorScheme: { initial: 'dark' } });
    const element = compile();
    expect(element.find('p-trigger')).toHaveLength(0);
  });

  it('should initialize scheme as light by default', () => {
    mockExternalGlobalData();
    compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('light');
  });

  it('should not store color scheme on initialization if no color scheme change listener is present on external global data', () => {
    mockExternalGlobalData();
    compile();
    expect(localStorage.getItem(getColorSchemeStorageKey())).toEqual(null);
  });

  it('should optionally initialize with configuration initial scheme', () => {
    mockExternalGlobalData({ colorScheme: { initial: 'dark' } });
    compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('dark');
  });

  it('should favor stored color scheme over configuration initial scheme', () => {
    mockExternalGlobalData({ colorScheme: { initial: 'light', onChange: () => {} } });
    localStorage.setItem(getColorSchemeStorageKey(), 'dark');
    compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('dark');
  });

  it('should ignore stored color scheme if no color scheme change listener is present on external global data', () => {
    mockExternalGlobalData({ colorScheme: { initial: 'light' } });
    localStorage.setItem(getColorSchemeStorageKey(), 'dark');
    compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('light');
  });

  it('should emit/store color scheme on toggle', () => {
    const onChange = jest.fn();
    mockExternalGlobalData({ colorScheme: { onChange } });
    const element = compile();
    element.find('p-trigger').find('button').triggerHandler('click');
    expect(localStorage.getItem(getColorSchemeStorageKey())).toEqual('dark');
    expect(onChange).toHaveBeenCalledWith('dark');
    expect(pubsubService.publish).toHaveBeenCalledWith('colorSchemeChanged', {
      scheme: 'dark'
    });
  });

  it('should alternate html color scheme on toggle', () => {
    mockExternalGlobalData({ colorScheme: { onChange: jest.fn() } });
    const element = compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('light');
    element.find('p-trigger').find('button').triggerHandler('click');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('dark');
    element.find('p-trigger').find('button').triggerHandler('click');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('light');
  });

  it('should alternate toggler label and icon on toggle', () => {
    mockExternalGlobalData({ colorScheme: { onChange: jest.fn() } });
    const element = compile();
    expect(element.find('p-trigger').find('button').attr('aria-label')).toEqual('dark mode');
    element.find('p-trigger').find('button').triggerHandler('click');
    element.isolateScope().$digest();
    expect(element.find('p-trigger').find('button').attr('aria-label')).toEqual('light mode');
    element.find('p-trigger').find('button').triggerHandler('click');
    element.isolateScope().$digest();
    expect(element.find('p-trigger').find('button').attr('aria-label')).toEqual('dark mode');
  });
});
