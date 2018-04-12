#!/usr/bin/env python

from jsonrpc_requests import Server, ProtocolError

# example of using the jsonrpc_requests library
def main():

    # bionet nodes have a json_rpc endpoint at /rpc
    bionet = Server('http://localhost:8000/rpc')

    try:
        res = bionet.searchVirtuals('t')
        print "foo() said: %s" % res
    except ProtocolError as err:
        print("while calling .searchVirtuals(): %s" % err.message)


if __name__ == "__main__":
    main()
