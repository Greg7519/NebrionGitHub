import React, {Component, useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image,  ActivityIndicator, TouchableOpacity} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import {getFontSize} from './responsive'
import {checkFlex} from './responsive';
import firebase from  '../../database/firebase'
export default class Register extends Component{
    constructor(){
        super();
        this.myTextInput = React.createRef();
        this.state = {
            displayName: "",
            email: "",
            password: "",
            confirmPwd:'',
            isLoading: false
        }
       
    }
    componentDidMount(){
        this.isUsersignedIn()
    }
    isUsersignedIn(){
        firebase.auth().onAuthStateChanged(user =>{
            if(user){
                this.props.navigation.navigate("Dashboard")
                console.log('registered!')
                return true;
                
            }
            else{
                return false;
            }
        })
    }
    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }
    registerUser = () =>{
        
        if(this.state.email === "" || this.state.password === ""){
            Alert.alert("Enter your details!")
        }
        else if(this.state.password !== this.state.confirmPwd){
            Alert.alert('Enter your password')

        }
        else{
            this.setState({
                isLoading:true,
            })
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
                res.user.updateProfile({
                    displayName: this.state.displayName
                })
               firebase.auth().currentUser.sendEmailVerification()
               try{
                firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password )

               }
               catch{
                    console.log('Error')
               }
               
               
                
                
                this.setState({
                    isLoading: false,
                    displayName: "",
                    email: "",
                    password: "",
                    confirmPwd: ""
                })
                this.props.navigation.navigate("Dashboard")
            })
            .catch(error => this.setState({errorMessage: error.message}))
            
        }
    }

    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [confirmPwd, setconfirmPwd] = useState('')
    // const [isActive, setColor] = useState("")
    render(){
        
        if(this.state.isLoading){
            return(
                <View style = {styles.preloader}>
                    <ActivityIndicator size = 'large' color = "#9E9E9E"></ActivityIndicator>
                </View>
            )
        }
        return(
            <View style = {styles.container}>
                <View >
                    <Text style = {styles.Header}>Welcome!</Text>
                </View>
                <View style = {styles.inputView}>
                    <TextInput style = {styles.TextInput} placeholder='Email' placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'email')}/>
                </View>
                <View style = {styles.inputView}>
                    <TextInput style = {styles.TextInput} placeholder='Username' placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'displayName')}/>
                </View>
                <View style = {styles.inputView}>
                    <TextInput style = {styles.TextInput} placeholder='Password' placeholderTextColor={"#003f5c"} secureTextEntry= {true}  onChangeText={(val) => this.updateInputVal(val, 'password')}/>
                </View>
                <View style = {styles.inputView}>
                    <TextInput style = {styles.TextInput} placeholder='Confirm Password' placeholderTextColor={"#003f5c"} secureTextEntry= {true}  onChangeText={(val) => this.updateInputVal(val, 'confirmPwd')}/>
                </View>
                <Text styles = {styles.loginTxt} onPress={() => this.props.navigation.navigate('Login')}>Already Registered? Click here to login</Text>
                <TouchableOpacity style = {styles.login_btn} onPress ={() => this.registerUser()}>
                    <Text style = {styles.registerTxt} >Register</Text>
                </TouchableOpacity>
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
    container:{
      flex:1,
      width:"100%",
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center"
    },
    Header:{
        width: '100%',
        bottom: 0,
        textAlign: 'center',
        fontSize: getFontSize(70),
        fontWeight: 'bold',
        marginBottom: '10%'

    },
  
    image:{
      marginBottom:40
    },
    inputView:{
        // borderBottomColor: 'gray',
        // borderBottomWidth: 3,
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
        // outlineStyle: 'none',
        width: "100%",
        height: 50,
        flex:1,
        padding:10,
        marginLeft:20
        
    },
    forgot_btn:{
        height:30,
        flex: checkFlex('row', 'column', 1041),
        marginBottom:30
    },
    loginTxt:{
        color: "#3740FE",
        marginTop: 25,
        textAlign: 'center'

    },
    registerTxt:{
        color: "white",
        margin: 10,
        textAlign: 'center'

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