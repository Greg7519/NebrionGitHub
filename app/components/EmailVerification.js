import React, {Component, useState} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../../database/firebase'
import {getFontSize} from './responsive'
import {checkFlex} from './responsive';
export default class EmailVerification extends Component{
    constructor(){
        super();
    }
    sendEmail = () => {
        firebase.auth().currentUser.sendEmailVerification()

    }
    render(){
        
        this.state ={
            displayName: firebase.auth().currentUser.displayName
        }
        return(
            <View style = {styles.container}>
                <View >
                    <Text style = {styles.Header}>{this.state.displayName} you havent verified your email</Text>
                </View>
                <TouchableOpacity style = {styles.login_btn} onPress = {this.sendEmail}>
                    <Text style = {styles.loginTxt} >Send verification email</Text>
                </TouchableOpacity>
            </View>

        )
    }
    
    
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        width:"100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    Header:{
        bottom: 0,
        textAlign: 'center',
        fontSize: getFontSize(70),
        fontWeight: 'bold',
        marginBottom: 150
    },
    loginTxt:{
        margin: 10,
        color: "white"

    },
    login_btn:{
        width: "70%",
        height: 40,
        borderRadius:25,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor:"#007D96"
    }


})