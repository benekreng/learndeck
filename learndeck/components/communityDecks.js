import { Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect} from 'react';
import React, { useContext }  from 'react';
import Collapsible from 'react-native-collapsible';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

const SettingsScreen = ({route}) => {
  //load from storage to memory to read and write the statistics
  const { theme, updateTheme } = useContext(ThemeContext);
  const [ apiCarddecks, setApiCarddecks] = useState([]);
  // const { deckName, deckStorageId} = route.params;
  const [settingJson, setSettingJson] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();
  const apiBaseUrl = 'http://localhost:3000/'

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  useEffect(() => {
    fetch(apiBaseUrl + 'carddecks/brief')
    .then(response => response.json())
    .then(data => {
      setApiCarddecks(data)
      setIsLoaded(true);
    })
    .catch(error => console.error(error));

    // (async () => {
    //   try {
    //     const settingsSerializedJson = await AsyncStorage.getItem('userSettings'); 
    //     const settingsToJson = await JSON.parse(settingsSerializedJson);
    //     setSettingJson(settingsToJson);
    //     setIsLoaded(true);
  
    //   } catch (error) {
    //     console.log('Failed to retrieve data from storage', error);
    //   }
    // })();
  }, []);

  const addToLibrary = async (id) => {
    try {
      const response = await fetch(apiBaseUrl + 'carddecks/' + String(id));
      const data = await response.json();
      await AsyncStorage.setItem(String("carddeck_" + data["title"]), JSON.stringify(data["contents"]));
    } catch (error) {
      console.error("Adding community deck to library failed", error);
    }
  }

  if(!isLoaded) return <View style={{backgroundColor: theme.primary, flex: 1}}></View>
  return (
    <ScrollView style={{backgroundColor: theme.primary}}>
    <View style={{backgroundColor: theme.primary, justifyContent: 'flex-start'}}>
        {apiCarddecks.map((key, idx) => {
          return(
            <TouchableOpacity key={idx} style={{...styles.banner, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 10}}>
            <View style={{flex: 2}}>
              <Text numberOfLines={2}  style={{...styles.bigText, alignSelf: 'right', flex: 2}}>{key["title"]}</Text>
              <Text numberOfLines={3}  style={{ flex: 2}}>{key["description"]}</Text>
            </View>
            <View style={{flexDirection: 'column', flex: 1}}>
              {/* <TouchableOpacity style={{backgroundColor: 'darkgrey', padding: 5, marginBottom: 8, borderWidth: '2'}} >
                <Text>Delete</Text>
              </TouchableOpacity> */}
              <TouchableOpacity style={{...styles.bannerEditButton, padding: 0, backgroundColor: theme.negative, marginLeft: 10}} onPress={()=> {addToLibrary(key["id"])}}>
                <Text style={{ margin: 0}}>Add to Library</Text>
              </TouchableOpacity>
            </View>
            </TouchableOpacity>
          )
        })}
    </View>
    </ScrollView>
  )
}



export default SettingsScreen;