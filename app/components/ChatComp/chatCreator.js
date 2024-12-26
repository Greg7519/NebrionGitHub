import React, {Component,createRef, createContext, useState} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import firebase from '../../../database/firebase'
import {getFontSize} from '../responsive'
import {checkFlex} from '../responsive';
import { CheckBox } from  '@rneui/themed'
import Chat from  './chatInner'

// Issues to be corrected (better search function or at least unique usernames)
export default class ChatCreator extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            search: "",
            usernameData: null,
            userFetched: null,
            isLoading: null,
            userSearchedID: null,
            messageSent: null,
            userBool: false,
            check1: false,
            chatID: "",
            setChatName: true,
            setChatNameInp: false,
            placeholderText: "Search by username",
            chatNameUI: ''
        }
        this.user = firebase.auth().currentUser
        this.userCollections = firebase.firestore().collection("users")
        this.mainCollections = firebase.firestore().collection("messages")
        this.uid = this.user.uid
        this.userUIDS = []
        this.usernameNames = []
        this.inputRef = createRef()
        this.myHandler = this.myHandler.bind(this)
        this.createChat  = this.createChat.bind(this)
        this.checkIfChatExists = this.checkIfChatExists.bind(this)
        this.clearData = this.clearData.bind(this)
        this.setChatName = this.setChatName.bind(this)
        // this.updateInputVal2 = this.updateInputVal2.bind(this)
       
    }
    
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
        await myDoc.where('DisplayName', "==", search).get().then((querySnapshot) => {
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
                    this.setState({userBool: false})
                    this.setState({usernameData: ""})
                    console.log(usernameData)

                }
                
    
            }
            else{
                this.setState({userBool: false})
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
    handleInputChangeChatName = (text) =>{
        this.setState({chatNameUI: text});
    }
    myHandler = () => {
        this.getUserData(this.state.search)
    }
    async checkIfChatExists(newId){
        var tempVar;
        const myColl = await firebase.firestore().collection("users").doc(this.user.uid).get()
        const mySubCol = await myColl.ref.collection("myChats").get()
        console.log(myColl, mySubCol)
        // do without then!
        mySubCol.docs.map(
            doc => {
                const chatID =   doc.data().chatID
                if(chatID == newId){
                    return true
                }
                else{
                    return false
                }  
        })
    }
    clearData(){
        this.userUIDS.push(this.state.userSearchedID)
        this.usernameNames.push(this.state.usernameData)
        
        this.setState({check1: false})
        this.textInput.clear()
        this.setState({usernameData: ""})

    }
    setChatName(){
        
        this.setState({setChatNameInp: true})
        this.setState({setChatName: false})
       
        

    }

    
    async createChat(){
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
        var chatID = "";
        var userNames = ""
        var userUIDinStr = ''
        const loopControl = this.userUIDS.length
        // if(this.userUIDS.length != 2){

        // }
        for(let i =0; i< loopControl; i++){
            console.log(i === 0)
            if(i === 0){
                console.log('added')
                this.userUIDS.push(this.user.uid)
                userNames += this.user.displayName
                chatID += this.user.uid.substring(0,5)
                userUIDinStr += this.user.uid.substring(0,3)
              
                
                
            }
            
            const myString = this.userUIDS[i]
            console.log(chatID, myString)
            if(!chatID.includes(myString.substring(0,5))){
                chatID += myString.substring(0,5)
                userNames += "|" + this.usernameNames[i]
                userUIDinStr += "|" + myString.substring(0,5)
            }
            else{
                Alert.alert("User already added.")
            }
           
           
        }
       
        chatID= chatID.toLowerCase()
        
        const chatIDcheck =  await this.checkIfChatExists(chatID)
        console.log(chatIDcheck)
        
            
                this.mainCollections.doc(chatID).set(({
                    chatID: chatID,
                    users: userNames,
                    userUIDS: userUIDinStr,
                    chatName: this.state.chatNameUI

                    
                }))
                for(let i = 0; i < this.userUIDS.length; i++){
                    this.userCollections.doc(this.userUIDS[i]).collection("myChats").doc(chatID).set(({
                        chatID: chatID,
                        Usernames: userNames,
                        UIDS:userUIDinStr,
                        chatName: this.state.chatNameUI

                    
                    })).then(() => {
                        
                      
                        this.clearData()
                        const chatID1 = chatID;
                        if(chatID != undefined){
                            this.props.navigation.navigate("Chat", {chatID: chatID1,chatName: this.state.chatNameUI, userDispNameArr:userNames, uidsArr: this.userUIDS });
                        }
                      
                        
                        
                        
                    })
                }
                console.log(this.state.chatNameUI)
            
    
            
            // else{
            //     this.clearData()
            //     this.props.navigation.navigate('Chat', {chatID: createChatName});
            // }
       
        // this.mainCollections.doc(chatID).set(({
        //     chatID: chatID,
        //     timeStamp: timeStamp,
        //     otherUID: this.state.userReceipt,
        //     otherUsername: otherUsername
        // }))
        // if(this.state.userSearchedID != this.user.uid){
        //     this.props.navigation.navigate('Chat', {userReceipt: this.state.userSearchedID, userDispName: this.state.usernameData,  chatID: chatID})

        // }
       
        // this.setState({messageSent: true})

    }

    render(){
        
        const {search} = this.state
        const {usernameData} = this.state
        const {messageSent} = this.state
        const {userBool} = this.state
        const {setChatName} = this.state
        const {setChatNameInp} = this.state
        const {placeholderText} = this.state

        console.log(this.state.chatNameUI)
        return(
            // logic in parent view
                <ScrollView  contentContainerStyle = {{flex: 1}}>
                   
                    {/* on blur: when loses focus! */}
                        {/* conditionally renders if username data not 0 */}
                    
                        <View>
                            <View style = {styles.inputView}>
                            {setChatNameInp?

                                <TextInput ref = {input => {this.textInput = input}} style = {styles.TextInput} placeholder="Enter chat name:" placeholderTextColor={"#003f5c"} onChangeText = {this.handleInputChangeChatName} onBlur={this.myHandler}/> 

                            :
                                <TextInput ref = {input => {this.textInput = input}} style = {styles.TextInput} placeholder="Search by username" placeholderTextColor={"#003f5c"} onChangeText = {this.handleInputChange} onBlur={this.myHandler}/> 
                            
                            }
                           
                        </View>
                            {(usernameData  && !setChatNameInp)&&(
                            <View style= {styles.userAligner}>
                            <Text >{usernameData}</Text>
                            {userBool && (
                                <CheckBox right checkedColor='green' title='Add user to chat' checked = {this.state.check1} onPress={() => this.setState({check1: !this.state.check1})}></CheckBox>

                            )}
                            
                            
                        </View>
    
                    )}
                        {userBool && (
                        <View style = {styles.BottomAlign}>
                           
                        
                                {setChatName?
                                    <View style = {styles.userAligner}>
                                        <TouchableOpacity style= {styles.addUserBtn}  onPress={this.clearData} ><Text>Add another user</Text></TouchableOpacity>
                              
                                        <TouchableOpacity style= {styles.CreateChatBtn} onPress={this.setChatName}><Text>Set chat name</Text></TouchableOpacity>

                                    </View>
                                    
                                    
                                :
                                    <View>
                                       
                                        <TouchableOpacity style= {styles.CreateChatBtn} onPress={this.createChat}><Text>Create Chat</Text></TouchableOpacity>
                                

                                    </View>
                                   
                                }
                               

                            
                                

                            
                            
                        </View>
                                
                    )}

                        </View>
                        
                    
                        


                    
                   

                   
                
                    
                   
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
    addUserBtn:{
        backgroundColor: "#D3D3D3",
        padding: 10


    },
    userAligner:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        paddingHorizontal: 20
    },


    CreateChatBtn:{
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
        paddingHorizontal: '10%'
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
    HorizontalAlign:{
        
        width: '100%',
        flexDirection: 'row',
        

    },
    BottomAlign:{
        
        height: '100%',
        flex:1,
        margin: '20%',
        justifyContent:'flex-end'

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