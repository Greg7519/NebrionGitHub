import React, {Component, createContext, useState, useRef} from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import firebase from '../../../database/firebase'
import {getFontSize} from '../responsive'
import {checkFlex} from '../responsive';
import { useRoute } from '@react-navigation/native';
import { color } from 'react-native-reanimated';
import  {Ionicons} from '@expo/vector-icons'
export default class Chat extends Component{
    
    constructor(){
        super();
      
        this.user = firebase.auth().currentUser;
        this.lastData;
        this.usersCollections = firebase.firestore().collection("users")
        this.mainCollection =  firebase.firestore().collection("messages")
        this.state = {
            message: "",
            userUIDS: null,
            userNames: null,
            chatID: "",
            messagesData: [],
            loaded: null,
            hasRead: "",
            chatName: "",
            OtherUIDS: [],
            UIDSLen: null,
            chatName: ""
        }
        this.OtherUsernames = []
        this.height = Dimensions.get('window').height;
        this.sendMsg = this.sendMsg.bind(this)
        this.checkifChatexists = this.checkifChatexists.bind(this)
        this.arrayToStr = this.arrayToStr.bind(this)
        this.RemoveFromArr = this.RemoveFromArr.bind(this)
        this.scrollToEnd = this.scrollToEnd.bind(this)
        this.retreiveMessages = this.retreiveMessages.bind(this)
        this.Scrollview = React.createRef();
        
    }
    async componentDidMount(){
       
        // this.setState({userNames: null, userUIDS:null, chatID: ""})
        const {route} = this.props
        const {params} = route
        // const userReceipt=  params.userReceipt
        // const userDispName = params.userDispName

        this.state.chatID = params.chatID;
        this.state.userNames = params.userDispNameArr
        
        this.state.userUIDS = params.uidsArr
       
        this.state.chatName = params.chatName;
        console.log(this.state.chatName)
        
        
       
        this.state.OtherUIDS = this.state.userUIDS
        this.state.UIDSLen = this.state.userUIDS.length
        console.log(this.state.chatID)
        this.OtherUsernames = this.state.userNames
      
        await this.checkifChatexists(this.state.userUIDS, this.state.chatID)
        
        
        
        
        
       
        
        

    }
    // componentDidUpdate(prevProps, prevLoaded){
    //     if(this.state.loaded && !prevLoaded.loaded){
    //         this.scrollToEnd()
    //     }

    // }
    getAnotherUsername(){

    }
 
    
    async retreiveMessages(){
        var messagesData =[]
        const dateToday  = new Date().getDate(undefined, {
            day: "numeric"
        })
        const monthToday  =  new Date().getDate(undefined, {
            month: "numeric"
        })

        
        var yesterday =  new Date().getDate(undefined, {
            day: "numeric"
        }) - 1
        // yesterday.setDate(yesterday.getDate(undefined,{
        //     day: "numeric"

        // }) - 1)
        var isActive = await this.usersCollections.doc(this.user.uid).get()
        isActive = isActive.data().isActive
        console.log(isActive)
   
       
        function checkIfYesterday(date){
            
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() -1)
            return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()


        }
        
        const chatCollection =  this.mainCollection.doc(this.state.chatID).collection("messages")
        
        if(this.lastData != undefined){
            chatCollection.orderBy("timeStamp", "asc").startAfter(this.lastData).limit(10).onSnapshot({includeMetadataChanges: true}, async msgSnapshot =>{
                await chatCollection.orderBy("timeStamp", "desc").get().then((querySnapshot) =>{
                    const myData = querySnapshot.docs[0]
                    
                    console.log(myData)
                    if(myData === undefined){
                        this.checkifChatexists(this.state.userUIDS, this.state.userDispName)
                        this.retreiveMessages()
                        this.setState({loaded: true})
    
                    }
                    
                    
                    else{
                        this.lastData = querySnapshot.docs[10]
                        if(myData.data().senderName !== this.user.displayName){
                            if(!myData.data().hasRead){
                                if(this.state.userUIDS.length == 2){
                                    myData.ref.set({
                                        hasRead: "Seen"
                    
                                    }, {merge:true})
    
                                }
                                else{
                                    const prevSeen = myData.data().hasRead;
                                    if(prevSeen === undefined){
                                        myData.ref.update({
                                            hasRead:`Seen by ${this.user.displayName} `
                                        })
                                    }
                                    else{
                                        const updTxt= prevSeen + this.user.displayName
                                        myData.ref.update({
                                            hasRead: updTxt
                                        })
                                        
                                    }
                                    console.log(prevSeen)
                                }
                               
            
                            }
                            
            
                        }
                        if(this.state.userUIDS.length == 2){
                            var otherUsername = this.RemoveFromArr(this.OtherUsernames, this.user.displayName)
                            console.log(otherUsername)
                            otherUsername = this.arrayToStr(otherUsername)
                            this.state.chatName = otherUsername.split("|")[0]
                           
                        }
                        else{
                            //must be await asunc
                            const chatID =  this.mainCollection.doc(this.state.chatID).get().then((doc) => {
                                const chatData = doc.data()
                                this.setState({chatName: chatData.chatName})
    
                            })
                            
                            
                          
                        }
                        
                        
                        // console.log( myData.data().senderName === this.user.displayName)
                        
                        if(myData.data().hasRead != "" && myData.data().senderName == this.user.displayName){
                            this.setState({hasRead: myData.data().hasRead})
                        
        
                        }
                        else{
                            this.setState({hasRead:""})
                        }
    
                    }
                   
                    
                    
                    
                  
                    // console.log(myData)
                    // myData.update({hasRead:true})
                    // console.log(myData)
    
    
                }).then(() => {
                    
                    this.scrollToEnd()
                    this.setState({loaded: true})
    
                })
               
                // const lastMessageData = lastMessage.docs[0].data()
                // console.log(lastMessageData)
                // console.log(lastMessageData.senderName)
                
               
                msgSnapshot.docChanges().forEach(change =>{
                    
                    // if(change.type ==="added"){
                        const message = new Object()
                        const messageData=  change.doc.data()
                        const date = new Date()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        message.text = messageData.message
                        message.senderName = messageData.senderName
                        message.timeStamp = messageData.timeStamp
                        
                        if(message.timeStamp !== null){
                            const NameDate =  message.timeStamp.toDate().toLocaleString(undefined, {
                                weekday: 'short'
                            })
                            var numDate =  Number(messageData.timeStamp.toDate().toLocaleString(undefined, {
                                day: 'numeric'
                            }))
                            var monthDate = Number(messageData.timeStamp.toDate().toLocaleString(undefined, {
                                month: 'numeric'
                            }))
                            var YearDate = Number(messageData.timeStamp.toDate().toLocaleString(undefined, {
                                year: 'numeric'
                            }))
                          
                            const timeDate = messageData.timeStamp.toDate().toLocaleString(undefined, {
                                hour: 'numeric', minute: 'numeric'
                            })
                            const currDate = (numDate.toString() + "-" + monthDate.toString() + "-"+ YearDate.toString()).toString()
                            var parts = currDate.split("-")
                            // make date!
                            var  myDate = new Date(parts[2], parts[1] - 1, parts[0]);
                           
                            if((dateToday !== numDate && numDate !== yesterday) || monthDate != month || YearDate != year ){
                                message.timeStamp = NameDate + " " + numDate + " " + timeDate
        
        
                            }
                           
                            
                            else if(checkIfYesterday(myDate)){
                                
                                message.timeStamp = "Yesterday "  + timeDate
        
                            }
                            else{
                                message.timeStamp = "Today " + timeDate
                            }
                        if(change.type === "added"){
                            
    
                            
                            // const lastSender = lastMessage.docs[0].data()
                            // console.log(lastSender.senderName)
                            // if(this.user.displayName !==  lastSender){
                            //     this.state.hasRead = "Seen"
                            // }
                            // else{
                            //     this.state.hasRead = ""
                            // }
    
                        }
                           
                          
                            
    
                        
                        messagesData.unshift(message)
                        const jsonObject = messagesData.map(JSON.stringify);
                        const setData = new Set(jsonObject)
                        var newArray = Array.from(setData).map(JSON.parse);
                        messagesData = newArray
                       
                      
    
                            
                            
                        
                      
    
                        
                    
    
                    
                      
                       
                        
                        
        
                    }
    
                })
                this.setState({messagesData, loaded: true} , () => {
                    this.scrollToEnd()
                })
                
           
                
                
                
               
    
            })

        }
        else{
            console.log("loading data")
            chatCollection.orderBy("timeStamp", "asc").limitToLast(10).onSnapshot({includeMetadataChanges: true}, async msgSnapshot =>{
                
                    const myData = msgSnapshot.docs[0]
                    
                    console.log(myData)
                    if(myData === undefined){
                        this.checkifChatexists(this.state.userUIDS, this.state.userDispName)
                        this.retreiveMessages()
                        this.setState({loaded: true})
    
                    }
                    
                    
                    else{
                        this.lastData = msgSnapshot.docs[10]
                        console.log(this.lastData)
                        if(myData.data().senderName !== this.user.displayName){
                            if(!myData.data().hasRead){
                                if(this.state.userUIDS.length == 2){
                                    myData.ref.set({
                                        hasRead: "Seen"
                    
                                    }, {merge:true})
    
                                }
                                else{
                                    const prevSeen = myData.data().hasRead;
                                    if(prevSeen === undefined){
                                        myData.ref.update({
                                            hasRead:`Seen by ${this.user.displayName} `
                                        })
                                    }
                                    else{
                                        const updTxt= prevSeen + this.user.displayName
                                        myData.ref.update({
                                            hasRead: updTxt
                                        })
                                        
                                    }
                                    console.log(prevSeen)
                                }
                               
            
                            }
                            
            
                        }
                        if(this.state.userUIDS.length == 2){
                            var otherUsername = this.RemoveFromArr(this.OtherUsernames, this.user.displayName)
                            console.log(otherUsername)
                            otherUsername = this.arrayToStr(otherUsername)
                            this.state.chatName = otherUsername.split("|")[0]
                           
                        }
                        else{
                            //must be await asunc
                            const chatID =  this.mainCollection.doc(this.state.chatID).get().then((doc) => {
                                const chatData = doc.data()
                                this.setState({chatName: chatData.chatName})
    
                            })
                            
                            
                          
                        }
                        
                        
                        // console.log( myData.data().senderName === this.user.displayName)
                        
                        if(myData.data().hasRead != "" && myData.data().senderName == this.user.displayName){
                            this.setState({hasRead: myData.data().hasRead})
                        
        
                        }
                        else{
                            this.setState({hasRead:""})
                        }
    
                    }
                   
                    
                    
                    
                  
                    // console.log(myData)
                    // myData.update({hasRead:true})
                    // console.log(myData)
    
    
                
                    
                this.scrollToEnd()
                this.setState({loaded: true})
    
                
               
                // const lastMessageData = lastMessage.docs[0].data()
                // console.log(lastMessageData)
                // console.log(lastMessageData.senderName)
                
               
                msgSnapshot.docChanges().forEach(change =>{
                    
                    // if(change.type ==="added"){
                        const message = new Object()
                        const messageData=  change.doc.data()
                        const date = new Date()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        message.text = messageData.message
                        message.senderName = messageData.senderName
                        message.timeStamp = messageData.timeStamp
                        
                        if(message.timeStamp !== null){
                            const NameDate =  message.timeStamp.toDate().toLocaleString(undefined, {
                                weekday: 'short'
                            })
                            var numDate =  Number(messageData.timeStamp.toDate().toLocaleString(undefined, {
                                day: 'numeric'
                            }))
                            var monthDate = Number(messageData.timeStamp.toDate().toLocaleString(undefined, {
                                month: 'numeric'
                            }))
                            var YearDate = Number(messageData.timeStamp.toDate().toLocaleString(undefined, {
                                year: 'numeric'
                            }))
                          
                            const timeDate = messageData.timeStamp.toDate().toLocaleString(undefined, {
                                hour: 'numeric', minute: 'numeric'
                            })
                            const currDate = (numDate.toString() + "-" + monthDate.toString() + "-"+ YearDate.toString()).toString()
                            var parts = currDate.split("-")
                            // make date!
                            var  myDate = new Date(parts[2], parts[1] - 1, parts[0]);
                           
                            if((dateToday !== numDate && numDate !== yesterday) || monthDate != month || YearDate != year ){
                                message.timeStamp = NameDate + " " + numDate + " " + timeDate
        
        
                            }
                           
                            
                            else if(checkIfYesterday(myDate)){
                                
                                message.timeStamp = "Yesterday "  + timeDate
        
                            }
                            else{
                                message.timeStamp = "Today " + timeDate
                            }
                        if(change.type === "added"){
                            
    
                            
                            // const lastSender = lastMessage.docs[0].data()
                            // console.log(lastSender.senderName)
                            // if(this.user.displayName !==  lastSender){
                            //     this.state.hasRead = "Seen"
                            // }
                            // else{
                            //     this.state.hasRead = ""
                            // }
    
                        }
                           
                          
                            
    
                        
                        messagesData.push(message)
                        const jsonObject = messagesData.map(JSON.stringify);
                        const setData = new Set(jsonObject)
                        var newArray = Array.from(setData).map(JSON.parse);
                        messagesData = newArray
                       
                      
    
                            
                            
                        
                      
    
                        
                    
    
                    
                      
                       
                        
                        
        
                    }
    
                })
                this.setState({messagesData, loaded: true} , () => {
                    this.scrollToEnd()
                })
                
           
                
                
                
               
    
            })
        }
        
      
       
        
        
        

    }
    scrollToEnd(){
        
        
            
            if(this.state.loaded){
                
                this.Scrollview.current.scrollToEnd({animated: false})
                
                

            }

        
        
    }
    async createChat(uidArr, chatID){
        const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
        console.log(chatID);
        if(chatID != undefined){
            const chatCreation =uidArr.map((uid) => {
                return this.usersCollections.doc(uid).collection("myChats").doc(chatID).set({
                    chatID: chatID,
                    timeStamp: timeStamp,
                    UIDS: this.arrayToStr(this.state.userUIDS),
                    Usernames: this.arrayToStr(this.state.userNames)
            
                 })
            })
            await Promise.all(chatCreation)

        }
        
            
    
            
            
            
           
        

    }
    
    RemoveFromArr(arr,str){
        const index = arr.indexOf(str)
        if(index != -1){
            arr.splice(index, 1)
            

        }
        return arr
        
        

    }
  
    arrayToStr(arr){
        var myStr = ""
        for(let z = 0; z < arr.length; z++){
         
            if(z == arr.length - 1){
                myStr += arr[z] 
                console.log(myStr)
                return myStr
            }
            else{
                myStr += arr[z] + "|"
            }

        }
    }
    StrToArr(str, splitC){
        const newArr = str.split(splitC);
        return newArr
    }
   
    async checkifChatexists(uidArr, chatID){
        
       
      try{
        
        const ChatName = this.usersCollections.doc(this.user.uid).collection("myChats").doc(chatID)
        const myDoc = await ChatName.get()
        console.log(myDoc.exists);
            if(myDoc.exists){
                return true
            }
            else{
                await this.createChat(uidArr, chatID)
                return false
                
            }
           
           

      }
      catch{
        await this.createChat(uidArr, chatID)
        return false
      }
      finally{
        
        await this.retreiveMessages()
      }
        

        
       
               

               
                   
                    
    }


        
       
        
        
    
    async sendMsg(){
        // later will be appended to check if user added/removed
        const message = this.state.message
        this.setState({message:""})
        // const chatCollections = firebase.firestore().collection("messages")

        const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
        console.log(this.state.userUIDS)
        // as to not change original array
        var otherUIDS = this.RemoveFromArr([...this.state.OtherUIDS], this.user.uid)
        otherUIDS = this.arrayToStr(otherUIDS)
            
        const messageID = `${this.user.uid} - ${timeStamp}`
        
        await this.usersCollections.doc(this.user.uid).collection("myChats").doc(this.state.chatID).set({
            chatID: this.state.chatID,
            messageID: messageID,
            timeStamp: timeStamp
        
        }, {merge: true})
        
        if(message !== ""){
            // try{
            //     this.RemoveFromArr(this.OtherUIDS, this.user.uid)
            //     userUIDS = this.arrayToStr(this.OtherUIDS)
            //     indexControl++;

            // }
            // catch{
            //     console.log('Already removed')
            // }
               
            
        if(this.state.UIDSLen == 2){
            await this.mainCollection.doc(this.state.chatID).collection("messages").add({
                sender: this.user.uid,
                senderName: this.user.displayName,
                // otherUsernames: this.state.otherUsernames,
                
                otherUID: otherUIDS,
                message: message,
                timeStamp: timeStamp
    
            })

        }
        else{
            await this.mainCollection.doc(this.state.chatID).collection("messages").add({
                sender: this.user.uid,
                senderName: this.user.displayName,
                // otherUsernames: this.state.otherUsernames,
                
                message: message,
                timeStamp: timeStamp
    
            })

        }
            
            
            // .then(() => {
            //     this.setState({message: ""}, () => {
            //         this.scrollToEnd()

            //     })
    
            // })
            

        }
      
       


   }
    updateInputVal(val, prop){
        const state = this.state
        state[prop] = val
        // updates state
        this.setState(state)
    }
    
   
    render(){
        const {chatName} = this.state;
        const {loaded} = this.state;
        const {hasRead} = this.state; 
      
        
     
        
        if(loaded === true){
            return(
                
            <View style = {{flex:1}} >
                    <View style = {styles.userBar}>
                        <View style = {{flexDirection:'row', width: '100%'}}>
                            <View style = {{flexDirection: 'column', width: '30%',alignItems: 'flex-start',  paddingHorizontal: 5}}>
                                <Text style = {styles.userBarText}>{chatName}</Text>
                                
                            </View>

                            
                           
                           
                        </View>
                       
                        
                    </View>
                    
                   
                    <ScrollView ref= {this.Scrollview} keyboardShouldPersistTaps = 'handled' style = {{flex:1, height: '100%', width:'100%'}} contentContainerStyle = {{flexGrow: 1}}  >
                          
                           <View style = {styles.loginInfo}>
                                    <Text style={styles.Header}>{this.state.chatName}</Text>
                                    <Text style={styles.Header2}>This is the beginning of your chat with {this.state.chatName} </Text>
                                </View>
                            
                            
                                
                                    
                                    {this.state.messagesData.map((item, index) => {
                                        return(
                                            <View  key={index}>
                                                
                                                {item.senderName == this.user.displayName ?
                                                     <View style = {styles.senderCont}>
                                                        <View style = {styles.flexInside}>
                                                            <Text style = {styles.upperMsg}>You:</Text>
                                                            
                                                            
            
            
                                                        </View>
                                                        
                                                            <Text style = {styles.senderMsg}>{item.text}</Text>
                                                            <Text style = {styles.lowerMsg}>✔ {item.timeStamp}</Text>
                                                     </View>
                                                     :
                                                    <View>
                                                        <Text style = {styles.upperMsg}>{item.senderName}</Text>
                                                        <View style = {styles.receiptMsg}>
                                                        
                                                            <Text >{item.text}</Text>
                                                            
                                                    

                                                        </View>
                                                        <Text style = {styles.lowerMsg}>✔ {item.timeStamp}</Text>
                                                        


                                                    </View>
                                                

                                                }
                                            
                                                
                                            </View>

                                        )

                                        

                                    })}
                                    <View >
                                        <Text style = {{padding: 10, textAlign: 'right'}}>{hasRead}</Text>

                                    </View>
                                
                                
                                    
                                    <View style = {styles.BottomAlign}>
                                        <View style = {styles.HorizontalAlign}>
                                                <TextInput value={this.state.message} style = {styles.inputView} placeholder='Enter your message...' onChangeText={(val) => {this.updateInputVal(val, 'message')}}></TextInput>
                                                <TouchableOpacity style = {styles.sendBtn} onPress={this.sendMsg}>
                                                    <Text style = {styles.btnText} >Send message</Text>
                                                    
                                                </TouchableOpacity>
                                        </View>

                                    </View>
                           
                                
                                    
                                

                            
                            

                    </ScrollView>
                    
                    
                </View>   
                
                    
                    
                    
                    
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
    // flex not working android try flexgrow
    
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
    userBar:{
        width: "100%", 
        height: "5%", 
        padding: 5,
        marginVertical: 5
        

    },
    userBarText:{
        fontWeight: 'bold',
        fontSize: 15,
        
    },
    userBarTextBottom:{
        fontSize: 12
        
    },


    loginInfo:{
        backgroundColor: '#7393B3'

    },
    upperMsg:{
        margin: 10,
        fontSize: getFontSize(12)

    },
    lowerMsg:{
        marginHorizontal: 10,
        marginVertical: 2,
        fontSize: getFontSize(12)

    },
    flexInside:{
        
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'

    },
    container:{
      
      
    //   flexGrow:1,
      flex: 1,
      backgroundColor: "#fff",
      flexDirection: 'column',
      
      
    },
    Header:{
        width: '100%',
        marginBottom: '2%',
        textAlign: 'center',
        fontSize: getFontSize(40),
        fontWeight: 'bold',
        color: 'white'
        

    },
    Header2:{
        width: '100%',
        marginBottom: '2%',
        textAlign: 'center',
        fontSize: getFontSize(20),
        fontWeight: 'bold',
        color: 'white'
        

    },
    BottomAlign:{
        marginTop: 50,
        height: '100%',
        flex:1,
        justifyContent:'flex-end'

    },
    sendBtn:{
        margin: 0,
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#7393B3'


    },
    senderCont:{
        
        width:"100%",
        flexDirection:'column',
        justifyContent: 'flex-end',
        alignItems:'flex-end'

    },
    btnText:{
        fontSize: getFontSize(15),
        color: 'white'


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
    senderMsg:{
    
        width: "47.5%",
        margin:10,
        padding:10,
        fontSize: getFontSize(12),
        backgroundColor: "#7393B3",
        color:'white',
        justifyContent: 'flex-end',
        borderRadius: 10

    },
    receiptMsg:{
        justifyContent: 'flex-start',
        width: "47.5%",
        margin: 10,
        padding:10,
        fontSize: getFontSize(12),
        backgroundColor: "#D3D3D3",
        color:'white',
        borderRadius: 10

    },
    message:{
        width:"100%"
    },
    image:{
      marginBottom:40
    },
    inputView:{
        // borderRadius: 30,  
        backgroundColor: "#D3D3D3",
        flex:1,
        width: "100%",
        height: 45,
        paddingHorizontal: 10,
        justifyContent: 'flex-end'

    },
    centerAlign:{
        alignSelf: 'flex-end'
    },
    HorizontalAlign:{
        
        width: '100%',
        flexDirection: 'row',
        

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