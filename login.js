import React, {Component, createContext, useState} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../../database/firebase'
import {getFontSize} from './responsive'
import {checkFlex} from './responsive';
export default class Login extends Component{
    
    constructor(){
        super();
        this.EmailInput = React.createRef();
        this.PasswordInput = React.createRef();
        
        this.state = {
            email: "",
            password:"",
            isLoading: false,
            isSigned: null
        }
    }
    componentDidMount(){
        this.isUsersignedIn()
    }
    isUsersignedIn(){
        firebase.auth().onAuthStateChanged(user =>{
            if(user){
                this.props.navigation.navigate("Dashboard")
                this.setState({isSigned: true})
                
            }
            else{
                this.setState({isSigned: false})
               
            }
        })   
    }
    updateInputVal(val, prop){
        const state = this.state
        state[prop] = val
        // updates state
        this.setState(state)
    }
   
    userLogin =() => {
        console.log(this.state.email)
        if(this.state.email === "" || this.state.password === ""){
            console.log('Hi')
            Alert.alert(
                  'Alert Title',
                  'This is an alert message!',
                  [
                    {
                      text: 'OK',
                      onPress: () => console.log('OK Pressed'),
                    },
                  ],
                  { cancelable: false }
            );
            
        }
        if(firebase.auth().currentUser !== null){
            navigation.navigate('Dashboard')
            this.setState({
                isLoading:false,
                email: "",
                password: ""
            })
        }
        else{
            this.setState({
                isLoading:true
            })
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
                this.EmailInput.current.clear();
                this.PasswordInput.current.clear();

                this.setState({
                    isLoading:false,
                    email: "",
                    password: ""
                })
                this.props.navigation.navigate('Dashboard')
            })
            .catch(error => this.setState({errorMessage: error.message}))

        }

    }
    render(){
        const {isSigned} = this.state;
        if(isSigned === false){
            return(
                <View style = {styles.container}>
                    <Text style = {styles.Header} adjustsFontSizeToFit>Welcome!</Text>
    
                    <View style = {styles.inputView}>
                        <TextInput  ref = {this.EmailInput} style = {styles.TextInput} placeholder='Email/Username' placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'email')}/>
                    </View>
                    <View style = {styles.inputView}>
                        <TextInput ref = {this.PasswordInput} style = {styles.TextInput} placeholder='Password' placeholderTextColor={"#003f5c"} secureTextEntry= {true} onChangeText={(val) => this.updateInputVal(val, 'password')}/>
                    </View>
                    <View style = {styles.sameLine}>
                            <Text style = {styles.forgot_btn} numberOfLines={2} adjustsFontSizeToFit = {true}>Forgot password?</Text>
                            <Text style = {styles.forgot_btn} numberOfLines={2} adjustsFontSizeToFit = {true} onPress={() => this.props.navigation.navigate("Register")}>Dont have an account? Register Now</Text>
                    </View>
                   
                    <TouchableOpacity style = {styles.login_btn} onPress = {() => this.userLogin()}>
                        <Text style = {styles.loginTxt} >Login</Text>
                    </TouchableOpacity>
                 
                 
                </View>
            )

        }
        if(isSigned === null){
            return(
                <View style = {styles.preloader}>
                    <ActivityIndicator size = 'large' color = "#9E9E9E"></ActivityIndicator>
                </View>
            )
            
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
        // outlineStyle: 'none',
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
        width: "70%",
        height: 40,
        borderRadius:25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#007D96"
    }
  });