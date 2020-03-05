import externalComponentsPlaygroundDefaultCodeBuilder from './external-components-playground-default-code-builder';

describe('External Components Playground Default Code Builder', () => {
  it('should build Angular default code', () => {
    const code = externalComponentsPlaygroundDefaultCodeBuilder.build('angular');
    expect(code).toEqual({
      controller: `function controller() {
  const $ctrl = this;

  $ctrl.greet = 'Hello world!';
}

controller.$inject = [];

return controller;`,
      template: `<div class="playground-preview-container">
  <div ng-bind="$ctrl.greet"></div>
</div>`,
      styles: '.playground-preview-container { padding: 30px; }'
    });
  });

  it('should build React default code', () => {
    const code = externalComponentsPlaygroundDefaultCodeBuilder.build('react');
    expect(code).toEqual({
      controller: `function() {
  const { useState } = React;

  return function(){
    const [greeting, setGreeting] = useState('Hello world!');

    return (
      <div className="playground-preview-container">
        { greeting }
      </div>
    );
  }
}`,
      styles: '.playground-preview-container { padding: 30px; }'
    });
  });

  it('should build Vanilla default code', () => {
    const code = externalComponentsPlaygroundDefaultCodeBuilder.build('vanilla');
    expect(code).toEqual({
      controller: `function controller(element) {
  const messageContainer = element.querySelector('[data-playground-preview-message]');
  if(messageContainer)
    messageContainer.innerHTML = 'Hello world!';
}

return controller;`,
      template: `<div class="playground-preview-container">
  <div data-playground-preview-message></div>
</div>`,
      styles: '.playground-preview-container { padding: 30px; }'
    });
  });

  it('should build Vue default code', () => {
    const code = externalComponentsPlaygroundDefaultCodeBuilder.build('vue');
    expect(code).toEqual({
      controller: `return {
  data() {
    return {
      message: 'Hello world!'
    };
  }
}`,
      template: `<div class="playground-preview-container">
  <div>{{ message }}</div>
</div>`,
      styles: '.playground-preview-container { padding: 30px; }'
    });
  });
});
