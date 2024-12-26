import React, {Component, createContext, useState} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../../database/firebase'
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
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
            isSigned: null,
            errorMessage: "",
            errorMessagePwd: "",
            userNotExists: false,
            emptyData: false,
            invalidPwd: false,
            invalidPwdTxt: "",
            invalidAddress: false,

        }
        this.checkIfEmailAddrValid = this.checkIfEmailAddrValid.bind(this);
        this.loginPersistenceSave = this.loginPersistenceSave.bind(this)
        this.loadPersistenceSave =  this.loadPersistenceSave.bind(this)
    }
    async componentDidMount(){
        await this.isUsersignedIn()
    }
    async loginPersistenceSave(key, value){
        await SecureStore.setItemAsync(key, value);

    }
    async loadPersistenceSave(key){
        let res = await SecureStore.getItemAsync(key);
        if(res){
            return res;
        }
        
    }
    checkIfEmailAddrValid(emailAddr){

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(emailAddr.match(validRegex)){
           
            return true;
        }
        else{
       
            return false;
        }
    }
    async isUsersignedIn(){
        // async in arrow funcs as well
        firebase.auth().onAuthStateChanged(async user =>{
            if(user!=null){
                this.props.navigation.navigate("Dashboard")
                this.setState({isSigned: true})
            }
            
                if(Platform.OS === "android"||Platform.OS === "ios"){
                    const email = await this.loadPersistenceSave("email")
                    const Pwd = await this.loadPersistenceSave("password")
                    if(email  && Pwd) {
                        console.log(email, Pwd)
                      
                        firebase.auth().signInWithEmailAndPassword(email, Pwd).then((res) => {
                            this.props.navigation.navigate('Home')
                        }).catch(error =>{console.log(error)})
                    }
                    else{
                        this.setState({isSigned: false})
                    }
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
        
      
        if(this.state.email === "" || this.state.password === ""){
           
            this.setState({emptyData: true});
        }
        const addrCheck = this.checkIfEmailAddrValid(this.state.email)
        if(!addrCheck){
            this.setState({invalidAddress: true});  
            this.setState({email: ""})
            this.setState({errorMessage: "Invalid email!"});  
        }
        if(this.state.password.length < 6){
            this.setState({invalidPwd: true})
            this.setState({password:""})
            this.setState({invalidPwdTxt: "Invalid password!"})
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
            if(Platform.OS == "android"|| Platform.OS == "ios"){
                this.loginPersistenceSave("email", this.state.email)
                this.loginPersistenceSave("password", this.state.password)
              
            }
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
            .catch(error =>{
                if(error.code == "auth/user-not-found"){
                    this.state.userNotExists = true;
                    this.setState({email: ""}) 
                }
                if(error.code == "auth/wrong-password"){
                    
                    this.setState({invalidPwd: true})
                    this.setState({invalidPwdTxt: "Invalid password!"})
                    this.setState({password:""})
                    
                }
                
            
               
            })
            
        }

    }
    render(){
        const {isSigned} = this.state;
        const {errorMessage} = this.state;
        const {userNotExists} = this.state;
        const {emptyData} = this.state;
        const {invalidAddress} = this.state;
        const {invalidPwd} = this.state;
        const {invalidPwdTxt} = this.state;
        if(isSigned === false){
            return(
                <View style = {styles.container}>
                    
                    <Text style = {styles.Header} adjustsFontSizeToFit>Welcome!</Text>
                    
                  
                    {userNotExists || emptyData || invalidAddress?
                        <View style = {styles.inputView}>
                            <TextInput  ref = {this.EmailInput} style = {styles.ErrTextInput} placeholder={errorMessage} placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'email')} value={this.state.email}/>
                        </View>

                    :
                         <View style = {styles.inputView}>
                            <TextInput  ref = {this.EmailInput} style = {styles.TextInput} placeholder='Email' placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'email')}/>
                        </View>



                    }
                    {invalidPwd ?
                        <View style = {styles.inputView}>
                            <TextInput ref = {this.PasswordInput} style = {styles.ErrTextInput} placeholder={invalidPwdTxt} placeholderTextColor={"#003f5c"} secureTextEntry= {true} onChangeText={(val) => this.updateInputVal(val, 'password')} value={this.state.password}/>
                        </View>
                        :
                        <View style = {styles.inputView}>
                            <TextInput ref = {this.PasswordInput} style = {styles.TextInput} placeholder='Password' placeholderTextColor={"#003f5c"} secureTextEntry= {true} onChangeText={(val) => this.updateInputVal(val, 'password')}/>
                        </View>

                    }
                    
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
    ErrTextInput:{
        // outlineStyle: 'none',
        width: "100%",
        height: 50,
        flex:1,
        paddingHorizontal:20,
        borderBottomWidth: 2,
        borderBottomColor: 'red',
       
        
        
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