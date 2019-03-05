# Contributing

1. Install [Node](https://nodejs.org/en/). Download the "Recommend for Most Users" version.

2. Clone the repo:
``` bash
git clone git@github.com:glorious-codes/glorious-pitsby.git
```

3. Go to the project directory
``` bash
cd glorious-pitsby
```

4. Install the project dependencies
``` bash
npm install
```

5. Create the `pitsby.js` and, at least, one `*.doc.js` in a third party project.

6. Install and run Pitsby on the root directory of the project previously cited according to the [Basic Usage]() instructions.

7. If you want just to build the project, run:
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
