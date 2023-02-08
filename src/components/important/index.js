import React, { useState, useEffect,useContext } from 'react'
import { StyleService, Layout, Text, Card, useStyleSheet, Spinner } from '@ui-kitten/components';
import { SafeAreaView, Image, View, RefreshControl } from 'react-native';
import ImpCard from '../important/card'
import { ScrollView } from 'react-native-gesture-handler';
import { flagApi } from '../../api'
import string from '../../Localization';
import {dot} from '../../dot-context';




export default actionRequired = (props) => {
    
    let { refresh } = props;
    let flagcheck = false ;
    const [dot_check ,setdot] = useContext(dot);
    let data = props.newdata;
    const styles = useStyleSheet(themedStyles);
   
    let cardslist = [];
    if (!refresh) {
        data.forEach(element => {
            if ((element.isImportant)  && element.monitoringSituations.length != 0) {
                cardslist.push(element)
            }
        });
    if(cardslist.length != 0){
        setdot(true)
    }

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
                return (<ImpCard {...props} key={i} isNot = {data.isNot} name={data.flagName} flagId = {data.flagId} color={data.colorCode} count={data.monitoringSituations.length} monitoringSituations={data.monitoringSituations} />)
            })
        }

        return (
          
                <Layout level = "4" style={styles.layout}>
                        <AllCards {...props} />
                </Layout>
         
        );
    }
    else {
        return
            <Layout level = "4" style={styles.layout}>
            </Layout>
     
    }
};
const themedStyles = StyleService.create({
    layout: {
        flex: 1,
    },
    text: {
        color: 'text-control-color'
    },
    textHint: {
        color: 'color-basic-control-transparent-600'
    },
    time: {
        textAlign: "center",
        marginTop: 15
    },
    card: {
        backgroundColor: 'color-danger-500',
        borderRadius: 10
    }

});