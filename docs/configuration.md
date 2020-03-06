# Configuration

## pitsby.config.js

This is Pitsby's configuration file. This file should be created in the root directory of the project which you want the documentation will be created for:

``` javascript
module.exports = {
  projects: [
    {
      engine: "angular",
      collectDocsFrom: "./src/angular",
      moduleName: "my-angular-components"
    },
    {
      engine: "react",
      collectDocsFrom: "./src/react",
      // You may optionally declare some specific React version (Default: 16.13.0)
      version: "16.8.0"
    },
    {
      engine: "vue",
      collectDocsFrom: "./src/vue",
      importFrom: "./dist/my-vue-components",
      // The name of your library according UMD (Universal Module Definition).
      // Pitsby will look for this name as a global variable.
      libraryName: "myVueComponents"
      // You may optionally declare some specific Vue version (Default: 2.5.13)
      version: "2.6.0"
    },
    {
      engine: "vanilla",
      collectDocsFrom: "./src",
    }
  ],
  styles: [
    "./dist/my-angular-components.css",
    "./dist/my-vue-components.css",
    "./dist/my-vanilla-components.css"
  ],
  scripts: [
    "./dist/my-angular-components.js",
    "./dist/my-vue-components.js",
    "./dist/my-vanilla-components.js"
  ],
  other: [
    "./dist/images/",
    "./dist/fonts/",
    "./dist/etc/"
  ],
  metrics: {
    googleAnalyticsId: "UA-XXXXXXXXX-X"
  },
  custom: {
    favicon: {
      // This image should be included in the "other" attribute above
      filepath: "./some/path/to/favicon.png"
    },
    logo: {
      // This image should be included in the "other" attribute above
      filepath: "./some/path/to/image.svg",
      width: "100px",
      height: "100px"
    },
    // Styles to be applied globally.
    // This is perfect when you need to do just a few overrides, otherwise,
    // prefer to create a dedicated stylesheet for documentation and include it
    // in the "styles" attribute above.
    styles: `
      p-main { color: red; }
    `,
    windowTitle: "My project"
  },
  outputDirectory: "./docs"
}

```

### Projects
A list of projects with their specifications:

##### `engine`
Components' engine. Support for AngularJS (angular), React (react), Vue (vue) and Vanilla (vanilla) components;

##### `collectDocsFrom`
The directory where Pitsby should look for .doc.js files regardless of the engine used.

##### `moduleName`
Angular module's name that contains the components you are writing `*.doc.js` for.

##### `importFrom`
The path Pitsby should use to import your Vue components. Your Vue components should be written using the [Vue plugin strategy](https://vuejs.org/v2/guide/plugins.html): `Vue.use(yourVueComponents)`.

##### `version`
You can optionally set a version for React (default: 16.13.0) or Vue (default: 2.5.13) projects.

### Styles
List of stylesheets that should be included in the documentation

### Scripts
List of scripts that should be included in the documentation.

### Other
List of any other *file/directory* that should be included in the documentation.

### Metrics
IDs to be used on third party metrics services integration. For now, Pitsby support Google Analytics only.

### Custom
UI Elements attributes that should be customized.

### Output directory
Directory where the documentation should be outputted to. If not informed, documentation will be outputted to a directory called *pitsby*.
