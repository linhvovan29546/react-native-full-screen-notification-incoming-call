import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CallKeepService } from '../services/CallKeepService';


export default function Detail() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        navigation.goBack()
        CallKeepService.instance().endAllCall()
      }}>
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
