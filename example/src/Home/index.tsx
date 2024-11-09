import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ramdomUuid from 'uuid-random';
import { useNavigation } from '@react-navigation/native';
import { CallKeepService } from '../services/CallKeepService';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';

CallKeepService.instance().setupCallKeep();

// Define ringtone channel IDs
const ringtoneChannelIds = {
  default: 'com.abc.incomingcall',
  skype_ring: 'com.skype.incomingcall',
};

const IncomingCallDemo = () => {
  const navigation = useNavigation();
  CallKeepService.navigation = navigation;

  const [callerName, setCallerName] = useState('John Doe');
  const [callerImageURL, setCallerImageURL] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKet-b99huP_BtZT_HUqvsaSz32lhrcLtIDQ&s'
  );
  const [selectedRingtone, setSelectedRingtone] = useState<
    'default' | 'skype_ring'
  >('default');
  const [useCustomIncomingCallUI, setUseCustomIncomingCallUI] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(true);

  // Function to trigger the incoming call notification
  const displayIncomingCall = () => {
    const callUUID = ramdomUuid();
    CallKeepService.instance().displayCall({
      uuid: callUUID,
      handle: 'number',
      localizedCallerName: callerName,
      handleType: 'number',
      callerImage: callerImageURL,
      hasVideo: isVideoCall,
      other: {
        ringtone: selectedRingtone !== 'default' ? selectedRingtone : null,
        mainComponent: useCustomIncomingCallUI ? 'MyReactNativeApp' : null,
        channelId:
          ringtoneChannelIds[selectedRingtone] || ringtoneChannelIds.default,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Incoming Call Notification</Text>

      {/* Input for Caller Name */}
      <Text style={styles.label}>Caller Name:</Text>
      <TextInput
        style={styles.input}
        value={callerName}
        onChangeText={setCallerName}
        placeholder="Enter caller name"
        placeholderTextColor="gray"
      />

      {/* Input for Caller Image */}
      <Text style={styles.label}>Caller Image URL:</Text>
      <TextInput
        style={styles.input}
        value={callerImageURL}
        onChangeText={setCallerImageURL}
        placeholder="Enter image URL"
        placeholderTextColor="gray"
      />

      <View style={styles.imagePreviewContainer}>
        {!!callerImageURL && (
          <Image source={{ uri: callerImageURL }} style={styles.imagePreview} />
        )}
      </View>

      {/* Ringtone Picker */}
      <Text style={styles.label}>Ringtone:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRingtone}
          onValueChange={setSelectedRingtone}
        >
          <Picker.Item label="Default" value="default" />
          <Picker.Item label="Skype" value="skype_ring" />
        </Picker>
      </View>

      {/* Checkbox for Is Video Incoming */}
      <Text style={styles.label}>Is Video Call:</Text>
      <CheckBox
        value={isVideoCall}
        onValueChange={setIsVideoCall}
        tintColors={{ true: '#4CAF50' }}
      />

      {/* Checkbox for Custom UI */}
      <Text style={styles.label}>Use Custom Incoming Call UI:</Text>
      <CheckBox
        value={useCustomIncomingCallUI}
        onValueChange={setUseCustomIncomingCallUI}
        tintColors={{ true: '#4CAF50' }}
      />

      {/* Button to Simulate Incoming Call */}
      <TouchableOpacity style={styles.button} onPress={displayIncomingCall}>
        <Text style={styles.buttonText}>Display Incoming Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default IncomingCallDemo;
