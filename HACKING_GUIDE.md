
# globals

`app` (or `window.app`) is and should be the only global.

The only place it's ok to modify `app.*` properties is in `index.js`. 

The only places it's ok to modify `app.state.*` is in actions (in `src/js/actions/*.js`) or in `index.js`.

If these restrictions cause problems or gnarly code, bring it up and we can discuss.

The `app.*` globals:

* app.remote: The rpc-multistream connection
* app.state: The [ashnazg](https://www.npmjs.com/package/ashnazg) application state
* app.actions: Actions (functions) that modify application state



