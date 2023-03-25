import * as React from 'react';
import RNNotificationCall, {
  answerPayload,
  declinePayload,
} from '../../../src/index';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ramdomUuid from 'uuid-random';
import BackgroundTimer from 'react-native-background-timer';
import { useNavigation } from '@react-navigation/native';
import { CallKeepService } from '../services/CallKeepService';
import RNCallKeep from 'react-native-callkeep';
CallKeepService.instance().setupCallKeep()
export default function Home() {
  const navigation = useNavigation();

  const display = () => {
    // Start a timer that runs once after X milliseconds
    //rest of code will be performing for iOS on background too
    const uuid = ramdomUuid()
    CallKeepService.instance().displayCall(uuid)
  };
  const onHide = () => {
    RNNotificationCall.hideNotification();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 15,
        }}
        onPress={() => navigation.navigate('Detail')}
      >
        <Text>Go to detail</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 15,
        }}
        onPress={display}
      >
        <Text>Display</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          padding: 15,
          borderRadius: 15,
          marginTop: 15,
        }}
        onPress={onHide}
      >
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
