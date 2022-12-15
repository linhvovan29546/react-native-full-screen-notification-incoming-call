import * as React from 'react';
import RNNotificationCall from '../../src/index'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ramdomUuid from 'uuid-random';
import BackgroundTimer from 'react-native-background-timer';

export default function App() {
  React.useEffect(() => {

    RNNotificationCall.addEventListener("answer", (payload) => {
      console.log('press answer', payload.callUUID)
      RNNotificationCall.backToApp()
    })
    RNNotificationCall.addEventListener("endCall", (payload) => {
      console.log('press endCall', payload.callUUID)
    })

    return () => {
      RNNotificationCall.removeEventListener("answer")
      RNNotificationCall.removeEventListener("endCall")
    };


  }, []);
  const getCurrentCallId = () => {
    return ramdomUuid().toLowerCase();
  };
  const display = () => {
    // Start a timer that runs once after X milliseconds
    const timeoutId = BackgroundTimer.setTimeout(() => {
      // this will be executed once after 10 seconds
      // even when app is the the background
      const uid = getCurrentCallId()
      console.log('uid', uid)
      RNNotificationCall.displayNotification(
        uid,
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
          notificationColor: 'colorAccent',//path color in android
          notificationSound: 'skype_ring',//raw 
          mainComponent: "MyReactNativeApp"
        }
      )
      // Cancel the timeout if necessary
      BackgroundTimer.clearTimeout(timeoutId);
    }, 0);

    //rest of code will be performing for iOS on background too

  }
  const onHide = () => {
    RNNotificationCall.hideNotification()
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 15
        }}
        onPress={display}>
        <Text>Display</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 15,
          marginTop: 15
        }}
        onPress={onHide}>
        <Text>Hide</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
