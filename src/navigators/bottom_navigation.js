import React from 'react';
import { Image,View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text, useTheme ,Spinner} from '@ui-kitten/components';
import Dashboard from '../screens/dashboard';
import Sensor from '../screens/sensor';
import { NavigationContext } from '../navigation_context';







const { Navigator, Screen } = createBottomTabNavigator();

const SituationIcon = (props) => (
  <Image {...props} source={require('../screens/assets/situationIcon.png')} />
);

const MenuIcon = (props) => (
  <Image {...props} source={require('../screens/assets/MenuIcon.png')} />
)
const BellIcon = (props) => (
  <Image {...props} source={require('../screens/assets/bell.png')} />
)

const routeSensors = (index, navigation, state, user, sendContext) => {
  sendContext(1);
  navigation.navigate(state.routeNames[index], { user: user })
}
const routeSituation = (index, navigation, state, sendContext) => {
  sendContext(0);
  navigation.navigate(state.routeNames[index])
}

const BottomTabBar = ({ navigation, state, user, openDrawerMenu, sendContext, theme }) => (
  <BottomNavigation
    indicatorStyle={{ backgroundColor: theme['background-basic-color-1'] }}
    selectedIndex={state.index}
    onSelect={index => index == 1 ? routeSensors(index, navigation, state, user, sendContext) : index == 2 ? openDrawerMenu() : routeSituation(index, navigation, state, sendContext)}>
    <BottomNavigationTab title='Situations' icon={BellIcon} />
    <BottomNavigationTab title='Sensors' icon={SituationIcon} />
    <BottomNavigationTab title='More' icon={MenuIcon} />
  </BottomNavigation>
);


const TabNavigator = (props) => {
  const [navigationContext, setNavigationContext] = React.useContext(NavigationContext);
  

  let user = props.route.params.user;
  let openDrawerMenu = props.openDrawerMenu;
  const theme = useTheme();
  const SituationScreen = () => {
   
    return (
      <Dashboard {...props} />
    )
  }

  const SensorScreen = () => (
    <Sensor {...props} />
  );
  const MoreScreen = () => (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category='h1'>More</Text>
    </Layout>
  );

  return (
    <Navigator initialRouteName={props.initialScreen} tabBar={props => <BottomTabBar {...props} sendContext={setNavigationContext} theme={theme} openDrawerMenu={openDrawerMenu} user={user} />}>
      <Screen name='Situations' component={SituationScreen} />
      <Screen name='Sensors' component={SensorScreen} />
      <Screen name='More' component={MoreScreen} />
    </Navigator>
  )
};

export default AppNavigator = (props) => (
  <Layout style = {{flex:1,paddingBottom:20}}>
  <NavigationContainer independent={true}>
    <TabNavigator {...props} />
  </NavigationContainer>
  </Layout>
);