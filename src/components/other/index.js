import React, { useState,useEffect } from 'react'
import { Layout, Text, Card, Input, Icon } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, Image, View, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OtherCard from '../other/card'
import { flagApi } from '../../api'
import strings from '../../Localization';


// const colorChoose = (flagId) => {
//     if ((flagId == 2) || (flagId == 1)) {
//         return '#17C8EC'
//     }
//     else if ((flagId == 4) || (flagId == 5)) {
//         return '#FF5927'
//     }
//     else if (flagId == 3) {
//         return '#47CE8C'
//     }
//     else if (flagId == 6) {
//         return '#6241D9'
//     } else {
//         return '#8F9BB3'
//     }
// }



export default others = (props) => {
    let cardslist = props.newdata;

    const sortfunc = () => {
        function compare(a, b) {
            if (a.flagSequence > b.flagSequence) {
                return 1;
            }
            if (a.flagSequence < b.flagSequence) {
                return -1;
            }
            return 0;
        }
        cardslist.sort(compare);
    }
    sortfunc();

    const AllCards = (props) => {
        return cardslist.map((data, i) => {
            return (<OtherCard {...props} key={i} name={data.flagName} flagId = {data.flagId} userName = {data.userName} color={data.colorCode} count={data.monitoringSituations.length} monitoringSituations={data.monitoringSituations} />)
        })
    }

    
    return (

        <Layout style={styles.layout} level="4">
            {/* <View style={{ marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 10 }}>
                    <Input
                        value={value}
                        placeholder={strings.search}
                        accessoryRight={renderIcon}
                        onChangeText={nextValue => setValue(nextValue)}
                    />
                </View> */}
            <ScrollView>
                <AllCards {...props} />
            </ScrollView>
        </Layout>
    );
};
const styles = StyleSheet.create({
    layout: {
        flex: 1,
    },
});