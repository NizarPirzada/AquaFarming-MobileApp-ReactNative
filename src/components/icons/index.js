import React from 'react';
import { Image, View } from 'react-native'
import { useTheme } from "@ui-kitten/components"

const back_color = (color) => {
    return {
        backgroundColor: color
    }
}





export const MeasureICON = (props) => {
    
    const theme = useTheme()

    return (
        <View style={[ back_color("#ffffff"), {shadowColor:"#000",shadowOffset:{width:0,height:2},shadowOpacity:0.25,elevation: 7, paddingLeft: 5, paddingRight: 5, paddingBottom: 7, paddingTop: 7, borderRadius: 3, marginLeft: 6,marginRight:10 }]}>
            {
                <Image style={{ width: 20, height: 18, resizeMode: "stretch" }} source={
                    !props.icon ? require('../../screens/assets/temp.png') :
                        props.icon.trim() == "pos" ? require('../../screens/assets/switch.png') :
                            props.icon.trim() == "open" ? require('../../screens/assets/valve.png') :
                                props.icon.trim() == "level" || props.icon.trim() == "lflow" || props.icon.trim() == "aflow" ? require('../../screens/assets/Level.png') :
                                        props.icon.trim() == "dfish" ? require('../../screens/assets/deadfish.png') 
                                            : require('../../screens/assets/temp.png')
                }></Image>

            }

        </View>
    )
}





//icon handling watchlist:

