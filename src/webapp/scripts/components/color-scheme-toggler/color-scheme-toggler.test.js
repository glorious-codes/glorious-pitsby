import { STORED_COLOR_SCHEME_KEY } from '@scripts/constants/storage';
import pubsubService from '@scripts/services/pubsub';

describe('Color Scheme Toggler', () => {
  let compile;

  function getColorSchemeAttr(){
    return 'data-pitsby-color-scheme';
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
    localStorage.removeItem(STORED_COLOR_SCHEME_KEY);
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class').trim()).toEqual('p-color-scheme-toggler');
  });

  it('should initialize scheme as light by default', () => {
    compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('light');
  });

  it('should optonally initialize scheme as dark', () => {
    localStorage.setItem(STORED_COLOR_SCHEME_KEY, 'dark');
    compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('dark');
  });

  it('should emit/store color scheme on toggle', () => {
    const element = compile();
    element.find('p-trigger').find('button').triggerHandler('click');
    expect(localStorage.getItem(STORED_COLOR_SCHEME_KEY)).toEqual('dark');
    expect(pubsubService.publish).toHaveBeenCalledWith('colorSchemeChanged', {
      scheme: 'dark'
    });
  });

  it('should alternate html color scheme on toggle', () => {
    const element = compile();
    const html = document.querySelector('html');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('light');
    element.find('p-trigger').find('button').triggerHandler('click');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('dark');
    element.find('p-trigger').find('button').triggerHandler('click');
    expect(html.getAttribute(getColorSchemeAttr())).toEqual('light');
  });

  it('should alternate toggler label and icon on toggle', () => {
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
