**React Native Full Screen Notification Incoming Call** This library works based on android display time-sensitive notifications
For more information about **Display time-sensitive notifications** (https://developer.android.com/training/notify-user/time-sensitive)
# Screenshot   
<p align="center" >
  <kbd>
    <img
      src="https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/blob/master/docs/background.gif"
      title="Background Demo"
      float="left"
    width="350" height="700"
    >
  </kbd>
  <kbd>
    <img
      src="https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/blob/master/docs/block.gif"
      title="Block Demo"
      float="left"
       width="350" height="700"
    >
  </kbd>
  <br>
  <em>FastImage example app.</em>
</p>

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
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.DISABLE_KEYGUARD" />
    <application ....>
      <activity android:name="com.reactnativefullscreennotificationincomingcall.IncomingCallActivity"
        android:theme="@style/incomingCall"
        android:launchMode="singleTask"
        android:excludeFromRecents="true"
        android:exported="true"
        android:showWhenLocked="true"
        android:turnScreenOn="true"
        />
        <activity android:name="com.reactnativefullscreennotificationincomingcall.NotificationReceiverActivity"
        android:theme="@style/incomingCall"
        android:launchMode="singleTask"
        android:excludeFromRecents="true"
        android:exported="true"
        android:showWhenLocked="true"
        android:turnScreenOn="true"
        />
         <service
         android:name="com.reactnativefullscreennotificationincomingcall.IncomingCallService"
         android:enabled="true"
         android:stopWithTask="false"
         android:exported="true" />

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
        notificationColor:"colorAccent",
        notificationSound: 'skype_ring',//raw 
        mainComponent:'MyReactNativeApp'//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
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
    - `notificationColor`: string (optional) color of notification 
    - `notificationSound`: raw file (optional) sound of notification
    - `mainComponent`:string appKey when custom incomingcall screen 
    - `payload`:any(optional) pass whatever data you want to get when custom incomingcall screen

#### hide notification

```js
  RNNotificationCall.hideNotification()

```
#### answer event 
```js
      RNNotificationCall.addEventListener("answer", (payload) => {
      RNNotificationCall.backToApp()
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
#### open app from quit state
```js
    RNNotificationCall.backToApp()
```
#### decline call
```js
     RNNotificationCall.declineCall(uuid)
```
#### answer call
```js
     RNNotificationCall.answerCall(uuid)
```

#### Known issue
- Custom Android notification sound :
  - Since Android Oreo / 8 the Notificationsound is coming from the Channel and can only be set the first time you add the channel via your channel.setSound(). If you want to change it later on you need to delete the channel and then re-add it to the system.
## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
