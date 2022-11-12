import * as React from 'react';
import RNNotificationCall from '../../src/index'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ramdomUuid from 'uuid-random';
export default function App() {
  React.useEffect(() => {
    RNNotificationCall.addEventListener("answer", () => {
      console.log('press answer')
    })
    RNNotificationCall.addEventListener("endCall", (value) => {
      console.log('press endCall', value.callUUID)
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
    RNNotificationCall.displayNotification(
      getCurrentCallId(),
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
