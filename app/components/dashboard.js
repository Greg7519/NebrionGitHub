import React, {Component, useEffect, useState} from 'react'
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, TouchableHighlightBase } from 'react-native'
import firebase, {db} from  '../../database/firebase'
import {getFontSize} from './responsive'
import EmailVerification from './EmailVerification';

export default class Dashboard extends Component{
    
    constructor(){
        super();
        this.myBool;
        this.userVer = firebase.auth().currentUser.emailVerified
        this.userCollections = firebase.firestore().collection("users")
        this.user = firebase.auth().currentUser;
        this.displayName = firebase.auth().currentUser.displayName
        // state operation necesseary to handle asychronous functions
        this.state = {
            stateUserVer: this.userVer,
            displayName: null
        }
        
       
        
        
    }
    
    signOut = () => {
        firebase.auth().signOut().then(()=> {
            this.props.navigation.navigate('Register')

        })
        
    }
    componentDidMount(){
        this.unsubscribe = firebase.auth().onIdTokenChanged(user => {
            this.setState({displayName: user.displayName})
            
        })
        const user = firebase.auth().currentUser

        if(this.state.stateUserVer){

            // const user = firebase.auth().currentUser
            const docRef = this.userCollections.doc(this.user.uid)
            docRef.set({
                isActive: true,
                DisplayName: user.displayName,
                Email: user.email
            }, {merge: true})
            this.navigateToHome()
        }
        else{
            this.interval = setInterval(() => {
                console.log("waiting")
                if(!this.state.userVer){
                    
                    firebase.auth().currentUser.reload().then(() => {
                        const isVerified =  firebase.auth().currentUser.emailVerified;
                        console.log(isVerified)
                    
                        this.setState({stateUserVer: isVerified})
                        if(isVerified){
                            
                            this.navigateToHome()
                            
                           
                            // references collection
                            const userCollections = firebase.firestore().collection("users")
                           
                            // gets document reference
                            const userDocRef = userCollections.doc(this.user.uid)
                            // checks if snapshot exists
                            console.log(user.displayName, user.email)
                            userDocRef.get().then((docSnapShot) => {
                                if(!docSnapShot.exists){
                                    userDocRef.set({
                                        DisplayName: user.displayName,
                                        Email: user.email
                                        
                                    }).then(() => {
                                        clearInterval(this.interval)
                                    })
                                    
                                }
                                else{
                                    console.log("Already in database!")
                                    clearInterval(this.interval)
                                }
                            })
                           
                            
                           
                        }
                     })
        
                    }
                        
                    
                   
    
            }, 200)

        }

        
        
        
        

    }
    navigateToHome(){
        this.props.navigation.navigate('TabNavigator');
    }
    componentWillUnmount(){
        clearInterval(this.interval)
        this.unsubscribe()
    }
    render(){ 
       
        const {stateUserVer} = this.state
        const {displayName} = this.state
        
        if(displayName === null){
            return(
                <View style = {styles.preloader}>
                    <ActivityIndicator size = 'large' color = "#9E9E9E"></ActivityIndicator>
                </View>
            )
        }
        else{
            // if(stateUserVer){
            //     this.navigateToHome()
            // }
            // else{
            if(!stateUserVer){
                return(
                    <EmailVerification/>
                )
            }
            

        }
      
        
       
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
        alignItems: "center"

    },
    centerAlign:{
        alignItems: "center"
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
        height:30,
        marginBottom:30
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
  });

