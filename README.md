# Squib

Squib **is not a tag manager**, it does not manage header bidders or DMPs, it is a library that wraps GPT.

## Product Goals

 - Support for Headertag Integration through configuration
 - Support for batched Lazy Loads and Batched Refreshes
 - Simple API
 - Eliminate common errors by only exposing the squib object through the async queue
 - Easy Configuration
 - Support for multiple screen sizes

## Design Goals

I chose to use the common JS module system as it promotes reusable and testable modules.

**Favor dependency injection over internal instantiation**

An Example from `./src/init.js`:

```
var GPTHandler = require('./gpthandler'),
    Squib = require('./squib'),
    validate = require('./validation');

// ...

var squibConfig = validate.createSquibConfig(window.squibConfig),
    gptHandler = new GptHandler(window.googletag, squibConfig),
    squib = new Squib(gptHandler, squibConfig);

// ...
```

This allows us to Mock a googletag and a config object and test the GPTHandler and Squib in
isolation and more importantly it doesn't require a browser (headless or otherwise).

An Example from `./tests/gpthadler.test.js`

```
const GPTHandler = require('./../src/GPTHandler');
const validate = require('./../src/validation');
const MockGoogletag = require('./mockgoogletag');

const squibConfig = {
    viewPortSizes: {
        getViewPortSize: function () { return 500; },
        'large'     : 500,
        'medium'    : 0
    }
};

describe('GPTHandler Test Suite', () => {

    var gptHandler, mochGPT, config;

    beforeEach(function () {
        mochGPT = new MockGoogletag(),
        config = validate.createSquibConfig(squibConfig);
        gptHandler = new GPTHandler(mochGPT, config);
    });

    it('example description', () => {
        // run a test
    });
});
```

### Example Configuration

First configure the library

```
<head>
<!-- Drop the squib library -->
<!-- Drop headertag -->
<script>
window.squibConfig = {
    headertag: {
        enabled: true,
        reference: function () {
            return window.headertag;
        }
    },
    viewPortSizes: {
        getViewPortSize: function () {
            window.document.documentElement.clientWidth;
        },
        'huge'      : 1024,
        'large'     : 800,
        'medium'    : 600,
        'small'     : 420,
        'mini'      : 200
    }
};
```

Next setup an async queue

```
window.squibQueue = window.squibQueue || [];
```

Define some slots

```
window.squibQueue.push(function (squib) {
    var squibSlots = squib.defineSlots([{
        'gptDivId': 'gpt-div-leaderboard',
        'adUnitPath': '/62650033/desktop-uk',
        'viewPortSizes': {
            'huge': [ [970, 250] ],
            'large': [ [728, 90] ],
            'medium': [ [320, 90] ],
            'small': [ [300, 50] ],
            'mini': [ [200, 50] ]
        },
        'lazyload': false,
        'targeting': {
            'type': 'leaderboard',
            'pos': 'top'
        }
    }, {
        'gptDivId': 'gpt-div-1',
        'adUnitPath': '/62650033/desktop-uk',
        'viewPortSizes': {
            'huge'      :   [ [300, 600] ]
        },
        'lazyload': true,
        'targeting': {
            'pos': 'right1',
            'inContent': 'false',
            'region': 'right'
        }
    }, {
        gptDivId: "dfp-ad-interstitial",
        adUnitPath: '/62650033/desktop-uk',
        interstitial: true,
        targeting: {
            "pos": ['interstitial']
        },
        viewPortSizes: ['large']
    }]);

    // tell squib what slots to display
    var initialLoad = [], slot;
    for (var i = 0; i < squibSlots.length; i++) {
        slot = squibSlots[i];
        if (slot.isActive() && !slot.isLazyLoad()) {
            initialLoad.push(slot.getGPTDivId());
        }
    }

    squib.display(initialLoad);
});
</script>
</head>
```

Now you get ads

### Building Squib

 - First git clone this repo and cd into `squib`
 - Next run `npm install` you may need to run `npm install -g gulp`
 - Next run `gulp` optionally you can run `gulp watch` this results in a new build being created
 anytime you save a file in `./src`

The build file will be in `./final/squib.js`. The build process uses Common JS module definitions
and uses gulp-browserfy to produce the build.

#### Running the linter

`JSHint` is used to statically analyze the code for potential errors and `jscs` is used to look for style errors.
`jscs` is configured to use Douglas Crockford's recommended style. This combination of JSHint and jscs
should yield the same results as using `JSLint`

To run the liner issue the command: `$ gulp lint`

**Please always run the linter and fix any errors before committing code**

#### Running the unit tests

Jasmine is used to unit tests the various modules and classes that make up Squib. All unit tests can be found in `./tests` and
are named according to what it is they are testing followed by `test.js` Example: `gpthandler.test.js`

To run the tests issue the command: `$ gulp test`

**Please always run the unit tests and fix any errors before committing code**

#### Building the Documentation

`$ npm run doc`

Documentation will be created in the `./docs` directory

---

## Things to do:

### Validation for json slot configuration

### Unit Tests need to be written for

- util.foreachProp
- The GPTHandler class (work has started on this)
- The Squib Class
- The SquibSlot Class
- The SquibConfig Classes

### Research documentation options

What choice of documentation tools/generators (for example JSDoc) requires the least amount of effort to
maintain high quality and accurate documentation? Is the best option even a generating tool?

### Modify the `gulp prod-build` command

It should run each of the following tasks: `['clean', 'lint', 'test']` and fail to produce
a build if `lint` or `test` report errors.
