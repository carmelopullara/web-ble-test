## Notes
In order to discover multiple devices during the scan, the main process sends a "discoveredDevices" event to the renderer process, with an array of nearby BLE devices. This is done without calling the callback function, since it can return only one device.

In the client side, the scanned devices are stored in the React context, in order to be able to navigate between the two views without losing them.

Once the device is selected the scan is repeated, but this time a parameter is passed from the renderer, with the ID of the device. The callback returns the device and the client connects to it.
