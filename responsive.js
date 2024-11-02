import { Dimensions } from "react-native";
import { PixelRatio } from 'react-native';
const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size/ fontScale
const width = Dimensions.get('window').width;
function checkFlex(prop1, prop2, maxima){
    
    if(width <= maxima){
        return prop2
    }
    else{
        return prop1
        
    }

}
function ScreenRestrictions(maxWidth, maxHeight){
    

}
export {getFontSize, checkFlex}
