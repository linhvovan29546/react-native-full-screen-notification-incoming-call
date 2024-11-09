# react-native-full-screen-notification-incoming-call

**This library enables full screen incoming call notifications on Android**  , leveraging Android's time-sensitive notifications. For more information, refer to the official (https://developer.android.com/training/notify-user/time-sensitive).

⚠️ **This library is only compatible with Android.** 

Starting from Android 12, the incoming call notification UI will resemble the one depicted here: https://developer.android.com/develop/ui/views/notifications/call-style
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

# Features
- Full-screen incoming call notifications
- Customizable notification options (icons, colors, sound, etc.)
- Android 12+ call-style UI support

# Installation
```sh
npm install react-native-full-screen-notification-incoming-call

```
### Compatibility
Ensure you are using the appropriate version of this library for your React Native version:


 | Library Version                         | React Native Version |
| ------------------------------------- | ----------------------------- |
| `react-native-full-screen-notification-incoming-call >= 0.1.8`   | `  >=  0.61.0`                  |
| `react-native-full-screen-notification-incoming-call` `<= 0.1.7`  | ` < 0.61.0`                     |



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
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_PHONE_CALL" />
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

# Usage

````js
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
````

## Display Notification
The displayNotification function is used to show an incoming call notification with customizable options

````ts
function displayNotification(uid:string, avatar?:string, timeout?:number, foregroundOptions:ForegroundOptionsModel):void
````
### Parameters
| Parameter           | Type                  | Description                                                              | Required |
|---------------------|-----------------------|--------------------------------------------------------------------------|----------|
| `uid`               | `string`              | Unique identifier for the call.                                          | Yes      |
| `avatar`            | `string` (optional)   | URL of the avatar image.                                                 | No       |
| `timeout`           | `number` (optional)   | Timeout duration in milliseconds.                                        | No       |
| `foregroundOptions` | `ForegroundOptionsModel` | Options for customizing the foreground notification.                     | Yes      |

### `ForegroundOptionsModel` Type

| Property             | Type                  | Description                                                                   | Required |
|----------------------|-----------------------|-------------------------------------------------------------------------------|----------|
| `channelId`          | `string`              | Channel ID of the notification.                                               | Yes      |
| `channelName`        | `string`              | Channel name of the notification.                                             | Yes      |
| `notificationIcon`   | `string`              | Icon of the notification (mipmap).                                            | Yes      |
| `notificationTitle`  | `string`              | Title of the notification.                                                    | Yes      |
| `notificationBody`   | `string`              | Body text of the notification. On Android 12 and above, if the notificationBody is empty, the incoming call notification will display the description from CallStyle instead of this property.                                          | No      |
| `answerText`         | `string`              | Label for the answer button. On Android 12 and above, the incoming call notification displays the answerText from CallStyle instead of this property.                                             | Yes      |
| `declineText`        | `string`              | Label for the decline button. On Android 12 and above, the incoming call notification displays the declineText from CallStyle instead of this property.                                              | Yes      |
| `notificationColor`  | `string` (optional)   | Color of the notification.                                                    | No       |
| `notificationSound`  | `string` (optional)   | Sound for the notification (raw).                                             | No       |
| `mainComponent`      | `string` (optional)   | Main component name for a custom incoming call screen.                        | No       |
| `isVideo`            | `boolean` (optional)  | Indicates if the call is a video call (default is `false`).                   | No       |
| `payload`            | `any` (optional)      | Additional data for the notification.                                         | No       |


### Example Usage:

````ts
RNNotificationCall.displayNotification(
  '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad',
  null,
  30000,
  {
    channelId: 'com.abc.incomingcall',
    channelName: 'Incoming video call',
    notificationIcon: 'ic_launcher', // mipmap
    notificationTitle: 'Linh Vo',
    notificationBody: 'Incoming video call',
    answerText: 'Answer',
    declineText: 'Decline',
    notificationColor: 'colorAccent',
    isVideo: true,
    notificationSound: null, // raw
    // mainComponent: 'MyReactNativeApp', // AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
    // payload: { name: 'Test', body: 'test' }
  }
);
````

## Hide Notification
The hideNotification function is used to dismiss the current incoming call notification
````ts
function hideNotification(): void;
````

### Example Usage:

````ts
//example
RNNotificationCall.hideNotification();
````

## Answer Event
The listener to the "answer" event.
### `addEventListener` for `answer` Event

The `addEventListener` function allows listening for an "answer" event when a user answers an incoming call notification.

````ts
function addEventListener(eventName: 'answer', handler: (payload: AnswerPayload) => void): void;
````
### Parameters

| Parameter   | Type                              | Description                                          | Required |
|-------------|-----------------------------------|------------------------------------------------------|----------|
| `eventName` | `'answer'`                        | The event name, which is set to `'answer'`.          | Yes      |
| `handler`   | `(payload: AnswerPayload) => void` | Function called when the event is triggered.         | Yes      |

### `AnswerPayload` Type

| Property   | Type       | Description                                | Required |
|------------|------------|--------------------------------------------|----------|
| `callUUID` | `string`   | Unique identifier for the call.            | Yes      |
| `payload`  | `string` (optional) | Additional data in JSON string format. | No       |

### Example Usage:
````ts
// Listening for the 'answer' event
RNNotificationCall.addEventListener('answer', (data) => {
  RNNotificationCall.backToApp();
});
````


## End Call Event
The listener reacts to the "endCall" event, providing the call's UUID, reason for the call end (e.g., declined by the user or auto-hidden), and any additional data.
### `addEventListener` for `endCall` Event

The `addEventListener` function allows listening for an "endCall" event, triggered when a call ends or is declined.

````ts
function addEventListener(eventName: 'endCall', handler: (payload: DeclinePayload) => void): void;
````
### Parameters

| Parameter   | Type                                | Description                                           | Required |
|-------------|-------------------------------------|-------------------------------------------------------|----------|
| `eventName` | `'endCall'`                         | The event name, which is set to `'endCall'`.          | Yes      |
| `handler`   | `(payload: DeclinePayload) => void` | Function called when the event is triggered.          | Yes      |

### `DeclinePayload` Type

| Property     | Type                                                               | Description                                                                                     | Required |
|--------------|--------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|----------|
| `callUUID`   | `string`                                                           | Unique identifier for the call.                                                                 | Yes      |
| `payload`    | `string` (optional)                                                | Additional data in JSON string format.                                                          | No       |
| `endAction`  | `'ACTION_REJECTED_CALL' \| 'ACTION_HIDE_CALL'`                         | Indicates the reason for the call ending. Possible values are:<br> - `ACTION_REJECTED_CALL`: When the call is declined by the user or through `declineCall` function.<br> - `ACTION_HIDE_CALL`: When the notification hides automatically after a timeout. | Yes      |

### Example Usage:

````ts
// Listening for the 'endCall' event
RNNotificationCall.addEventListener('endCall', (data) => {
  const { callUUID, endAction, payload } = data;
});
````

## Remove Event
The removeEventListener function allows you to unlistener an event listener for specific call-related events, such as "answer" or "endCall." This is useful to prevent memory leaks and ensure that listeners are only active when needed.
````ts
function removeEventListener(eventName: 'answer' | 'endCall'): void;
````
### Parameters

| Parameter   | Type                     | Description                                                      | Required |
|-------------|--------------------------|------------------------------------------------------------------|----------|
| `eventName` | `'answer'` \| `'endCall'` | Specifies the event to remove: either "answer" or "endCall".     | Yes      |

### Example Usage:


````ts
// Example
RNNotificationCall.removeEventListener('answer');
RNNotificationCall.removeEventListener('endCall');
````

## Back to App
The backToApp function brings the user back to the app from a call notification screen. This is useful for when the user answers or interacts with a call and needs to return to the app interface.
````ts
function backToApp(): void;
````

### Example Usage:

````ts
// Example
RNNotificationCall.backToApp();
````

## Decline Call

The `declineCall` function is used to decline an incoming call notification by its unique identifier. You can also provide an optional payload as a JSON string for additional context or data.

```typescript
function declineCall(uuid: string, payload?: string): void;
```

### Parameters

| Parameter | Type     | Description                                     | Required |
|-----------|----------|-------------------------------------------------|----------|
| `uuid`    | `string` | The unique identifier for the call to decline. | Yes      |
| `payload` | `string` | An optional JSON string for additional data.   | No       |

### Example Usage:

````ts
// Example: Declining a call with a specific UUID and an optional payload
RNNotificationCall.declineCall(
  '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad', 
  JSON.stringify({ name: 'Test', Body: 'test' })
);
````

In this example:
- The `declineCall` function is called with a specific UUID representing the call to be declined.
- An optional payload is passed as a JSON string, which can be useful for providing additional context about the decline action.
Here’s the updated documentation for the "Answer Call" section, formatted for clarity and detail:

---

## Answer Call

The `answerCall` function is used to answer an incoming call notification by its unique identifier. An optional payload can also be provided as a JSON string for additional context or data.

### Function Signature

```typescript
function answerCall(uuid: string, payload?: string): void;
```

### Parameters

| Parameter | Type     | Description                                     | Required |
|-----------|----------|-------------------------------------------------|----------|
| `uuid`    | `string` | The unique identifier for the call to answer.  | Yes      |
| `payload` | `string` | An optional JSON string for additional data.   | No       |

### Example Usage:

````ts
// Example: Answering a call with a specific UUID and an optional payload
RNNotificationCall.answerCall(
  '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad', 
  JSON.stringify({ name: 'Test', Body: 'test' })
);
````

In this example:
- The `answerCall` function is invoked with a specific UUID representing the call to be answered.
- An optional payload is passed as a JSON string, which can provide additional context regarding the action of answering the call.


# Todos
- [] Update the example to be simpler.
- [] Customize incoming call notification UI for Android versions below 12.
# Troubleshooting

- Custom Android notification sound:
  - Since Android Oreo / 8 the Notification sound is coming from the Channel and can only be set the first time you add the channel via your channel.setSound(). If you want to change it later on you need to delete the channel and then re-add it to the system.
  
- Android target 31 or higher:  android.app.BackgroundServiceStartNotAllowedException: Not allowed to start service Intent (android.app.BackgroundServiceStartNotAllowedException: Not allowed to start service Intent) https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/38
- On Android 13: Make sure enable notification permission relate https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues/42

# Contributing
I love contributions! Check out my [contributing docs](CONTRIBUTING.md) to get more details into how to run this project, the examples, and more all locally.

# How to send a pull-request
To send a pull-request please follow these rules for naming the commit message. Based on the commit messages, increment the version from the latest release.

- If the string "`BREAKING CHANGE`" is found anywhere in any of the commit messages or descriptions the major version will be incremented.
- If a commit message begins with the string "`feat`" then the minor version will be increased. "feat: new API".
- All other changes will increment the `patch version`.

# Issues

Have an issue with using the runtime, or want to suggest a feature/API to help make your development life better? Log an issue in our [issues](https://github.com/linhvovan29546/react-native-full-screen-notification-incoming-call/issues) tab! You can also browse older issues and discussion threads there to see solutions that may have worked for common problems.

# License

MIT
