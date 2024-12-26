import React, {Component, useState} from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

import Login from './components/login'
import Register from './components/signup'
import Dashboard from './components/dashboard'
import EmailVerification from './components/EmailVerification'
import TabNavigator from './components/TabNavigator'
import Chat from './components/ChatComp/chatInner'
import ChatOutter from './components/ChatComp/chatOutter'
import ChatCreator from './components/ChatComp/chatCreator'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'


const Stack = createStackNavigator()
export default function App(){
    return(
       
     
          <Stack.Navigator initialRouteName='Login' screenOptions={{
                cardStyle:{
                    flex:1
                },
                
                headerShown: false
            }}>
            <Stack.Screen name = "TabNavigator" component={TabNavigator}  options = {{title: "Home"}}/>
            <Stack.Screen name = "Login" component = {Login} options = {{title: "Login", headerShown:false}}/>
            <Stack.Screen name = "Register" component={Register}  options = {{title: "Register", headerShown:false}}/>
            <Stack.Screen name = "Dashboard" component={Dashboard}  options = {{title: "Dashboard", headerShown:false}}/>
            <Stack.Screen name = "EmailVerification" component={EmailVerification}  options = {{title: "EmailVerification", headerShown:false}}/>

            <Stack.Screen name = "Chat" component={Chat}  options = {{title: ""}}/>
            <Stack.Screen name = "ChatOutter" component={ChatOutter}  options = {{title: ""}}/>
            <Stack.Screen name = "ChatCreator" component={ChatCreator}  options = {{title: ""}}/>
            
        </Stack.Navigator>
    );
}