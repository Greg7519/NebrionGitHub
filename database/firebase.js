import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import { getApp } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import {connectFirestoreEmulator, getFirestore, initializeFirestore} from "firebase/firestore"
import {getReactNativePersistence} from 'firebase/auth'
import {connectAuthEmulator, createUserWithEmailAndPassword, initializeAuth, signInWithEmailAndPassword} from "firebase/auth"
import { getActionFromState } from '@react-navigation/native';
import 'firebase/compat/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
// links firebase and react native
const firebaseConfig = {
    apiKey: "AIzaSyDxDFvqLmxefNH4FuhmoeQ3mUQI61upjkU",
    authDomain: "registerapp-2573e.firebaseapp.com",
    projectId: "registerapp-2573e",
    storageBucket: "registerapp-2573e.appspot.com",
    messagingSenderId: "682165541944",
    appId: "1:682165541944:web:3c63489f0c65873882dacd"
}
const app = firebase.initializeApp(firebaseConfig);
// const functions = getFunctions(getApp())
// connectFunctionsEmulator(functions, 'http://127.0.0.1:5001')
// const auth = firebase.auth()
// const db = firebase.firestore()
// connectAuthEmulator(auth , 'http://127.0.0.1:9099')
// connectFirestoreEmulator(db, 'http://127.0.0.1:8080')

export default firebase;

