# Configuration

## pitsby.config.js

This is Pitsby's configuration file. This file should be created in the root directory of the project which you want the documentation will be created for:

``` javascript
module.exports = {
  projects: [
    {
      engine: 'angular',
      collectDocsFrom: './src/angular',
      moduleName: 'my-angular-components'
    },
    {
      engine: 'react',
      collectDocsFrom: './src/react',
      // You may optionally declare some specific React version (Default: 16.13.0)
      // NOTE: For now, Pitsby has no support for React 18.
      version: '16.8.0'
    },
    {
      engine: 'vue',
      collectDocsFrom: './src/vue',
      // The name of your library according UMD (Universal Module Definition).
      // Pitsby will look for this name as a global variable.
      libraryName: 'myVueComponents'
      // You may optionally declare some specific Vue version (Default: 2.5.13)
      // NOTE: For now, Pitsby has no support for Vue 3.
      version: '2.6.0'
    },
    {
      engine: 'vanilla',
      collectDocsFrom: './src/vanilla',
    }
  ],
  styles: [
    './dist/my-styles.css',
    // You can optionally declare an object representing
    // the link tag attributes:
    { href: './dist/other.css', rel: 'stylesheet' },
    { href: './dist/any-other.css', rel: 'prefetch', as: 'style' }
  ],
  scripts: [
    './dist/my-components.js',
    // You can optionally declare an object representing
    // the script tag attributes:
    { src: './dist/es6/components.js', type: 'module' },
    { src: 'https://some.cdn.com/lib.js', crossorigin: '' },
    // In addition to the native HTML attributes for a script tag,
    // you can use the Boolean "inline" property to indicate whether
    // a script must be presented inline. This is the case of "importmaps",
    // since browsers still don't support importmap coming from external sources.
    { src: './src/doc.importmap.js', type: 'importmap', inline: true }
  ],
  other: [
    './dist/images/',
    './dist/fonts/',
    './dist/etc/'
  ],
  metrics: {
    // You can choose one, and only one, of the following
    // alternatives to track pageviews:
    // A) Google Analytics
    // Supports Universal Analytics and Google Analytics 4 properties
    googleAnalyticsId: 'UA-XXXXXXXXX-X',
    // B) Plausible
    plausibleId: 'mysite.com',
    plausibleOptions: {
      // By default, Plausible does not track events on localhost.
      // You can enable localhost tracking by passing the following option:
      trackLocalhost: true
      // To see all available options, visit:
      // https://github.com/plausible/plausible-tracker#usage
    }
  },
  // You can optionally control Pitsby's color scheme (light/dark).
  colorScheme: {
    // In addition, you can set the color scheme used on Pitsby's first render.
    initial: 'dark',
    // If your components support both light/dark color schemes, you can
    // listen for changes made by the user and theme you components accordingly.
    onChange: function(scheme){
      // This function receives the color scheme (light/dark) just selected by the user.
      // With the selected color scheme in hands, you can appropriately adjust the
      // theme of you component library.
      //
      // HEADS UP! This function gets executed at browser's runtime, not Node's.
      // So you won't have access here to anything you eventually required in the
      // configuration file using commonjs.
    }
  },
  custom: {
    favicon: {
      // The following image must be included in the 'other' attribute above.
      filepath: './some/path/to/favicon.png'
    },
    logo: {
      // The following image must be included in the 'other' attribute above.
      filepath: './some/path/to/image.svg',
      width: '100px',
      height: '100px'
    },
    // Styles to be applied globally.
    // This is perfect when you need to do just a few overrides, otherwise,
    // prefer to create a dedicated stylesheet for documentation and include it
    // in the 'styles' attribute above.
    styles: `
      p-main { color: red; }
    `,
    windowTitle: 'My Custom Window Title'
  },
  outputDirectory: './docs'
};

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
