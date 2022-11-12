import * as React from 'react';
import RNNotificationCall from '../../src/index'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ramdomUuid from 'uuid-random';

export default function App() {
  React.useEffect(() => {

    RNNotificationCall.addEventListener("answer", (payload) => {
      console.log('press answer', payload.callUUID)

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
        notificationColor: 'colorAccent'//path color in android
      }
    )
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
