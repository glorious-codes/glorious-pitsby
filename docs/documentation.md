# Documentation

### component.doc.js

You should create one `.doc.js` file per component per engine. That said, be careful about:

- If you have a button component written in AngularJS and a button component written in Vue, both will need their own `.doc.js`.
- You shouldn't ever mix AngularJS examples with Vue examples in the same `doc.js`.

The following is an example of button component documentation:

``` javascript
module.exports = {
  name: 'Button',
  description: 'Trigger for actions in forms, dialogs, and more.',
  deprecated: true, // Shows a deprecation tag beside component's name
  properties: [ // Can optionally be named "attributes"
    {
      name: 'theme',
      type: 'String',
      values: 'primary, secondary',
      required: true, // You can optionally indicate a property as required
      deprecated: true // Shows a deprecation tag beside property's name
    },
    {
      name: 'size',
      type: 'String',
      values: 'small, large'
    }
  ],
  // When documenting vanilla components, you can use "methods" to document
  // your component's public methods.
  methods: [
    {
      name: 'onClick (clickFn)',
      deprecated: true, // Shows a deprecation tag beside method's name
      params: [
        {
          name: 'clickFn',
          type: 'Function',
          description: 'Function to be called on button click.',
          required: true, // You can optionally indicate a param as required
          deprecated: true // Shows a deprecation tag beside param's name
        }
      ]
    }
  ],
  // Angular Examples should be written like below:
  examples: [
    {
      title: 'My Button Example',
      description: 'This is my custom Angular button.',
      controller: function($window){
        const $ctrl = this;
        $ctrl.label = 'Greet';
        $ctrl.greet = () => $window.alert('Hello!');
      },
      dependencies: ['$window'],
      template: `
      <my-button
        class="my-button"
        ng-click="$ctrl.greet()"
        ng-bind="$ctrl.label">
      </my-button>`,
      // Sometimes you need to customize styles for documentation purpose only.
      // Use this attribute to target some styles for your example:
      styles: `
      .my-button { color: red; }`
    }
  ],
  // Vue Examples should be written like below:
  examples: [
    {
      title: 'My Button Example',
      description: 'This is my custom Vue button.',
      controller: {
        data(){
          return {
            label: 'Greet'
          };
        },
        methods: {
          greet(){
            window.alert('Hello!');
          }
        }
      },
      template: `
      <my-button class="my-button" @click="greet">
        {{ label }}
      </my-button>`,
      // Sometimes you need to customize styles for documentation purpose only.
      // Use this attribute to target some styles for your example:
      styles: `
      .my-button { color: red; }`
    }
  ],
  // React Examples should be written like below:
  examples: [
    {
      title: 'My Button Example',
      description: 'This is my custom React button.',
      controller: function(){
        // React API is available globally
        const { useState } = React;
        // Your library should be exported as UMD (Universal Module Definition)
        // and will be available through the name you have defined.
        const { Button } = yourReactComponentLibraryName;

        // Controller must return a function or class representing the
        // example to be rendered.
        return function(){
          const [ label, setLabel ] = useState('Send');
          const onButtonClick = () => window.alert('Button clicked!');

          return (
            <div className="my-button-wrapper">
              <Button onClick={onButtonClick}>
                { label }
              </Button>
            </div>
          );
        }
      },
      // Sometimes you need to customize styles for documentation purpose only.
      // Use this attribute to target some styles for your example:
      styles: `
      .my-button-wrapper { margin-top: 10px }`
    }
  ],
  // Vanilla Examples should be written like below:
  examples: [
    {
      title: 'My Button Example',
      description: 'This is an example using just vanilla javascript.',
      controller: function(element){
        const input = element.querySelector('input');
        const button = element.querySelector('button');
        button.addEventListener('click', () => window.alert(input.value));
      },
      template: `
      <input type="text" />
      <button class="my-button" type="button">Greet</button>`,
      // Sometimes you need to customize styles for documentation purpose only.
      // Use this attribute to target some styles for your example:
      styles: `
      .my-button { color: red; }`
    }
  ]
};
```
