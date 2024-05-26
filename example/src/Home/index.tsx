import * as React from 'react';
import RNNotificationCall from '../../../src/index';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ramdomUuid from 'uuid-random';
import { useNavigation } from '@react-navigation/native';
import { CallKeepService } from '../services/CallKeepService';

CallKeepService.instance().setupCallKeep();
export default function Home() {
  const navigation = useNavigation();
  CallKeepService.navigation = navigation;
  const display = () => {
    // Start a timer that runs once after X milliseconds
    //rest of code will be performing for iOS on background too
    const uuid = ramdomUuid();
    CallKeepService.instance().displayCall(uuid);
  };
  const onHide = () => {
    RNNotificationCall.hideNotification();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Detail')}>
        <Text>Go to detail</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={display}>
        <Text>Display</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onHide}>
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
