#!/usr/bin/env python3

import asyncio
import websockets
import json
from networktables import NetworkTables

import logging

logging.basicConfig(level=logging.INFO)

# TODO: Get a robot IP somehow
NetworkTables.initialize(server='127.0.0.1')

def main():
    wsclients = set()
    allKeys = dict()

    def updateClients():
        data = json.dumps(allKeys)
        for ws in wsclients:
            asyncio.run(ws.send(data))

    def connectionListener(connected, info):
        print(info, "; Connected=%s" % connected)

    def valueChanged(key, value, isNew):
        allKeys[key] = value
        updateClients()

    NetworkTables.addConnectionListener(connectionListener, immediateNotify=True)
    NetworkTables.addEntryListener(valueChanged)

    async def wshandler(ws, path):
        wsclients.add(ws)
        await ws.wait_closed()
        wsclients.remove(ws)

    start_server = websockets.serve(wshandler, '127.0.0.1', 5678)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    main();
