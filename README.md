**React Native Full Screen Notification Incoming Call For Android** This library works based on android display time-sensitive notifications
For more information about **Display time-sensitive notifications** (https://developer.android.com/training/notify-user/time-sensitive).

⚠️ **This library only work for Android** .

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
</p>

# react-native-full-screen-notification-incoming-call

Android full screen notification incoming call for React Native

## Installation
## React Native Compatibility
To use this library you need to ensure you match up with the correct version of React Native you are using.

 | lib version                          | React Native Version |
| ------------------------------------- | ----------------------------- |
| `react-native-full-screen-notification-incoming-call` `>= 0.1.8`   | `  >=  0.61.0`                  |
| `react-native-full-screen-notification-incoming-call` `<= 0.1.7`  | ` < 0.61.0`                     |
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
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
```

#### display notification

````ts
 function displayNotification(uid:string, avatar?:string, timeout?:number, foregroundOptions:foregroundOptionsModel):void
//  uid: String required(Call UUID v4)
// - avatar: String optional(Avatar URL)
// - timeout: Number optional ex 20000(Timeout for end call after 20s)
type foregroundOptionsModel ={
  channelId: string; // string channel id of notification
  channelName: string;// channel name of notification
  notificationIcon: string;//mipmap channel icon of notification
  notificationTitle: string;//tile of notification
  notificationBody: string;//body of notification
  answerText: string;// answer button label
  declineText: string;//decline button label
  notificationColor?: string;//color of notification
  notificationSound?: string;//raw file sound of notification
  mainComponent?: string;//appKey (optional) to the custom incoming call screen. To understand the details you can check the [example](https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/blob/master/example/index.tsx)
  payload?:any//any Object (optional) pass whatever data you want to get when custom incomingcall screen or receive action/decline event
}

```                                                         |

```js
//example
RNNotificationCall.displayNotification(
  '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad',
  null,
  30000,
  {
    channelId: 'com.abc.incomingcall',
    channelName: 'Incoming video call',
    notificationIcon: 'ic_launcher', //mipmap
    notificationTitle: 'Linh Vo',
    notificationBody: 'Incoming video call',
    answerText: 'Answer',
    declineText: 'Decline',
    notificationColor: 'colorAccent',
    notificationSound: null, //raw
    //mainComponent:'MyReactNativeApp',//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
    // payload:{name:'Test',Body:'test'}
  }
);
````

#### hide notification

```ts
function hideNotification(): void;
```

```js
//example
RNNotificationCall.hideNotification();
```

#### answer event

```ts
function addEventListener(eventName: 'answer',handler(payload:answerPayload): void): void;
export interface answerPayload {
  callUUID: string; //call id
  payload?: string; // jsonString
}
```

```js
//example
RNNotificationCall.addEventListener('answer', (data) => {
  RNNotificationCall.backToApp();
  const { callUUID, payload } = data;
  console.log('press answer', callUUID);
});
```

#### endCall event

```ts
function addEventListener(eventName: 'endCall',handler(payload:declinePayload): void): void;

type declinePayload {
  callUUID: string;// call id
  payload?: string; // jsonString
  endAction: 'ACTION_REJECTED_CALL' | 'ACTION_HIDE_CALL';
}
 //ACTION_REJECTED_CALL => press button decline or call function declineCall
 //ACTION_HIDE_CALL => action name when notification auto hide by timeout
```

```js
// Example
RNNotificationCall.addEventListener('endCall', (data) => {
  const { callUUID, endAction, payload } = data;
  console.log('press endCall', callUUID);
});
```

#### remove event

```ts
function removeEventListener(eventName: 'answer' | 'endCall'): void;
```

```js
// Example
RNNotificationCall.removeEventListener('answer');
RNNotificationCall.removeEventListener('endCall');
```

#### back to app

```ts
function backToApp(): void;
```

```js
// Example
RNNotificationCall.backToApp();
```

#### decline call

```ts
function declineCall(uuid: string, payload?: string): void;
// payload(optinal) : json string
```

```js
// Example
RNNotificationCall.declineCall(22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad, JSON.stringify({name:'Test',Body:'test'}));
```

#### answer call

```ts
function answerCall(uuid: string, payload?: string): void;
// payload(optinal) : json string
```

```js
// Example
RNNotificationCall.answerCall(22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad, JSON.stringify({name:'Test',Body:'test'}));
```

#### Troubleshooting

- Custom Android notification sound:
  - Since Android Oreo / 8 the Notificationsound is coming from the Channel and can only be set the first time you add the channel via your channel.setSound(). If you want to change it later on you need to delete the channel and then re-add it to the system.
  
- Android target 31 or higher:  android.app.BackgroundServiceStartNotAllowedException: Not allowed to start service Intent (android.app.BackgroundServiceStartNotAllowedException: Not allowed to start service Intent) https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/38
- On Android 13: Make sure enable notification permission relate https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/42

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
