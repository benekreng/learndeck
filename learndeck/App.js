import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, ImageBackground, ImageUri, Image, SafeAreaView, TextInput, Alert} from 'react-native';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React, { useContext } from 'react';
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
import StatisticsScreen from './components/statisticsScreen'
import SettingsScreen from './components/settingsScreen'
import CommunityDecks from './components/communityDecks'

import { ThemeContext, useTheme } from './styles/theme';

const Stack = createNativeStackNavigator();

const STORAGE_KEY = 'appWasLaunchedOnce';

export default function App() {
  const themeContext = useTheme();
  const { theme, updateTheme } = useContext(ThemeContext);
  const [firstLaunch, setFirstLaunch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    //load the default decks from the hardcoded json object into the async storage if the app launched for the first time
    (async () => { 
      try {
        const DefaultCardDecksCollection = require('./assets/data/default_card_decks.json')
        const keys = await AsyncStorage.getAllKeys();
        const storedData = await AsyncStorage.getItem("appWasLaunchedOnce");
        console.log("All the keys that where in async storage: ", keys);
        if(storedData == null){
          try{
            //signify that app has been loaded once
            await AsyncStorage.setItem("appWasLaunchedOnce", "this key signified that the app has been already launched once");
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

            //saving the default settings file
            const DefaultSettingsJson = require('./assets/data/default_settings.json');
            await AsyncStorage.setItem('userSettings', JSON.stringify(DefaultSettingsJson));
            console.log('App was launched the first time')
          }catch(err){
            console.log('Failed to set up default async storage environment. Clearing async storage.', error);
            await AsyncStorage.clear();
          }
        }else{
          console.log('App was already launched once')
        }
      }catch(err) {
        console.log('Failed to set up default async storage environment', err);
      }
      setIsLoading(false)
    })();
  }, []);

  return (
    isLoading ? (<></>) : 
    (
    <ThemeContext.Provider value={themeContext}>
    <NavigationContainer style={{}}>
      <Stack.Navigator screenOptions={{}} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={({ navigation, route }) => ({
          headerStyle: { backgroundColor: theme.primary }
        })} />
        <Stack.Screen name="Community Decks" component={CommunityDecks} options={({ navigation, route }) => ({
          headerStyle: { backgroundColor: theme.primary }
        })} />
        <Stack.Screen 
          name="StatisticsScreen" 
          component={StatisticsScreen} 
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: theme.primary },
            title: 'Statistics',
          })}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{headerStyle: {backgroundColor: theme.primary}, title: 'Settings'}} />
        <Stack.Screen name="Card Decks" component={CardDecks} options={{headerStyle: {
            backgroundColor: theme.primary,
          },}}/>
        <Stack.Screen name="Edit Deck" component={EditScreen} options={
          ({ route }) => ({ 
              title: 'Edit Deck', 
              headerStyle: {
              backgroundColor: theme.primary,
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
              backgroundColor: theme.primary
            }
          })
        }/>
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeContext.Provider>
    )
  )
}
