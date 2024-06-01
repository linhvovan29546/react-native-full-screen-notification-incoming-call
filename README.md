**This library enables full screen incoming call notifications on Android**  , leveraging Android's time-sensitive notifications. For more information, refer to the official (https://developer.android.com/training/notify-user/time-sensitive).

⚠️ **This library is only compatible with Android.** .

# Screenshot

<p align="center">
  <kbd>
    <img
      src="https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/blob/master/docs/background.gif"
      title="Background Demo"
      width="350" height="700"
    >
  </kbd>
  <kbd>
    <img
      src="https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/blob/master/docs/block.gif"
      title="Block Demo"
      width="350" height="700"
    >
  </kbd>
</p>

# react-native-full-screen-notification-incoming-call

Provides full screen incoming call notifications for React Native applications on Android.

## Installation
## React Native Compatibility
Ensure you are using the appropriate library version for your React Native version.

 | Library Version                         | React Native Version |
| ------------------------------------- | ----------------------------- |
| `react-native-full-screen-notification-incoming-call >= 0.1.8`   | `  >=  0.61.0`                  |
| `react-native-full-screen-notification-incoming-call` `<= 0.1.7`  | ` < 0.61.0`                     |
```sh
npm install react-native-full-screen-notification-incoming-call

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
    <uses-permission android:name="android.permission.CALL_PHONE" />
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
         android:foregroundServiceType="phoneCall"
         android:exported="true" />

     .....
      </application>
```

## Usage

```js
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
```

#### Display Notification

```ts
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
```

Example:
```ts
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

#### Hide Notification

````ts
function hideNotification(): void;
````
Example:

````js
//example
RNNotificationCall.hideNotification();
````

#### Answer Event

````ts
function addEventListener(eventName: 'answer',handler(payload:answerPayload): void): void;
export interface answerPayload {
  callUUID: string; //call id
  payload?: string; // jsonString
}
````
Example:
````js
//example
RNNotificationCall.addEventListener('answer', (data) => {
  RNNotificationCall.backToApp();
  const { callUUID, payload } = data;
  console.log('press answer', callUUID);
});
````

#### End Call Event

````ts
function addEventListener(eventName: 'endCall',handler(payload:declinePayload): void): void;

type declinePayload {
  callUUID: string;// call id
  payload?: string; // jsonString
  endAction: 'ACTION_REJECTED_CALL' | 'ACTION_HIDE_CALL';
}
 //ACTION_REJECTED_CALL => press button decline or call function declineCall
 //ACTION_HIDE_CALL => action name when notification auto hide by timeout
````
Example:
````js
// Example
RNNotificationCall.addEventListener('endCall', (data) => {
  const { callUUID, endAction, payload } = data;
  console.log('press endCall', callUUID);
});
````

#### Remove Event

````ts
function removeEventListener(eventName: 'answer' | 'endCall'): void;
````
Example:
````js
// Example
RNNotificationCall.removeEventListener('answer');
RNNotificationCall.removeEventListener('endCall');
````

#### Back to App

````ts
function backToApp(): void;
````
Example:
````js
// Example
RNNotificationCall.backToApp();
````

#### Decline Call

````ts
function declineCall(uuid: string, payload?: string): void;
// payload(optinal) : json string
````
Example:
````js
// Example
RNNotificationCall.declineCall(22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad, JSON.stringify({name:'Test',Body:'test'}));
````

#### Answer Call

````ts
function answerCall(uuid: string, payload?: string): void;
// payload(optinal) : json string
````
Example:
````js
// Example
RNNotificationCall.answerCall(22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad, JSON.stringify({name:'Test',Body:'test'}));
````

#### Troubleshooting

- Custom Android notification sound:
  - Since Android Oreo / 8 the Notificationsound is coming from the Channel and can only be set the first time you add the channel via your channel.setSound(). If you want to change it later on you need to delete the channel and then re-add it to the system.
  
- Android target 31 or higher:  android.app.BackgroundServiceStartNotAllowedException: Not allowed to start service Intent (android.app.BackgroundServiceStartNotAllowedException: Not allowed to start service Intent) https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/38
- On Android 13: Make sure enable notification permission relate https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/42

## Contributing
I love contributions! Check out my [contributing docs](CONTRIBUTING.md) to get more details into how to run this project, the examples, and more all locally.

## Issues

Have an issue with using the runtime, or want to suggest a feature/API to help make your development life better? Log an issue in our [issues](https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues) tab! You can also browse older issues and discussion threads there to see solutions that may have worked for common problems.

## License

MIT
