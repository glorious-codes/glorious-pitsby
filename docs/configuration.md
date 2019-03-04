# Configuration

## pitsby.js

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

### Projects
A list of projects with their specifications:

##### `engine`
Components' engine. Support for AngularJS (angular) and Vue (vue);

##### `collectFrom`
Directory where Pitsby should look for .doc.js files regardless the engine used.

##### `moduleName`
Angular module's name that contains the components you are writing `*.doc.js` for.

##### `importFrom`
The path Pitsby should use to import your Vue components. Your Vue components should be written using the [Vue plugin strategy](https://vuejs.org/v2/guide/plugins.html): `Vue.use(yourVueComponents)`.

### Styles
List of stylesheets that should be included in the documentation

### Scripts
List of scripts that should be included in the documentation.

### Other
List of any other *file/directory* that should be included in the documentation.

### Output directory
Directory where docs should be outputted to. If not informed, documentation will be outputted to a directory called *pitsby*.
