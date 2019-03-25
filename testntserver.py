#!/usr/bin/env python3

import time
from networktables import NetworkTables

# To see messages from networktables, you must setup logging
import logging

logging.basicConfig(level=logging.DEBUG)

NetworkTables.initialize()
sd = NetworkTables.getTable("SmartDashboard")

i = 0
while True:
    sd.putNumber("robotTime", i)
    sd.putString("robotTimeString", str(i) + " seconds")

    time.sleep(1)
    i += 1
