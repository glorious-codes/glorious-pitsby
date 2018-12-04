# Pitsby
> Docs generator for AngularJS components

[![CircleCI](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master.svg?style=svg)](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master)
[![codecov](https://codecov.io/gh/glorious-codes/pitsby/branch/master/graph/badge.svg)](https://codecov.io/gh/glorious-codes/pitsby)

## Basic Usage

Pitsby is based on two types of files:

### `pitsby.json`

This is pitsby's configuration file. This file should be create in the root directory of the project which you want the documentation will be created for:

``` javascript
{
  "collectFrom": "./src",
  "moduleName": "my-angular-components",
  "styles": [
    "./dist/my-angular-components.min.css"
  ],
  "scripts": [
    "./dist/my-angular-components.min.js"
  ],
  "outputDirectory": "./docs"
}
```

#### `collectFrom`
Directory where Pitsby should look for .doc.js files.

#### `moduleName`
Angular module name that contains the components to be documented.

#### `styles`
List of stylesheets that should be included in the documentation

#### `scripts`
List of scripts that should be included in the documentation.

#### `outputDirectory`
Directory where docs should be outputted to.

### `*.doc.js`

You should create one `.doc.js` file per component. The following is an example for some button component:

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
  examples: [
    {
      title: 'Default Button',
      template: `
      <my-button>
        Save
      </my-button>`
    },
    {
      title: 'Primary Button',
      template: `
      <my-button data-theme="primary">
        Save
      </my-button>`
    },
    {
      title: 'Secondary Button',
      template: `
      <my-button data-theme="secondary">
        Save
      </my-button>`
    },
    {
      title: 'Small Button',
      template: `
      <my-button data-size="small">
        Save
      </my-button>`
    },
    {
      title: 'Large Button',
      template: `
      <my-button data-size="large">
        Save
      </my-button>`
    },
  ],
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

5. Create the `pitsby.json` and, at least, one `*.doc.js` in a third party project.

6. Install and run pitsby on the root directory of the project previously cited.
``` bash
pitsby
```

7. If you want just build the project, run:
``` bash
npm run build
```

8. Otherwise, run:
``` bash
npm run start
```

The app will be running on `http://localhost:7000` and the browser will automatically reload with the changes you make in any source file.

## Tests

1. Ensure that all code that you have added is covered with unit tests:
``` bash
npm run test -- --coverage
```
