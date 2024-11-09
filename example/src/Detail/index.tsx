import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CallKeepService } from '../services/CallKeepService';

export default function InCallScreen() {
  const navigation = useNavigation();
  const [isMuted, setIsMuted] = React.useState(false); // Mute state
  const [isOnHold, setIsOnHold] = React.useState(false); // Hold state

  // Handle end call
  const handleEndCall = () => {
    CallKeepService.instance().endAllCall();
    navigation.goBack();
  };

  // Handle mute toggle
  const handleMute = () => {
    setIsMuted((prev) => !prev);
    // Implement mute logic if needed here (e.g., CallKeepService mute call)
  };

  // Handle hold toggle
  const handleHold = () => {
    setIsOnHold((prev) => !prev);
    // Implement hold logic if needed here
  };

  return (
    <View style={styles.container}>
      <View style={styles.inCallContainer}>
        {/* Display the caller's info or call status */}
        <Text style={styles.callStatus}>In Call</Text>
        <Text style={styles.callerInfo}>Caller: John Doe</Text>

        {/* Call Control Buttons */}
        <View style={styles.inCallButtons}>
          <TouchableOpacity
            style={[styles.button, styles.muteButton]}
            onPress={handleMute}
          >
            <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.holdButton]}
            onPress={handleHold}
          >
            <Text style={styles.buttonText}>
              {isOnHold ? 'Resume' : 'Hold'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <Text style={styles.buttonText}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  inCallContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  callStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  callerInfo: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
  },
  inCallButtons: {
    flexDirection: 'row', // Use row to align buttons horizontally
    justifyContent: 'space-around', // Space between buttons
    width: '80%', // Give enough space for buttons to fit
  },
  button: {
    width: 80, // Give each button a fixed width
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  muteButton: {
    backgroundColor: '#FFC107', // Yellow for mute
  },
  holdButton: {
    backgroundColor: '#2196F3', // Blue for hold
  },
  endCallButton: {
    backgroundColor: '#FF5722', // Red for end call
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
