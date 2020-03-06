# Pitsby
> Docs generator for AngularJS, React, Vue and Vanilla components.

[![CircleCI](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master.svg?style=svg)](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master)
[![codecov](https://codecov.io/gh/glorious-codes/glorious-pitsby/branch/master/graph/badge.svg)](https://codecov.io/gh/glorious-codes/glorious-pitsby)

## Installation

```
$ npm install @glorious/pitsby -g
```

## Usage

### Setup

Pitsby is based on two types of file:

- [Configuration File](https://github.com/glorious-codes/glorious-pitsby/blob/master/docs/configuration.md) (pitsby.config.js)
  - Responsible for telling Pitsby where the documentation files are and for informing all the assets that should be included in the documentation.
- [Documentation File](https://github.com/glorious-codes/glorious-pitsby/blob/master/docs/documentation.md) (eg. button.doc.js)
  - Used by Pitsby to build the page that contains all the component details.

### Build

Since you have set up the `pitsby.config.js` for your project and, at least, one documentation file, you can easily generate the documentation running:
```
$ pitsby build
```

Once built, you can see the result serving the files just created using [http-server](https://www.npmjs.com/package/http-server) or any other lib that you prefer:
```
$ http-server ./pitsby -p 7000
```

To keep Pitsby watching the changes that you make on any file listed on `pitsby.config.js`, run:
```
$ pitsby build --watch
```

*Go to `http://localhost:7000` and see the documentation that has been just created.*

If your library generates more than one file, you might want to set an *Aggregate Timeout* to allow Pitsby to aggregate any other changes made during this time period (milliseconds) into one rebuild:
```
$ pitsby build --watch --aggregateTimeout=250
```

## Contributions

If you are interested in contributing to this project, refer to the [Contributing Steps](https://github.com/glorious-codes/glorious-pitsby/blob/master/docs/contributing.md).
