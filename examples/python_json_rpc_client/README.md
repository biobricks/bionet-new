
The JSON-RPC 2.0 API can be used by manually crafting objects according to the specification, serializing to JSON and then sending an HTTP request. An example of this is available in `manual.py`. 

It is usually simpler to employ an existing JSON-RPC 2.0 library. The [jsonrpc-requests](https://pypi.python.org/pypi/jsonrpc-requests) module seems to work well and the example `simple.js` shows its use.

To run the `simple.js` example

```
pip install jsonrpc-requests
```

Run a local bionet server:

```
./bin/server.js
```

Run the example:

```
./simple.js
```

# API differences

The javascript API functions documented in `API.md` are usable from the JSON-RPC 2.0 API but without stream support. When calling a function that would otherwise return a readable stream, an array is instead returned. Note that functions called via the JSON-RPC 2.0 API always return an array, so even if only a single result is returned it will be as an array with one element.

When calling a function that would return one or more values through a callback, when called from the javascript API, an array of these values is returned via the JSON-RPC 2.0 API.

As an example of the stream conversion, in the javascript API the `searchVirtuals(q, opts)` function returns a readable stream of objects representing the search results. From the JSON-RPC 2.0 API instead an array of objects is returned as JSON. The `stream.py` example demonstrates this, but will only return results if there is anything in the database matching the query.