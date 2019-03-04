# Pitsby
> Docs generator for AngularJS and Vue components

[![CircleCI](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master.svg?style=svg)](https://circleci.com/gh/glorious-codes/glorious-pitsby/tree/master)
[![codecov](https://codecov.io/gh/glorious-codes/glorious-pitsby/branch/master/graph/badge.svg)](https://codecov.io/gh/glorious-codes/glorious-pitsby)

## Installation

```
$ npm install @glorious/pitsby -g
```

## Usage

### Setup

Pitsby is based on two types of files:

- [Configuration File]() (pitsby.js)
  - Responsible for telling Pitsby where documentation files are and for informing all the assets that should be included on the documentation.
- [Documentation File]() (eg. button.doc.js)
  - Used by Pitsby to build the page that contains all the component details in the documentation.

### Build

Since you have set up the `pitsby.js` for your project and, at least, one documentation file, you can easily generate the documentation running:
```
$ pitsby build
```

Once built, you can see the result serving the files just created using `http-server` or any lib that you prefer:
```
$ http-server ./pitsby -p 7000
```

To keep Pitsby watching changes that you make on any file listed on `pitsby.js`, use the watch flag when building the documentation:
```
$ pitsby build --watch
```

Go to `http://localhost:7000` and see the documentation you have just created.

## Contributions

If you are interested in contribute with this project, refer to the [Contributing Steps]().
