#!/usr/bin/env python3

import time
from networktables import NetworkTables

# To see messages from networktables, you must setup logging
import logging

logging.basicConfig(level=logging.DEBUG)

NetworkTables.initialize()
sd = NetworkTables.getTable("SmartDashboard")

i = 0
b = True
while True:
    sd.putNumber("robotTime", i)
    sd.putString("robotTimeString", str(i) + " seconds")
    sd.putString("myTable/robotTimeString", str(i) + " seconds again")
    sd.putBoolean("lightOn", b)

    time.sleep(1)
    i += 1
    b = not b
