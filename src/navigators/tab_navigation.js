import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Icon,useTheme, Layout } from '@ui-kitten/components';
import { Image,View } from 'react-native';
import Life_saving from '../screens/life_saving'
import Other from '../screens/other';
import strings from '../Localization'

const { Navigator, Screen } = createMaterialTopTabNavigator();


const OtherIcon = (props) => (
  <Image {...props}   source={require('../screens/assets/Icon.png')} />
);

const BellIcon = (props) => (
  <Image {...props} source={require('../screens/assets/IconImp.png')} />
);
const BellImpIcon = (props) => (
  <View>
  <Image {...props} style= {{width:10,height:10,marginLeft: 12,resizeMode: "stretch"}}  source={require('../screens/assets/Ellipse.png')} />
  <Image {...props} source={require('../screens/assets/IconImp.png')} />
  </View>
);

const TopTabBar = ({ navigation, state ,data,theme,impIcon}) => (
  <TabBar
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
    style = {{borderBottomWidth:5,borderColor:"rgba(143, 155, 179, 0.16);"}}
    indicatorStyle = {{marginTop:-5}}
    >
    <Tab title={strings.Important} icon={impIcon ? BellImpIcon : BellIcon} />
    <Tab title={strings.Other} icon={OtherIcon} />
  </TabBar>
);



export default Tabnavigation = (props) => {
  
  const theme = useTheme();
  let datacheck = props.newdata
  let navcheck = props.navcheck();
  const ImportantTab = () => (
    <Life_saving {...props} />
  );
  const OtherTab = () => (
    <Other {...props} />
  );
  return (
    <Navigator tabBar={props => <TopTabBar theme = {theme} data = {datacheck} impIcon = {navcheck} {...props} />}>
      <Screen name="Important" component={ImportantTab} />
      <Screen name="Other" component={OtherTab} />
    </Navigator>
  );
}