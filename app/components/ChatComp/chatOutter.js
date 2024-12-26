import React, {Component, createContext, useState} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import { ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
// each .. one closer dir
import firebase from '../../../database/firebase'
import {getFontSize} from '../responsive'
import {checkFlex} from '../responsive';
import  {Ionicons} from '@expo/vector-icons'
export default class ChatOutter extends Component{
    
    constructor(props){
        super(props);
        this.user = firebase.auth().currentUser
        this.userCollections = firebase.firestore().collection("users")
        this.userChatCollection = this.userCollections.doc(this.user.uid).collection("myChats")
        this.ChatCollection = firebase.firestore().collection("messages")
        this.state = {
            chatIdsArray: [],
            chatName: "",
            timestampsArray:[],
            latestMessagesArr: [],
            otherUsernames:[],
            otherUIDS: [],
            userUIDS: [],
            userDispNameArr: [],
            chatData: [],
            senderUsernames:[],
            loaded:null,
            isActive: "",
            isOtherActive: []

        }
        this.uidsArr =[];
        this.getUserChats = this.getUserChats.bind(this) 
        this.arrayToStr = this.arrayToStr.bind(this)
        this.RemoveFromArr = this.RemoveFromArr.bind(this)
        this.StrToArr = this.StrToArr.bind(this);
    }
    componentDidMount(){
        this.getUserChats()
      
        
    }
   
   
    RemoveFromArr(arr,str){
        const index = arr.indexOf(str)
        if(index != -1){
            arr.splice(index, 1)
            

        }
        return arr
        
        

    }
    StrToArr(str, splitC){
        const newArr = str.split(splitC);
        return newArr
    }
  
    arrayToStr(arr){
        var myStr = ""
        for(let z = 0; z < arr.length; z++){
            myStr += arr[z] 
            if(z == arr.length - 1){
                console.log(myStr)
                return myStr
            }

        }
    }

    
    async getUserChats(){
       const chatIdsArray = [];
       const timestampsArray =[];
       const latestMessagesArr = [];
       const otherUsernames = [];
       const UsernamesArr = [];
       const UIDS = [];
       const otherUIDSG = [];
       var senderUsernames = [];
       var myIndex;
       const userSnapshot = await this.userChatCollection.get()
        userSnapshot.forEach((doc) =>{
            const data =  doc.data()
            var UIDSdata = data.UIDS
            UIDSdata = UIDSdata.split("|")
            // removes empty str
            UIDSdata = UIDSdata.filter(n => n)
            console.log(UIDSdata)
            UIDS.push(UIDSdata)
            chatIdsArray.push(data.chatID)
            chatIdsArray.map((e) => console.log(e))
       })
        this.setState({userUIDS: UIDS})
       

       
       
      
       var counter = 0;
       if(chatIdsArray.length !== 0){
        for(const chatID of chatIdsArray){
           
            var userUIDS = await this.userCollections.doc(this.user.uid).collection("myChats").doc(chatID).get()
                var userUIDSData = userUIDS.data()
                var userNames = userUIDSData.Usernames
                console.log(chatID, userUIDSData);
                var userUIDSIDs = userUIDSData.UIDS
                userNames = this.StrToArr(userNames, "|")
                userNames = userNames.filter(n => n);
                console.log(userNames)
                UsernamesArr.push(userNames)
                console.log(UsernamesArr)
                userUIDSIDs.split("|");
                userUIDSIDs = this.arrayToStr(userUIDS)
                this.uidsArr.push(userUIDSIDs)
                if(this.state.userUIDS[counter].length != 2){
                    this.setState({chatName: userUIDSData.chatName})


                }
              
                

            
            const latestMessageDocs= await this.ChatCollection.doc(chatID).collection("messages").orderBy("timeStamp" , "desc").limit(1).get().then()
            if(latestMessageDocs.docs[0] !== undefined){
                const myData = latestMessageDocs.docs[0].data() 
                latestMessagesArr.push(myData.message)
                let latestTimestamp = myData.timeStamp
                timestampsArray.push(latestTimestamp)
                var senderUsername =myData.senderName + ": "
                
                
                
                if(senderUsername === (this.user.displayName + ": ")){
                    senderUsername = "You: "
                    senderUsernames.push(senderUsername)
                    console.log(senderUsernames)
    
                }
                else{
    
                    senderUsernames.push(senderUsername)
    
                }
                // if(myData.otherUID === this.user.uid){
                //     otherUIDS.push(myData.sender)
                   
    
                // }
                // else{
                //     otherUIDS.push(myData.otherUID)
                // }
               
                // for(const uid of otherUIDS){
                //     this.userCollections.doc(uid).onSnapshot((snapshot) => {
    
                //         const isActive = snapshot.data().isActive
                        
                //         if(isActive === true){
                //             this.state.isOtherActive.push(true)
                //         }
                //         else{
                //             this.state.isOtherActive.push(false)
                //         }
        
    
                //     })
                   
                    
                    
                    
                // }
                
            let otherUsernameDoc =  this.userChatCollection.doc(chatID)
            otherUsernameDoc.get().then((doc) =>{
                let Usernames = doc.data().Usernames
                var otherUsername = Usernames.split("|");
                otherUsername = this.RemoveFromArr(otherUsername , this.user.displayName);
                
                otherUsername = this.arrayToStr(otherUsername)
                console.log(otherUsername)
                otherUsernames.push(otherUsername);
               
                
                

                
                // checks if everything was passed
                if(otherUsernames.length === chatIdsArray.length){
                    
                    this.state.senderUsernames = senderUsernames
                    this.state.latestMessagesArr = latestMessagesArr
                    this.state.otherUsernames = otherUsernames
                    this.state.userDispNameArr = UsernamesArr
                    console.log((this.state.userUIDS[0]))
                    this.setState({chatID})
                    this.setState({timestampsArray: timestampsArray})
                    this.setState({latestMessagesArr: latestMessagesArr})
                    this.setState({loaded: true})
                    this.setState({senderUsernames: senderUsernames})
                    this.setState({chatIdsArray})
    
                }
                counter++;
                
                
    
            })
                
            }
            else{
                
                myIndex = chatIdsArray.indexOf(chatID)
                this.userChatCollection.doc(chatID).delete()
                chatIdsArray.splice(myIndex, 1)
                this.setState({loaded:true});
                console.log(chatIdsArray)
                
            }

            

           
           
            }
            
           
        
            
            
        }
        
       else{
            this.setState({loaded:true})
    

        }
       
      
       

       

    }
    async checkIfActive(){
        for(uid in this.state.otherUIDS){
            
        }
    }
  
    updateInputVal(val, prop){
        const state = this.state
        state[prop] = val
        // updates state
        this.setState(state)
    }
    handleInputChange = (text) =>{
        this.setState({search: text});
        
    }
   
    myHandler = () => {
        this.getUserData(this.state.search)
    }
   
  
    render(){
        const {loaded} = this.state
        const {isOtherActive} = this.state
        const {userUIDS} = this.state
        const {chatName} = this.state
        console.log(chatName)
        if(loaded){
            return(
                
                       <ScrollView contentContainerStyle = {styles.container} snapToEnd ={true}>
                            {/* <View style = {styles.inputView}> */}
                              <View style = {styles.topCont}>
                                <Ionicons name = "add-circle-outline" size={20} color='black' onPress={() => this.props.navigation.navigate("ChatCreator")}/>
                                <Text style = {{marginLeft: 5}}>Create a new chat</Text>
                               
                              </View>
                               
                            {/* </View> */}
                        {/* if statement requires ? other js goes without {} */}
                        {this.state.chatIdsArray.length!= 0  ? (
                                this.state.chatIdsArray.map((chatID, index) =>(
                                <TouchableWithoutFeedback onPressIn={() => {
                                    this.props.navigation.navigate("Chat",{chatID: this.state.chatIdsArray[index], uidsArr: userUIDS[index], userDispNameArr: this.state.userDispNameArr[index]})
                                    }} key={index}>
                                 
                                   
                                          <View style = {styles.row}>
                                          {userUIDS[index].length == 2 ?(
                                          <Text style ={styles.otherUsername}>{this.state.otherUsernames[index]}</Text>
                                          ):(
                                            <Text style ={styles.otherUsername}>{chatName}</Text>
                                          )
                                          
                                          }
                                          <View style = {styles.rowCont}>
                                            {userUIDS[index].length == 2  ?(
                                                isOtherActive[index] === true ?(
                                                    <Text style={styles.latestMessage}>Active Now</Text>
                                                    )
                                                    : (
                                                    // {} only on entire content
                                                    this.state.latestMessagesArr[index] != undefined && (
                                                        <Text style={styles.latestMessage}>{this.state.senderUsernames[index]}{this.state.latestMessagesArr[index]}</Text>
                                                    
                                                    ))
                                                    
                                                

                                            ):(
                                                <Text style={styles.latestMessage}>{this.state.senderUsernames[index]}{this.state.latestMessagesArr[index]}</Text>

                                            )}
                                              
  
                                          </View>
  
                                          </View>
                                    
                                    
                                      
                                  
                                  
                                  
                                
                                </TouchableWithoutFeedback>
                              
                            ))
                        ): (
                            <View style = {styles.centerAlign}>
                                <Text style= {{fontSize:getFontSize(20)}}>No chats available</Text>
                                <TouchableOpacity><Text style={styles.navMessage} onPress={() => this.props.navigation.navigate("Search")}>Find some friends to talk with!</Text></TouchableOpacity>
                            </View>
                            
                            
        

                        )}
                        </ScrollView>
                     
                        
    
    
                
             
            )

        }
        else{
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
    row:{
        padding: 10,
        width: '100%',
        flexDirection: 'column',
        justifyContent: "space-between",
        alignContent: "center",
        color:"black"

    },
    rowCont:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between",

    },
    otherUsername:{
        fontWeight: 'bold',
        fontSize: getFontSize(16),
        margin: 3

    },
    latestMessage:{
        margin:3,
        fontSize: getFontSize(12),

    },
    navMessage:{
        margin:10,
        fontSize: getFontSize(10),

    },
    container:{
     
      width:"100%",
      height: "100%",
      backgroundColor: "#fff",
      
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
    topCont:{
        width: "100%",
        backgroundColor: "#D3D3D3",
        height:"5%",
        margin:0,
        alignItems: "center", 
        justifyContent: 'start',
        padding: 10,
        textAlign:'center',
        flexDirection: 'row'
    },
    image:{
      marginBottom:40
    },
    inputView:{
        // borderRadius: 30,  
        backgroundColor: "#D3D3D3",
        width: "100%",
        height: 45,
        paddingLeft: 5,
        alignItems: "center",
        justifyContent: 'center'

    },
    centerAlign:{
        flex:1,
        height: '100%',
        justifyContent:'center',
        alignSelf: "center"
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