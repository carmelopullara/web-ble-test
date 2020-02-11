## Notes

**Scanning view**

In order to discover multiple devices during the scan, the main process sends a "discoveredDevices" event to the renderer process, with an array of nearby BLE devices. This is done without calling the callback function, since it can return only one device.

In the client side, the scanned devices are stored in the React context, in order to be able to navigate between the two views without losing the list.

*Please note*: I added a small "trick" to the reducer in order to update the device name if it changes (basically I needed it since I'm testing with the LightBlue app and switching between different virtual devices that have the same ID). You can view it in the `SET_NEARBY_DEVICE` case, in the index.tsx file.

Once the device is selected the scan is repeated, but this time a parameter is passed from the renderer, with the ID of the device. The callback returns the device and the client connects to it.

**Detail view**

Once the detail view is rendered, the `useEffect` hook is called. It first invokes the `read` method to retrieve the battery level, and then it subscribes to the device and updates the battery level when the value changes. The hook returns a function that unsubscribes and removes the event listeners, in order to avoid state updates on a unmounted component.

I complied with the WebBle interface you provided in the Notion doc, but the `device` parameter in the `connect`, `read`, `subscribe` and `disconnect` methods is not actually used because the device is already returned by the main process.

---

**About the styling**:

I usually prefer to use CSS modules, but since this app has very few components, I decided to use plain SCSS.

---

**To run the application**:

`yarn dev`
