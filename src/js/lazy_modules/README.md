
This directory is for code that needs to be dynamically loaded at runtime (async/lazy loading). We do this with some code to keep e.g. heavy webgl and image processing code out of the normal `bundle.js` and then dynamically load that code only when it is needed.

Each file in this directory will be bundled into a stand-alone module that can be require'd from a component using:

```
var util = require('../util.js');

util.requireAsync('mymodule', function(err, mymodule) {

});
```

These files are not automatically rebuilt by e.g. `npm run dev`. To build them you need to run:

```
npm run build-lazy
```

If you just want to create a dynamically loadable module from an existing npm module then you can instead add the name of the module as a line to the `PACKAGES` in this directory.

For example usage see `components/dynamic_loading.js` and the route `/dynamic-loading`.