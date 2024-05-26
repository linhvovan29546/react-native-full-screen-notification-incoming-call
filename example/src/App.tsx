import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Detail from './Detail';
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        headerMode={'none'}
        screenOptions={{ gestureEnabled: false, animationEnabled: false }}
      >
        <Stack.Screen name={'Home'} component={Home} />
        <Stack.Screen name={'Detail'} component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
