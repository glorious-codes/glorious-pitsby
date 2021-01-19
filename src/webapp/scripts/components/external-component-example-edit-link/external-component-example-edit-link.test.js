describe('External Component Example Edit Link', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      const scope = $rootScope.$new(true);
      compile = (bindings = {}) => {
        const template = `<p-external-component-example-edit-link
                            data-engine="$ctrl.engine"
                            data-example="$ctrl.example">
                          </p-external-component-example-edit-link>`;
        scope.$ctrl = bindings;
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('span').attr('class')).toEqual('p-external-component-example-edit-link');
  });

  it('should contain a link to playground with proper Vue code search param value', () => {
    const engine = 'vue';
    const example = {
      controller: {
        methods: {
          onClick: `onClick(){
            window.alert("Hey!");
          }`
        }
      },
      template: '<pd-button class="test-btn" :on-click="onClick">Click Here</pd-button>',
      styles: '.test-btn { color: red; }'
    };
    const element = compile({engine, example});
    const expectedCodeSearchParam = [
      'eyJ0ZW1wbGF0ZSI6IjxwZC1idXR0b24gY2xhc3M9XCJ0ZXN0LWJ0blwiIDpvbi1jbGljaz1',
      'cIm9uQ2xpY2tcIj5DbGljayBIZXJlPC9wZC1idXR0b24%2BIiwiY29udHJvbGxlciI6InJl',
      'dHVybiB7XG4gIFwibWV0aG9kc1wiOiB7XG4gICAgb25DbGljaygpe1xuICAgICAgd2luZG9',
      '3LmFsZXJ0KFwiSGV5IVwiKTtcbiAgICB9XG4gIH1cbn07Iiwic3R5bGVzIjoiLnRlc3QtYn',
      'RuIHsgY29sb3I6IHJlZDsgfSJ9'
    ].join('');
    const expectedHref = `#!/components/vue/playground?code=${expectedCodeSearchParam}&source=edit-link`;
    expect(element.find('a').attr('href')).toEqual(expectedHref);
  });

  it('should contain a link to playground with proper React code search param value', () => {
    const engine = 'react';
    const example = {
      controller: `function(){
        return function(){
          const onClick = () => window.alert("Hey!");
          return (
            <button className="test-btn" onClick={onClick}>Click Here</button>
          )
        }
      }`,
      styles: '.test-btn { color: red; }'
    };
    const element = compile({engine, example});
    const expectedCodeSearchParam = [
      'eyJjb250cm9sbGVyIjoiZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICA',
      'gY29uc3Qgb25DbGljayA9ICgpID0%2BIHdpbmRvdy5hbGVydChcIkhleSFcIik7XG4gICAg',
      'cmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidGVzdC1idG5cIiBvbkNsaWN',
      'rPXtvbkNsaWNrfT5DbGljayBIZXJlPC9idXR0b24%2BXG4gICAgKVxuICB9XG59Iiwic3R5',
      'bGVzIjoiLnRlc3QtYnRuIHsgY29sb3I6IHJlZDsgfSJ9'
    ].join('');
    const expectedHref = `#!/components/react/playground?code=${expectedCodeSearchParam}&source=edit-link`;
    expect(element.find('a').attr('href')).toEqual(expectedHref);
  });

  it('should contain a link to playground with proper AngularJS with depedencies code search param value', () => {
    const engine = 'angular';
    const example = {
      controller: `function($window){
        const $ctrl = this;
        $ctrl.onClick = () => $window.alert("Hey!");
      }`,
      template: '<button class="test-btn" ng-click="$ctrl.click()">Click Here</button>',
      styles: '.test-btn { color: red; }'
    };
    const element = compile({engine, example});
    const expectedCodeSearchParam = [
      'eyJ0ZW1wbGF0ZSI6IjxidXR0b24gY2xhc3M9XCJ0ZXN0LWJ0blwiIG5nLWNsaWNrPVwiJGN',
      '0cmwuY2xpY2soKVwiPkNsaWNrIEhlcmU8L2J1dHRvbj4iLCJjb250cm9sbGVyIjoiZnVuY3',
      'Rpb24gY29udHJvbGxlcigkd2luZG93KXtcbiAgY29uc3QgJGN0cmwgPSB0aGlzO1xuICAkY',
      '3RybC5vbkNsaWNrID0gKCkgPT4gJHdpbmRvdy5hbGVydChcIkhleSFcIik7XG59XG5cbmNv',
      'bnRyb2xsZXIuJGluamVjdCA9IFsnJHdpbmRvdyddO1xuXG5yZXR1cm4gY29udHJvbGxlcjs',
      'iLCJzdHlsZXMiOiIudGVzdC1idG4geyBjb2xvcjogcmVkOyB9In0%3D'
    ].join('');
    const expectedHref = `#!/components/angular/playground?code=${expectedCodeSearchParam}&source=edit-link`;
    expect(element.find('a').attr('href')).toEqual(expectedHref);
  });

  it('should contain a link to playground with proper AngularJS template-only code search param value', () => {
    const engine = 'angular';
    const example = {
      template: '<p class="test-p">Hello!</button>',
      styles: '.test-btn { color: red; }'
    };
    const element = compile({engine, example});
    const expectedCodeSearchParam = [
      'eyJ0ZW1wbGF0ZSI6IjxwIGNsYXNzPVwidGVzdC1wXCI%2BSGVsbG8hPC9idXR0b24%2BIiw',
      'iY29udHJvbGxlciI6ImZ1bmN0aW9uIGNvbnRyb2xsZXIoKXtcbiAgY29uc3QgJGN0cmwgPS',
      'B0aGlzO1xufVxuXG5jb250cm9sbGVyLiRpbmplY3QgPSBbXTtcblxucmV0dXJuIGNvbnRyb',
      '2xsZXI7Iiwic3R5bGVzIjoiLnRlc3QtYnRuIHsgY29sb3I6IHJlZDsgfSJ9'
    ].join('');
    const expectedHref = `#!/components/angular/playground?code=${expectedCodeSearchParam}&source=edit-link`;
    expect(element.find('a').attr('href')).toEqual(expectedHref);
  });

  it('should contain a link to playground with proper Vanilla code search param value', () => {
    const engine = 'vanilla';
    const example = {
      controller: `function(element){
        element.addEventListener('click', () => window.alert("Hey!"));
      }`,
      template: '<button class="test-btn">Click Here</button>',
      styles: '.test-btn { color: red; }'
    };
    const element = compile({engine, example});
    const expectedCodeSearchParam = [
      'eyJ0ZW1wbGF0ZSI6IjxidXR0b24gY2xhc3M9XCJ0ZXN0LWJ0blwiPkNsaWNrIEhlcmU8L2J',
      '1dHRvbj4iLCJjb250cm9sbGVyIjoiZnVuY3Rpb24gY29udHJvbGxlcihlbGVtZW50KXtcbi',
      'AgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0%2BIHdpbmRvdy5hbGV',
      'ydChcIkhleSFcIikpO1xufVxuXG5yZXR1cm4gY29udHJvbGxlcjsiLCJzdHlsZXMiOiIudG',
      'VzdC1idG4geyBjb2xvcjogcmVkOyB9In0%3D'
    ].join('');
    const expectedHref = `#!/components/vanilla/playground?code=${expectedCodeSearchParam}&source=edit-link`;
    expect(element.find('a').attr('href')).toEqual(expectedHref);
  });

  it('should contain a link to playground with proper Vanilla template-only code search param value', () => {
    const engine = 'vanilla';
    const example = {
      template: '<button class="test-btn">Click Here</button>',
      styles: '.test-btn { color: red; }'
    };
    const element = compile({engine, example});
    const expectedCodeSearchParam = [
      'eyJ0ZW1wbGF0ZSI6IjxidXR0b24gY2xhc3M9XCJ0ZXN0LWJ0blwiPkNsaWNrIEhlcmU8L2J',
      '1dHRvbj4iLCJjb250cm9sbGVyIjoiZnVuY3Rpb24gY29udHJvbGxlcihlbGVtZW50KXt9XG',
      '5cbnJldHVybiBjb250cm9sbGVyOyIsInN0eWxlcyI6Ii50ZXN0LWJ0biB7IGNvbG9yOiByZ',
      'WQ7IH0ifQ%3D%3D'
    ].join('');
    const expectedHref = `#!/components/vanilla/playground?code=${expectedCodeSearchParam}&source=edit-link`;
    expect(element.find('a').attr('href')).toEqual(expectedHref);
  });
});
