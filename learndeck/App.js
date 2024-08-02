// import DefaultCardDecksCollection from './assets/data/default_card_decks.json'

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, ImageBackground, ImageUri, Image, SafeAreaView, TextInput, Alert} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React from 'react';
import Collapsible from 'react-native-collapsible';
import Markdown from 'react-native-markdown-display';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


import StudySession from './components/StudySession'
import ButtonElement from './components/buttonElement'
import styles from './styles/mainStyles'
import CardDecks from './components/cardDecks'
import HomeScreen from './components/homeScreen'
import EditScreen from './components/editScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    //load the default decks from the hardcoded json object into the async storage if the app launched for the first time
    (async () => { 
      try {
        const DefaultCardDecksCollection = require('./assets/data/default_card_decks.json')
        const keys = await AsyncStorage.getAllKeys();
        console.log("All the keys from the start> ", keys)
        if(keys.length === 0){
          for await (const [key, value] of Object.entries(DefaultCardDecksCollection)){
            console.log('first launch')
            storageId = "carddeck_" + key
            try {
              await AsyncStorage.setItem(
                storageId,
                JSON.stringify(DefaultCardDecksCollection[key])
              );
            } catch (error) {
              console.log('Failed to one key', error);
            }
          }
          console.log('App was launched the first time')
        }else{
          console.log('App was already launched once')
        }
      } catch (error) {
        console.log('Failed to get all keys', error);
      }
      setIsLoading(false)
    })();
  }, []);


  return (
    isLoading ? (<></>) : 
    (
    <NavigationContainer style={{}}>
      <Stack.Navigator screenOptions={{}} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerStyle: {backgroundColor: 'beige'}}} />
        <Stack.Screen name="Card Decks" component={CardDecks} options={{headerStyle: {
            backgroundColor: 'beige',
          },}}/>
        <Stack.Screen name="Edit Deck" component={EditScreen} options={
          ({ route }) => ({ 
              title: 'Edit Deck', 
              headerStyle: {
              backgroundColor: 'beige',
              deckName: route.params.deckName, 
              deckStorageId: route.params.deckStorageId,
              unmountOnBlur: true
            }
          })
          }/>
        <Stack.Screen name="Study Session" component={StudySession} 
        options={
          ({ route }) => ({ 
              studyMode: route.params.studyMode, 
              deck: route.params.deck, 
              storageId: route.params.storageId, 
              headerStyle: {
              backgroundColor: 'beige'
            }
          })
        }/>
      </Stack.Navigator>
    </NavigationContainer>
    )
  )
}
