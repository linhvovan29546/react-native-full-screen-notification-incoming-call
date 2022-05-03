import * as React from 'react';
import RNNotificationCall from '../../src/index'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
export default function App() {
  React.useEffect(() => {
    RNNotificationCall.addEventListener("answer", () => {
      console.log('press answer')
    })
    RNNotificationCall.addEventListener("endCall", () => {
      console.log('press endCall')
    })
    return () => {
      RNNotificationCall.removeEventListener("answer")
      RNNotificationCall.removeEventListener("endCall")
    };
  }, []);
  const display = () => {
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
