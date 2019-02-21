# Pitsby
> Docs generator for AngularJS and Vue components

[![CircleCI](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master.svg?style=svg)](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master)
[![codecov](https://codecov.io/gh/glorious-codes/glorious-pitsby/branch/master/graph/badge.svg)](https://codecov.io/gh/glorious-codes/glorious-pitsby)

## Basic Usage

Pitsby is based on two types of files:

### `pitsby.js`

This is pitsby's configuration file. This file should be create in the root directory of the project which you want the documentation will be created for:

``` javascript
module.exports = {
  projects: [
    {
      engine: "angular",
      collectDocsFrom: "./src/angular",
      moduleName: "my-angular-components"
    },
    {
      engine: "vue",
      collectDocsFrom: "./src/vue",
      importFrom: "./dist/my-vue-components"
    }
  ],
  styles: [
    "./dist/my-angular-components.css",
    "./dist/my-vue-components.css"
  ],
  scripts: [
    "./dist/my-angular-components.js",
    "./dist/my-vue-components.js"
  ],
  other: [
    "./dist/images/",
    "./dist/fonts/",
    "./dist/etc/"
  ],
  outputDirectory: "./docs"
}

```

#### `projects`
A list of projects with their specifications.

##### `engine`
Components' engine. Support for AngularJS (angular) and Vue (vue);

##### `collectFrom`
Directory where Pitsby should look for .doc.js files regardless the engine used.

##### `moduleName`
Angular module's name that contains the components you are writing `*.doc.js` for.

##### `importFrom`
The path Pitsby should use to import your Vue components. Your Vue components should be written using the [Vue plugin strategy](https://vuejs.org/v2/guide/plugins.html): `Vue.use(yourVueComponents)`.

#### `styles`
List of stylesheets that should be included in the documentation

#### `scripts`
List of scripts that should be included in the documentation.

#### `other`
List of any other file/directory that should be included in the documentation.

#### `outputDirectory`
Directory where docs should be outputted to. If not informed, documentation will be outputted to a directory called *Pitsby*.

### `*.doc.js`

You should create one `.doc.js` file per component. The following is an example for a button component:

``` javascript
module.exports = {
  name: 'Button',
  description: 'Trigger for actions in forms, dialogs, and more.',
  properties: [
    {
      name: 'theme',
      type: 'String',
      values: 'primary, secondary',
      required: 'No'
    },
    {
      name: 'size',
      type: 'String',
      values: 'small, large',
      required: 'No'
    }
  ],
  // Angular Examples should be written like below:
  examples: [
    {
      title: 'My Button Example',
      description: 'This is my custom Angular button.'
      controller: function($window){
        const $ctrl = this;
        $ctrl.label = 'Greet';
        $ctrl.greet = () => $window.alert('Hello!');
      },
      dependencies: ['$window'],
      template: `
      <my-button
        ng-click="$ctrl.greet()"
        ng-bind="$ctrl.label">
      </my-button>`
    }
  ]
  // Vue Examples should be written like below:
  examples: [
    {
      title: 'My Button Example',
      description: 'This is my custom Vue button.'
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
      <my-button @click="greet">
        {{ label }}
      </my-button>`
    }
  ]
};

```

## Contributing

1. Install [Node](https://nodejs.org/en/). Download the "Recommend for Most Users" version.

2. Clone the repo:
``` bash
git clone git@github.com:glorious-codes/pitsby.git
```

3. Go to the project directory
``` bash
cd pitsby
```

4. Install the project dependencies
``` bash
npm install
```

5. Create the `pitsby.js` and, at least, one `*.doc.js` in a third party project.

6. Install and run pitsby on the root directory of the project previously cited.
``` bash
pitsby build
```

7. If you want just build the project, run:
``` bash
npm run build
```

8. Otherwise, run:
``` bash
npm run start
```

The app will be running on `http://localhost:8080` and the browser will automatically reload with the changes you make in any source file.

## Tests

1. Ensure that all code that you have added is covered with unit tests:
``` bash
npm run test -- --coverage
```
