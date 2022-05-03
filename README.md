**React Native Full Screen Notification Incoming Call** This library works based on android display time-sensitive notifications
For more information about **Display time-sensitive notifications** (https://developer.android.com/training/notify-user/time-sensitive)
# Screenshot   
<table>
  <tr>
    <td><p align="center"><img src="/docs/screenshot1.jpeg" height="500"></p></td>
 <td><p align="center"><img src="/docs/screenshot2.jpeg" height="500"></p></td>
  <td><p align="center"><img src="/docs/screenshot3.jpeg" height="500"></p></td>
  </tr>
</table>

# react-native-full-screen-notification-incoming-call

Android full screen notification incoming call for React Native

## Installation

```sh
npm install react-native-full-screen-notification-incoming-call

```
## Manual installation
1. In `android/app/build.gradle`
Add a line `compile project(':react-native-full-screen-notification-incoming-call')` in `dependencies {}` section.

2. In `android/settings.gradle`
Add:

```java
include ':react-native-full-screen-notification-incoming-call'
project(':react-native-full-screen-notification-incoming-call').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-full-screen-notification-incoming-call/android')
```

3. In `android/app/src/main/java/.../MainApplication.java`:

```java
import com.reactnativefullscreennotificationincomingcall.FullScreenNotificationIncomingCallPackage; // Add this import line
//...

private static List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new FullScreenNotificationIncomingCallModule() // Add this line
    );
}
```
### Addition installation step
In `styles.xml`:
```java
  <style name="incomingCall" parent="Theme.AppCompat.Light.NoActionBar">color
<!-- Customize status bar color   -->
    <item name="colorPrimaryDark">#000000</item>
  </style>
```
In `AndroidManifest.xml`:
```java
// ...
    <uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <application ....>
    <activity android:name="com.reactnativefullscreennotificationincomingcall.IncomingCallActivity"
        android:theme="@style/incomingCall"
        android:showOnLockScreen="true"
        android:taskAffinity=""
        android:launchMode="singleTask"
        android:excludeFromRecents="true"
       />
         <service
         android:name="com.reactnativefullscreennotificationincomingcall.IncomingCallService"
         android:enabled="true"
         android:stopWithTask="false"
         android:exported="true" />

      <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
     .....
      </application>
```
## Usage

```js
import RNNotificationCall from "react-native-full-screen-notification-incoming-call";
```

#### display notification

```js
    RNNotificationCall.displayNotification(
      uid,
      avatar,
      timeout,
      foregroundOptions
    )
    //example
        RNNotificationCall.displayNotification(
      "22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad",
      null,
      30000,
      {
        channelId: "com.abc.incomingcall",
        channelName: "Incoming video call",
        notificationIcon: "ic_launcher",//mipmap
        notificationTitle: "Linh Vo",
        notificationBody: "Incoming video call",
        answerText: "Answer",
        declineText: "Decline",
        notificationColor:"colorAccent"
      }
    )
```
- `uid`: String required
  - Call UUID v4.
- `avatar`: String optinal
  - Avatar URL.
- `timeout`: Number optinal ex 20000
  - Timeout for end call after 20s.
- `foregroundOptions`: Object required
    - `channelId`: string (required) channel id of notification
    - `channelName`: string (required) channel name of notification
    - `notificationIcon`: string (required)  channel icon of notification
    - `notificationTitle`: string (required) tile of notification
    - `notificationBody`: string (required) body of notification
    - `answerText`: string (required) answer button label
    - `declineText`: string (required) decline button label
    - `notificationColor`: string (optinal) color of notification 

#### hide notification

```js
  RNNotificationCall.hideNotification()

```
#### answer event 
```js
      RNNotificationCall.addEventListener("answer", (payload) => {
      const {callUUID}=payload
      console.log('press answer',callUUID)
    })

```
#### endCall event 
```js
    RNNotificationCall.addEventListener("endCall", (payload) => {
      const {callUUID}=payload
      console.log('press endCall',callUUID)
    })

```
#### remove event 
```js
    RNNotificationCall.removeEventListener("answer")
    RNNotificationCall.removeEventListener("endCall")

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
