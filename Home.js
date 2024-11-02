import React, {Component, createContext, useState} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../../database/firebase'
import {getFontSize} from './responsive'
import {checkFlex} from './responsive';
import  {Ionicons} from '@expo/vector-icons'
export default class Home extends Component{
    
    constructor(){
        super();
        this.userCollections = firebase.firestore().collection("users")
        this.user = firebase.auth().currentUser;
    }
    logOut(){
        const updateStatus = this.userCollections.doc(this.user.uid)
        updateStatus.set({
            isActive: false
        }, {merge: true}).then(() => {
            firebase.auth().signOut().then(() =>{
                this.props.navigation.navigate('Login')
     
                 
                 
                 
     
            })

        })
      
        
    }
    render(){
        return(
            <View style= {{flex:1}}>
                 <View style = {styles.topCont}>
                    <Text>ChatApp</Text>
                    <Ionicons name = "chatbubbles-outline" size={20} color='black' onPress={() => this.props.navigation.navigate("ChatOutter")}/>
                </View>
                <View style = {styles.container}>
                    <Text style = {styles.Header} adjustsFontSizeToFit>Welcome {firebase.auth().currentUser.displayName}!</Text>
                    <TouchableOpacity style = {styles.login_btn} onPress = {() => this.logOut()}>
                        <Text style = {styles.loginTxt} >Log out!</Text>
                    </TouchableOpacity>
                </View>
            </View>
           
           
        )

    }
    

}
const styles = StyleSheet.create({

    preloader:{
        left:0,
        bottom:0,
        top:0,
        right:0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff"
    },
    topCont:{
        width: "100%",
        height:"8%",
     
        alignItems: "center", 
        justifyContent: 'space-between',
        padding: 10,
        textAlign:'center',
        flexDirection: 'row'
    },
    container:{
      flex:1,
      width:"100%",
      height: "100%",
      backgroundColor: "#fff",
      alignItems: "center", 
      justifyContent: "center",
      flexDirection: 'column'
    },
    Header:{
        width: '100%',
        marginBottom: '5%',
        textAlign: 'center',
        fontSize: getFontSize(70),
        fontWeight: 'bold',
        

    },
    spacerV10:{
        margin: 10

    },
    sameLine:{
        justifyContent: 'center',
        width: "70%",
        height: '10%',
        textAlign: 'center',
        flexDirection: checkFlex('row', 'column', 1041),
        marginVertical: '1%'
    },
    image:{
      marginBottom:40
    },
    inputView:{
        // borderRadius: 30,  
        backgroundColor: "#D3D3D3",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 40,
        alignItems: "center",
        justifyContent: 'center'

    },
    centerAlign:{
        alignSelf: 'flex-end'
    },
    TextInput:{
        outlineStyle: 'none',
        width: "100%",
        height: 50,
        flex:1,
        padding:10,
        marginLeft:20
    },
    forgot_btn:{
        
        width: '100%',
        fontSize: getFontSize(16)
    },
    
    loginTxt:{
        margin: 10,
        width: '100%',
        height: '50%',
        textAlign:'center',
        color: "white",
        flexShrink: 1,

    },
    login_btn:{
        marginTop: 40,
        width: "30%",
        height: 40,
        borderRadius:25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#007D96"
    }
  });