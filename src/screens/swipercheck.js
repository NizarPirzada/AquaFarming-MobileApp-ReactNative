import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Intro_first_Screen from '../screens/intro_step_1';
import Intro_second_Screen from '../screens/intro_step_2';
import Intro_third_Screen from '../screens/intro_step_3';
import Intro_fourth_Screen from '../screens/intro_step_4';

export default SwiperCheck = (props) => {



    return (
        <Swiper loop = {false} showsPagination = {false}>
            <Intro_first_Screen {...props} />
            <Intro_second_Screen {...props} />
        </Swiper>
    )

}