import React from 'react';
import SplashScreen from '../screens/splash';
import LoginScreen from '../screens/login';
import Dashboard from '../screens/dashboard';
import RecoveryPassScreen from '../screens/recoverpass';
import Actions from '../screens/actions';
import Escalated from '../screens/escalated';
import Watchlist from '../screens/watchlist';
import Sensor from '../screens/sensor';
import ModalScreen from '../components/modals';
import IntoNavigator from '../navigators/intro_navigation';
import DrawerNavigation from '../navigators/drawer_navigation';
import { navigationRef } from '../navigators/RootNavigation';

//remove when published
import test from '../components/testcode';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();




export default HomeScreen = (props) => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator  initialRouteName="Splash" headerMode='none' >
      <Stack.Screen name="Splash" component={SplashScreen} options = {{gestureEnabled:false}}/>
      <Stack.Screen name="MyModal" component={ModalScreen} options = {{gestureEnabled:false}}/>
      <Stack.Screen name="Login" component={LoginScreen} options = {{gestureEnabled:false}} />
      <Stack.Screen name="RecoveryScreen" component={RecoveryPassScreen} options = {{gestureEnabled:false}} />
      <Stack.Screen name="IntoNavigator" component={IntoNavigator} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options = {{gestureEnabled:false}}/>
      {/* <Stack.Screen name="Dashboard" options={{
        title: 'Status Overview',
        headerStyle: { elevation: 0, shadowOpacity: 0 },
        headerTitleAlign: 'center'
      }} component={Dashboard} />
       <Stack.Screen name="Sensor" options={{
        title: 'Sensor Overview',
        headerStyle: { elevation: 0, shadowOpacity: 0 },
        headerTitleAlign: 'center'
      }} component={Sensor} /> */}
      <Stack.Screen name="Action" options={{
        title: 'Action Required',
        headerStyle: { elevation: 0, shadowOpacity: 0 },
        headerTitleAlign: 'center',
        gestureEnabled:false
      }} component={Actions} />
       <Stack.Screen name="Escalated" options={{
        title: 'Escalated',
        headerStyle: { elevation: 0, shadowOpacity: 0 },
        headerTitleAlign: 'center',
        gestureEnabled:false
      }} component={Escalated} />
      <Stack.Screen name="Watchlist" options={{
        title: 'Watchlist',
        headerStyle: { elevation: 0, shadowOpacity: 0 },
        headerTitleAlign: 'center',
        gestureEnabled:false
      }} component={Watchlist} />


      {/* <Stack.Screen name="test" component={test} /> */}
    </Stack.Navigator>
  </NavigationContainer>
);