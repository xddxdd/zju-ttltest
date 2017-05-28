# ZJU-UIUC ECE120 Project: TTL Chip Tester
A set of tools, including Arduino program, Python 3 script and Web interface to perform chip test on SN54/74 Series chips.

## Features
1. Single logic gate testing, identifying and checking
2. Minimal Sum of Products (SOP) calculation
3. Whole chip automated testing
4. User friendly web interface, no need to type commands into serial console

## Supported chips
- NAND2: SN54/74 00 Series
- NOR2: SN54/74 02 Series
- NOT: SN54/74 04 Series
- NAND3: SN54/74 10 Series
- NAND4: SN54/74 20 Series
- NOR3: SN54/74 27 Series
- DFF: SN54/74 74 Series (experimental)
- DFF: SN54/74 175 Series (experimental)

## Prerequisites
- **Arduino** for communicating with TTL chips
- **Arduino IDE** for downloading code into Arduino
- **Python 3** for running the program
- **Python 3 Tornado module** for web interface serving
- **Python 3 PySerial module** for communicating with Arduino

## Usage
1. Identify the serial port of your Arduino. Arduino IDE should show it on Menu -> Tools -> Port.
2. Open ttltest.py, change `/dev/cu.usbmodem1411` to your Arduino serial port.
3. Open up a Terminal (or Command Prompt on Windows) and cd into the directory.
4. `python3 ttltest.py`
5. Visit [http://127.0.0.1:8999](http://127.0.0.1:8999).

## About
This project is licensed under GPLv3. Licenses for other open source projects used can be found in the **About** tab of the web UI.