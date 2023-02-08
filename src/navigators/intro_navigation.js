import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Intro_first_Screen from '../screens/intro_step_1';
import Intro_second_Screen from '../screens/intro_step_2';
import Intro_third_Screen from '../screens/intro_step_3';
import Intro_fourth_Screen from '../screens/intro_step_4';
import Intro_fifth_Screen from "../screens/intro_step_5";
import { NavigationContainer } from '@react-navigation/native';
import { TabBar,Tab } from '@ui-kitten/components';


const { Navigator, Screen } = createMaterialTopTabNavigator();

const TabNavigator = () => {
    
    const TopTabBar = () => (
        <TabBar
            indicatorStyle = {{display:"none"}}
          style = {{display:"none"}}
         
          >
          <Tab  />
          <Tab  />
        </TabBar>
      );
    return (
      <Navigator  tabBar={props => <TopTabBar />} >
      <Screen name="IntroFirst" component={Intro_first_Screen} />
      <Screen name="IntroSecond" component={Intro_second_Screen} />
      <Screen name="IntroThird" component={Intro_third_Screen} />
      <Screen name="IntroFourth" component={Intro_fourth_Screen} />
      <Screen name="IntroFifth" component={Intro_fifth_Screen} />
      </Navigator>
    )
  };


export default introNavigator = (props) =>(
    <TabNavigator {...props} />
)
  