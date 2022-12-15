import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { customIncomingActivityProps } from 'react-native-full-screen-notification-incoming-call';
import RNNotificationCall from '../../../src/index'
export default function CustomIncomingCall(props: customIncomingActivityProps) {
  console.log('props===', props)
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={() => {
        RNNotificationCall.declineCall(props.uuid)
      }}>
        <Text>Decline</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.box}
        onPress={() => {
          RNNotificationCall.answerCall(props.uuid)
        }}
      >
        <Text>Answer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
