import React, {Component,createRef, createContext, useState} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../../database/firebase'
import {getFontSize} from './responsive'
import {checkFlex} from './responsive';
import Chat from './ChatComp/chatInner'

// Issues to be corrected (better search function or at least unique usernames)
export default class Search extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            search: "",
            usernameData: null,
            userFetched: null,
            isLoading: null,
            userSearchedID: null,
            messageSent: null,
            userBool: false
        }
        this.user = firebase.auth().currentUser
        this.inputRef = createRef()
        this.uidsArr = []
        this.usernameDispnamesArr =[]
        this.myHandler = this.myHandler.bind(this)
        this.sendMessage  = this.sendMessage.bind(this)
        this.checkIfChatExists = this.checkIfChatExists.bind(this)
        // this.updateInputVal2 = this.updateInputVal2.bind(this)
       
    }
    componentDidMount(){
        
    }
    // componentWillUnmount(){
    //     this.uidsArr = [];
    //     this.usernameDispnamesArr = [];


    // }
    
    updateInputVal(val, prop){
        const state = this.state
        state[prop] = val
        // updates state
        this.setState(state)
    }
    
    // check if chat is in chatInner
    async getUserData(val){
        const myDoc = firebase.firestore().collection("users")
        const search = val.trim()
        const {usernameData} = this.state
        await myDoc.where('DisplayName', ">=", search).where("DisplayName" , "<=", search).get().then((querySnapshot) => {
            if(!querySnapshot.empty){
                const snapshotID = querySnapshot.docs[0].id;
                const userDispName = querySnapshot.docs[0].data().DisplayName
                this.setState({usernameData: userDispName })
                this.setState({userFetched: true});
                this.setState({userSearchedID: snapshotID})
                this.setState({userBool: true})
            
                
            }
            else if(val ===  ""){

                if(usernameData !== ""){
                    this.setState({usernameData: ""})
                    console.log(usernameData)

                }
                
    
            }
            else{
                this.setState({usernameData: "No user found! Check your spelling!"})
                this.setState({userFetched: true});
               

            }

        })
        
        
        

        
        // catch{
        //     return(
        //         <View>
        //             <Text>No user with that username!Check your spelling!</Text>
        //         </View>
        //     )

        // }
       
    }
    handleInputChange = (text) =>{
        this.setState({search: text});
        
    }
   
    myHandler = () => {
        this.getUserData(this.state.search)
    }
    async checkIfChatExists(newId){
        var tempVar;
        
        const myColl = await firebase.firestore().collection("users").doc(this.user.uid).get()
        const mySubCol = await myColl.ref.collection("myChats").get()
        // do without then!
        mySubCol.docs.map(
            
            doc => {
                console.log(1)
                const chatID =   doc.data().chatID
                if(chatID == newId){
                    tempVar = chatID
                    return true
                    
                    
                }
                else{
                    tempVar = newId
                    console.log(2)
                    return false
                    
                    
                }  
        })
            

        
        
        
        
    }
    
    async sendMessage(){
        // const chatCollections = firebase.firestore().collection("messages")
        
    
        // await chatCollections.doc(this.user.uid).set({
        //     userID: this.user.uid ,
        //     sender: this.user.uid,
        //     receiver: this.state.userSearchedID,
            
        
        // }, {merge: true})
        // await chatCollections.doc(this.state.userSearchedID).set({
        //     userID: this.state.userSearchedID,
        //     sender: this.user.uid,
        //     receiver: this.state.userSearchedID
        // }, {merge: true})
        
        const chatCollections = [this.user.uid, this.state.userSearchedID].sort()
        const chatCollectionsID = chatCollections.join("").toLowerCase()
        this.uidsArr.push(this.user.uid, this.state.userSearchedID)
        this.usernameDispnamesArr.push(this.user.displayName, this.state.usernameData)
        console.log(this.uidsArr)
        console.log(chatCollectionsID)
        if(this.state.userSearchedID != this.user.uid){
            this.props.navigation.navigate('Chat', {uidsArr: this.uidsArr, userDispNameArr: this.usernameDispnamesArr,chatID: chatCollectionsID, chatName: this.state.usernameData})

        }
       
        this.setState({messageSent: true})
        this.uidsArr = [];
        this.state.userSearchedID = ""
        this.usernameDispnamesArr = [];

    }

    render(){
        
        const {search} = this.state
        const {usernameData} = this.state
        const {messageSent} = this.state
        const {userBool} = this.state
        return(
                <ScrollView>
                    <View style = {styles.inputView}>
                        <TextInput style = {styles.TextInput} placeholder='Search by username' placeholderTextColor={"#003f5c"} onChangeText = {this.handleInputChange} onBlur={this.myHandler}/>
                    </View>
                    {/* on blur: when loses focus! */}
                    {/* conditionally renders if username data not 0 */}
                    {usernameData && (
                         <View style= {styles.userAligner}>
                            <Text style = {styles.leftAlign}>{usernameData}</Text>
                            {userBool && (
                                <TouchableOpacity style= {styles.messageBtn} onPress={this.sendMessage}><Text>Message</Text></TouchableOpacity>
                            )}
                           
                        </View>
    
                    )}
                   
                
                    
                   
                </ScrollView>
                
                
               
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
      margin: 0,
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
    messageBtn:{
        backgroundColor: "#D3D3D3",
        padding: 10

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
        width: "100%",
        height: 45,
        margin:0,
        marginBottom: 40,
        
        alignItems: "center",
        justifyContent: 'center'

    },
    userAligner:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        paddingHorizontal: 20
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
        width: "30%",
        height: 40,
        borderRadius:25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#007D96"
    }
  });