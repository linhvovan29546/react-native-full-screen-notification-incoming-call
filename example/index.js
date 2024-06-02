import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import CustomIncomingCall from './src/CustomIncomingCall';

AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
AppRegistry.registerComponent(appName, () => App);
