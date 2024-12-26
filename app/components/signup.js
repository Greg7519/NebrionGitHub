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
            isLoading: false,
            errorMessageGen: "",
            invalidEmail: false,
            invalidUsername: false,
            invalidUsernameTxt: "",
            invalidEmailTxt: "",
            invalidPwd: false,
            invalidPwdTxt: "",
            invalidPwdSmall: false,
            emptyData: false,
            emptyUsername: false,
            errorFound: false
        }
        this.checkIfEmailAddrValid  = this.checkIfEmailAddrValid.bind(this)
       
    }
    componentDidMount(){
        this.isUsersignedIn()
    }
    checkIfEmailAddrValid(emailAddr){

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(emailAddr.match(validRegex)){
            console.log("true")
            return true;
        }
        else{
            console.log("false")
            return false;
        }
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
    handleInputChange = (text) =>{
        this.setState({email: text});
    }
    registerUser = () =>{
        var errorFnd = this.state.errorFound
        // because state async use vars to update immediately
        var invalidPwd, invalidPwdSmall, invalidEmail, invalidUsername, emptyData;
            if(!this.checkIfEmailAddrValid(this.state.email)){
                //necesseary for updating
                this.setState({invalidEmail: true});
                invalidEmail = true;
                this.setState({email:""})
                this.setState({invalidEmailTxt: "invalid email address"})
               
            }
            else{
                this.setState({invalidEmail: false})
                invalidEmail = false;
            }
            if(this.state.displayName.length == 0){
                this.setState({emptyUsername: true});
                this.setState({displayName: ""})
                this.setState({invalidUsernameTxt: "Empty username"})
                errorFnd = true
            }
            
            if(this.state.displayName.includes("|")){
                console.log("| found")
                this.setState({invalidUsername: true});
                this.setState({displayName: ""})
                this.setState({invalidUsernameTxt: "| not allowed"})
                errorFnd = true
                invalidUsername = true;
            }
            else{
                this.setState({invalidUsername: false});
                invalidUsername = false;
            }
            if(this.state.password != this.state.confirmPwd){
                this.setState({invalidPwdTxt: "Passwords must match!"})
                this.setState({invalidPwd: true})
                this.setState({password: ""})
                this.setState({confirmPwd: ""})
                this.setState({errorFound:true})
                console.log(this.state.errorFound)
                invalidPwd = true
            }
            else{
                this.setState({invalidPwd: false});
                invalidPwd = false
            }
            if(this.state.password.length < 6){
                console.log("small password")
                this.setState({invalidPwdTxt: "Password length must be greater than 5!"})
                this.setState({invalidPwdSmall: true})
                this.setState({password: ""})
                this.setState({confirmPwd: ""})
                invalidPwdSmall = true
              
            }
            else{
                this.setState({invalidPwdSmall: false});
                invalidPwdSmall = false;
            }
            console.log(this.state.invalidEmail, this.state.invalidUsername, this.state.invalidPwd, this.state.invalidUsername)
            if(invalidEmail == false && invalidPwd == false && invalidPwdSmall == false && invalidUsername == false){
                
                console.log(this.state.displayName, this.state.password, this.state.confirmPwd, this.state.email)
                
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
                    console.log("registered!")
                    this.props.navigation.navigate("Dashboard")
                })
                .catch(error => {
                    this.setState({loaded: true})
                    if(error.code == "auth/email-already-in-use"){
                       
                        this.setState({invalidEmail: true});
                        invalidEmail = true;
                        this.setState({email:""})
                        this.setState({invalidEmailTxt: "email already in use!"})
                    }
                })

            }

        
        
      
       
            
            
        
    }

    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [confirmPwd, setconfirmPwd] = useState('')
    // const [isActive, setColor] = useState("")
    render(){
        const {invalidEmail} = this.state;
        const {invalidUsername} = this.state;
        const {invalidUsernameTxt} = this.state;
        const {invalidPwd} = this.state;
        const {invalidPwdSmall} = this.state;
        const {invalidPwdTxt} = this.state;
        const {emptyData} = this.state;
        const {emptyUsername} = this.state;
        console.log(invalidPwd)
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
                    <Text style = {styles.Header} adjustsFontSizeToFit>Welcome!</Text>
                </View>
                {invalidEmail ?
                    <View style = {styles.inputView}>
                        <TextInput style = {styles.ErrTextInput} placeholder={this.state.invalidEmailTxt} placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'email')} value={this.state.email} />
                    </View>
                    :
                    <View style = {styles.inputView}>
                        <TextInput style = {styles.TextInput} placeholder='Email' placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'email')}/>
                    </View>

                }
                {invalidUsername || emptyUsername?
                    <View style = {styles.inputView}>
                        <TextInput style = {styles.ErrTextInput} placeholder={invalidUsernameTxt}placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'displayName')} value={this.state.displayName}/>
                    </View>
                    :
                    <View style = {styles.inputView}>
                        <TextInput style = {styles.TextInput} placeholder='Username' placeholderTextColor={"#003f5c"} onChangeText={(val) => this.updateInputVal(val, 'displayName')}/>
                    </View>

                }
                {/* Add (): () and <></> to fix parent missing */}
                {invalidPwd || invalidPwdSmall || emptyData ? (
                    <>
                        <View style = {styles.inputView}>
                            <TextInput style = {styles.ErrTextInput} placeholder= {invalidPwdTxt} placeholderTextColor={"#003f5c"} secureTextEntry= {true}  onChangeText={(val) => this.updateInputVal(val, 'password')} value ={this.state.password}/>
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput style = {styles.ErrTextInput}placeholder= {invalidPwdTxt} placeholderTextColor={"#003f5c"} secureTextEntry= {true}  onChangeText={(val) => this.updateInputVal(val, 'confirmPwd')} value ={this.state.confirmPwd}/>
                        </View>
                    </>
                   
                    
                    ):(
                    <> 
                        <View style = {styles.inputView}>
                            <TextInput style = {styles.TextInput} placeholder='Enter Password' placeholderTextColor={"#003f5c"} secureTextEntry= {true}  onChangeText={(val) => this.updateInputVal(val,'password')}/>
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput style = {styles.TextInput} placeholder='Confirm Password' placeholderTextColor={"#003f5c"} secureTextEntry= {true}  onChangeText={(val) => this.updateInputVal(val, 'confirmPwd')}/>
                        </View>
                    </>
                   
              
                    
                    
                
                )}
               
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
        paddingHorizontal:20,
      
      
        
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