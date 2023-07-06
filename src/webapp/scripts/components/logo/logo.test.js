import { STORED_COLOR_SCHEME_KEY } from '@scripts/constants/storage';
import PUBSUB_EVENT_NAMES from '@scripts/constants/pubsub-event-names';
import pubsubService from '@scripts/services/pubsub';
import testingService from '@scripts/services/testing';

describe('Logo', () => {
  let compile;

  function changeColorScheme(scheme, element){
    pubsubService.publish(PUBSUB_EVENT_NAMES.COLOR_SCHEME_CHANGED, { scheme });
    element.isolateScope().$digest();
  }

  function getLogoSrc(element){
    return element.find('img').attr('src');
  }

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-logo />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  afterEach(() => {
    testingService.clearExternalGlobalData();
    localStorage.removeItem(STORED_COLOR_SCHEME_KEY);
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('img').attr('class')).toContain('p-logo');
  });

  it('should render pitsby logo by default', () => {
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/images/logo.svg');
    expect(element.find('img').attr('width')).toEqual('130px');
    expect(element.find('img').attr('height')).toEqual('40px');
  });

  it('should optionally render a custom logo', () => {
    const data = {
      custom: {
        logo: {
          filepath: '/external/dist/logo.svg'
        }
      },
      fingerprint: 123
    };
    testingService.mockExternalGlobalData(data);
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/external/dist/logo.svg?t=123');
    expect(element.find('img').attr('width')).toEqual('');
    expect(element.find('img').attr('height')).toEqual('');
  });

  it('should optionally render a custom logo with width and height', () => {
    const data = {
      custom: {
        logo: {
          filepath: '/external/dist/logo.svg',
          width: '90px',
          height: '30px'
        }
      },
      fingerprint: 123
    };
    testingService.mockExternalGlobalData(data);
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/external/dist/logo.svg?t=123');
    expect(element.find('img').attr('width')).toEqual('90px');
    expect(element.find('img').attr('height')).toEqual('30px');
  });

  it('should initialize pitsby’s logo mode as light by default', () => {
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/images/logo.svg');
  });

  it('should optionally initialize pitsby’s logo mode as dark', () => {
    localStorage.setItem(STORED_COLOR_SCHEME_KEY, 'dark');
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/images/logo-dark.svg');
  });

  it('should update pitsby’s logo mode on color scheme change', () => {
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/images/logo.svg');
    changeColorScheme('dark', element);
    expect(getLogoSrc(element)).toEqual('/images/logo-dark.svg');
    changeColorScheme('light', element);
    element.isolateScope().$digest();
    expect(getLogoSrc(element)).toEqual('/images/logo.svg');
  });

  it('should optionally render a custom logo according to the color scheme set', () => {
    const data = {
      custom: {
        logo: {
          filepath: '/external/dist/logo.svg',
          darkVersionFilepath: '/external/dist/logo-dark.svg',
          width: '90px',
          height: '30px'
        }
      },
      fingerprint: 456
    };
    testingService.mockExternalGlobalData(data);
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/external/dist/logo.svg?t=456');
    changeColorScheme('dark', element);
    expect(getLogoSrc(element)).toEqual('/external/dist/logo-dark.svg?t=456');
    changeColorScheme('light', element);
    expect(getLogoSrc(element)).toEqual('/external/dist/logo.svg?t=456');
  });

  it('should fallback to defaultcustom logo filepath if no dark version filepath has been given', () => {
    const data = {
      custom: {
        logo: {
          filepath: '/external/dist/logo.svg',
          width: '90px',
          height: '30px'
        }
      },
      fingerprint: 456
    };
    testingService.mockExternalGlobalData(data);
    const element = compile();
    expect(getLogoSrc(element)).toEqual('/external/dist/logo.svg?t=456');
    changeColorScheme('dark', element);
    expect(getLogoSrc(element)).toEqual('/external/dist/logo.svg?t=456');
  });

  it('should unsubscribe from color scheme change on destroy', () => {
    pubsubService.unsubscribe = jest.fn();
    pubsubService.subscribe = jest.fn(() => '789');
    const element = compile();
    element.isolateScope().$ctrl.$onDestroy();
    expect(pubsubService.unsubscribe).toHaveBeenCalledWith('789');
  });
});
