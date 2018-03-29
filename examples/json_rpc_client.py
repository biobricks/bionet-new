#!/usr/bin/env python

from jsonrpc_requests import Server, ProtocolError

# example of manually running a JSON-RPC 2.0 call
# without any libraries
def manual():

    import requests
    import json

    url = "http://localhost:8000/rpc"
    headers = {'content-type': 'application/json'}

    payload = {
        "method": "foo",
        "params": [],
        "jsonrpc": "2.0",
        "id": 0,
    }
    response = requests.post(
        url, data = json.dumps(payload), headers=headers
    ).json()

    print response
    
# example of using the jsonrpc_requests library
def main():

    bionet = Server('http://localhost:8000/rpc')

    try:
        res = bionet.foo()
        print "foo() said: %s" % res
    except ProtocolError as err:
        print("while calling .foo(): %s" % err.message)

    try:
        res = bionet.foo_user()
    except ProtocolError as err:
        print("while calling .foo_user(): %s" % err.message)

    res = bionet.login('juul', 'foobarbaz')
    print "logged in and got: %s" % res 

    res = bionet.foo_user()
    print "foo_user() said: %s" % res


if __name__ == "__main__":
    main()
