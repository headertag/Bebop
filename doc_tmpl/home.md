
Bebop **is not a tag manager**, it does not manage header bidders or DMPs, it is a library that wraps GPT.

## Product Features

 - Support for Headertag Integration through configuration
 - Simple API
 - Eliminate common errors by only exposing the bebop object through the async queue
 - Easy Configuration
 - Support for multiple screen sizes
 - Asynchronous loading of the library and it's configuration

---

## Loading Bebop

Bebop, when it loads, requires a small [configuration object](module-public_config-BebopConfig.html).
This object informs Bebop of several things the most important of witch is what size(s) ads should be
rendered as given the width of the view port.

Bebop has been designed to load and read the configuration object in one of two ways:
Synchronously and Asynchronously.

### Loading Bebop and its configuration synchronously

In this example Bebop itself is still loaded asynchronously, however, the configuration object
is sitting on the page waiting for Bebop to load.

```language=html
<head>
<script type="text/javascript">
(function (window) {
    window.bebopQueue = window.bebopQueue || [];
    window.bebopConfig = {
        gpt: {
            loadTag: true
        },
        viewPort: {
            getViewPortWidth: function () {
                // a function that returns the current width of the view port.
            },
            'large' : 768,
            'small' : 0
        }
    };
    window.bebopQueue.push(function (bebop) {
        var slot = bebop.defineSlot({
            'gptDivId': "gpt-div-leaderboard",
            'adUnitPath': '1234/homepage',
            'targeting': {
                'pos': 'subnav'
            },
            'viewPortSizes': {
                'large': [ [970, 90], [728, 90] ],
                'small': [ [320, 50], [300, 50] ]
            }
        });

        bebop.display(slot);
    });
}(window));
</script>
<!-- Load Bebop -->
<script async type="text/javascript" src="path/to/bebop.js"></script>
</head>
```

The `loadTag: true` option informs Bebop that it is responsible for loading the Google Publisher Tag
library.

---

### Loading Bebop Asynchronously

In this example the Bebop configuration object, Bebop and GPT are all loaded asynchronously.


```language=html

<head>
<!-- Load Bebop -->
<script async type="text/javascript" src="//path/to/bebop.js"></script>

<!-- Load the Google Publisher Tag library -->
<script async type="text/javascript" src="//www.googletagservices.com/tag/js/gpt.js"></script>

<!-- Load the file that contains calls to Bebop -->
<script async type="text/javascript" src="//path/to/bebop-config.js"></script>

</head>
```

**Please note** that it does not matter what order Bebop and the config object are loaded in as
long as the config object is passed to Bebop via `window.bebopQueue.unshift`.

`bebop-config.js` may look something like this

```language=JavaScript
(function (window) {

    function gptWindowWidth(){
        var w = window.document.documentElement;
        return Math.max(w.scrollWidth, w.offsetWidth, w.clientWidth);
    }

    window.bebopQueue = window.bebopQueue || [];
    window.bebopQueue.unshift({
        viewPort: {
            getViewPortWidth: gptWindowWidth,
            'large' : 768,
            'small' : 0
        }
    });

    window.bebopQueue.push(function (bebop) {
        var slot = bebop.defineSlot({
            'gptDivId': "gpt-div-leaderboard",
            'adUnitPath': '1234/homepage',
            'targeting': {
                'pos': 'subnav'
            },
            'viewPortSizes': {
                'large': [ [970, 90], [728, 90] ],
                'small': [ [320, 50], [300, 50] ]
            }
        });

        bebop.display(slot);
    });
}(window));
```

When loading both Bebop and its configuration asynchronously the configuration object must be passed to bebop
via `window.bebopQueue.unshift(bebopConfig);`

**Please note** it is not an error to reverse the calls to:

`window.bebopQueue.unshift({});` and `window.bebopQueue.push(function (bebop) {});`

---

### Initialization Procedure

When Bebop first loads on the page it performs the following steps.

1. look for the BebopConfig object referenced by `window.bebopConfig`
    - If the object exists proceed to step 3.
    - If the object does not exist
        - if the queue is empty proceed to step 4.
        - if the queue is not empty proceed to step 2

2. Examine the first element of the queue
    - if it is the configuration object proceed to step 3.
    - if it is not the configuration object, proceed to step 4

3. Execute all callbacks in the queue, proceed to step 4.

4. Transform the queue from an array to an object.
    - if the configuration object has not yet been loaded, proceed to step 5.
    - if the configuration object has been loaded proceed to step 6.

5. Calls to `window.bebopQueue.push` will delay execution of the callbacks until
`window.bebopQueue.unshift(bebopConfig)` has been called. When `window.bebopQueue.unshift(bebopConfig)`
is called execute all the callbacks in the queue and proceed to step 6.

6. All calls to `window.bebopQueue.push` will execute the callback immediately.

---

## View Port Configuration

Bebop supports 5 view port categories: huge, large, medium, small and tiny. Each category can be
assigned a range for witch the category is considered active.

A category is considered active when the screen width is greater than or equal to the category's minimum value
and is less than the minimum value of the category above it.

Example:

```language=JavaScript
window.bebopQueue.unshift({
    viewPort: {
        getViewPortWidth: function () {
            // return screen width
        },
        // if getViewPortWidth returns a value >= 1000, then huge is the active category
        'huge'      : 1000,
        // if getViewPortWidth returns a value >= 800, and < 1000, then large is the active category
        'large'     : 800,
        // if getViewPortWidth returns a value >= 600, and < 800, then medium is the active category
        'medium'    : 600,
        // if getViewPortWidth returns a value >= 400, and < 600, then small is the active category
        'small'     : 400,
        // if getViewPortWidth returns a value >= 0, and < 400, then tiny is the active category
        'tiny'      : 0
    }
});
```

**Please note** that at least one size category is required, `getViewPortWidth` is also required.

Example

```language=JavaScript
window.bebopQueue.unshift({
    viewPort: {
        getViewPortWidth: function () {
            return 0;
        },
        // medium is always the active category
        'medium' : 0
    }
});
```

These category's are used to determine what size(s) slots should render as. In the following example
we define a slot with all 5 size categories.

If the active category is "huge" the slot will be defined to support the sizes 970x250 and 728x90.

If the active category is "tiny" the slot will be defined to support the size 200x50.

```language=JavaScript
window.bebopQueue.push(function (bebop) {
    var slot = bebop.defineSlot({
        'gptDivId': "gpt-div-leaderboard",
        'adUnitPath': '1234/homepage',
        'targeting': {
            'pos': 'subnav'
        },
        'viewPortSizes': {
            'huge'      :   [ [970, 250], [728, 90] ],
            'large'     :   [728, 90],
            'medium'    :   [320, 90],
            'small'     :   [300, 50],
            'tiny'      :   [200, 50]
        }
    });
});
```

**Please Note** Currently Bebop does not support re-rendering the ads when the view port size changes.
A common use case for the view port size changing is when the user flips from landscape to
portrait mode on a mobile device.

---

## Headertag Integration

To enable Headertag Bebop needs to know 2 things.

1. It needs to be explicitly told that Headertag is enabled
2. It needs to be explicitly told how to reference the global `window.headertag` object

Here is an Example configuration to enable Headertag:

```language=JavaScript
window.bebopQueue.unshift({
    headertag: {
        enabled: true,
        reference: function () {
            return window.headertag;
        }
    },
    viewPort: {
        getViewPortWidth: function () {
            return 0;
        },
        // medium is always the active category
        'medium' : 0
    }
});
```
This is all that is required from Bebop's perspective to enable Headertag on your property.

Headertag itself does need its own configuration object. Please see the Headertag configuration instructions
to properly setup Headertag.

---

## About the Documentation

The documentation is divided into two parts: The public API and Bebop's private components.

### The Public API Components

#### The Bebop Class

The only way to obtain a reference to Bebop is to use the `window.bebopQueue.push` method.

Example:

```language=JavaScript
window.bebopQueue.push(function (bebop) {
    // do something with bebop
});
```

[Class Documentation](module-public_bebop-Bebop.html)

#### The Slot Class

Slots can be created by calling [`bebop.defineSlot`](module-public_bebop-Bebop.html#defineSlot)
or [`bebop.defineSlots`](module-public_bebop-Bebop.html#defineSlots).

[Class Documentation](module-public_slot-Slot.html)

#### BebopConfig

A [Bebop Configuration](module-public_config-BebopConfig.html) object has three components.

- [View Port Configuration](module-public_config-ViewPortConfig.html)
- [Headertag Configuration](module-public_config-HeadertagConfig.html)
- [GPT Configuration](module-public_config-GPTConfig.html)

#### SlotConfig

For a full list of available Slot configuration options please [reference the docs](module-public_config-SlotConfig.html)

#### Errors

Two Error types are defined

The [TypeMismatchError](module-public_errors-TypeMismatchError.html) is thrown when a method expects a value to be of a type it did not receive.

Example:

```language=JavaScript
window.bebopQueue.push(function (bebop) {
    bebop.display("gpt-div-leaderboard"); // throws an error as display expects a slot object
});
```

The [InvalidStateError](module-public_errors-InvaildStateError.html) is thrown when a configuration item is invalid or missing.

```language=JavaScript
window.bebopQueue.push(function (bebop) {
    // throws an error as gptDivId is a required parameter.
    var slots = bebop.defineSlots([{
            'adUnitPath': '1234/homepage',
            'viewPortSizes': {
                'tiny': [200, 50]
            }
        }, {
            'gptDivId': 'gpt-div-leaderboard',
            'adUnitPath': '1234/homepage',
            'viewPortSizes': {
                'tiny': [200, 50]
            }
        }
    }]);
    bebop.display(slots);
});
```
