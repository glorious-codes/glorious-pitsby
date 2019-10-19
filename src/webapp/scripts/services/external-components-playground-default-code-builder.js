const _public = {};

_public.build = engine => {
  const codes = {
    angular: buildAngularDefaultCode(),
    vanilla: buildVanillaDefaultCode(),
    vue: buildVueDefaultCode()
  };
  return codes[engine];
};

function buildAngularDefaultCode(){
  return {
    controller: `function controller() {
  const $ctrl = this;

  $ctrl.greet = 'Hello world!';
}

controller.$inject = [];

return controller;`,
    styles: buildStyles(),
    template: buildTemplate('<div ng-bind="$ctrl.greet"></div>')
  };
}

function buildVanillaDefaultCode(){
  return {
    controller: `function controller(element) {
  const messageContainer = element.querySelector('[data-playground-preview-message]');
  if(messageContainer)
    messageContainer.innerHTML = 'Hello world!';
}

return controller;`,
    styles: buildStyles(),
    template: buildTemplate('<div data-playground-preview-message></div>')
  };
}

function buildVueDefaultCode(){
  return {
    controller: `return {
  data() {
    return {
      message: 'Hello world!'
    };
  }
}`,
    styles: buildStyles(),
    template: buildTemplate('<div>{{ message }}</div>')
  };
}

function buildTemplate(content){
  return `<div class="playground-preview-container">
  ${content}
</div>`;
}

function buildStyles(){
  return '.playground-preview-container { padding: 30px; }';
}

export default _public;
