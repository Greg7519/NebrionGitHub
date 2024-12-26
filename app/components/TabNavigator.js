import React, {Component, createContext, useState} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from './Home'
import SearchScreen from './search'
import ChatScreen from './ChatComp/chatInner'
import {BottomTabBar, createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { TabBar } from 'react-native-tab-view'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
const Tab = createBottomTabNavigator()


export default function TabNavigator(){
    return(
        <Tab.Navigator  title = "ChatApp" initialRouteName='Home'  
        screenOptions={({route}) => ({
            
           
            headerShown: false,
            tabBarIcon:({focused, color, size}) => {
                let iconName;

                if (route.name === "Home"){
                    
                    iconName = focused
                    ?  'home'
                    :  'home-outline';
                }
                else if(route.name === "Search"){
                    iconName = focused
                    ? 'search'
                    : 'search-outline'
                }
                
                
            
            return <Ionicons name = {iconName} size={size} color={color}/>
        },
       
         
        })}>
            
            <Tab.Screen name='Home' component={HomeScreen}  title="ChatApp"/>
            <Tab.Screen name='Search' component={SearchScreen} options={{unmountOnBlur: true}}/>
            
            {/* <Tab.Screen name='Settings' component={SettingsScreen}/>   */}

        </Tab.Navigator>
    )
}