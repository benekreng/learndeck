import { Text, View, TouchableOpacity, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect} from 'react';
import React, { useContext }  from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

const CommunityDecks = ({route}) => {
  //load from storage to memory to read and write the statistics
  const { theme, updateTheme } = useContext(ThemeContext);
  const [settingJson, setSettingJson] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  useEffect(() => {
    (async () => {
      try {
        const settingsSerializedJson = await AsyncStorage.getItem('userSettings'); 
        const settingsToJson = await JSON.parse(settingsSerializedJson);
        setSettingJson(settingsToJson);
        setIsLoaded(true);
  
      } catch (error) {
        console.log('Failed to retrieve data from storage', error);
      }
    })();
  }, []);

  const changeColorTheme = async (id) => {
    await AsyncStorage.setItem('selectedColorTheme', String(id)); 
    updateTheme(settingJson["colorthemes"][id]);
  }

  const resetToFactorySettings = () => {
    Alert.alert("Are you sure you want to reset to factory settings?", "", [
      {
        text: "Cancel",
        style: "cancel", 
        onPress: () => {
          return;
        }
      },
      {
        text: "Yes",
        onPress: async () => {
          Alert.alert("To remove all data press delete", "This action cannot be undone ", [
            {
              text: "Cancel",
              style: "cancel", 
              onPress: () => {
                return;
              }
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await AsyncStorage.clear();
                Alert.alert("Restart the app now for the changes to take place");
              }
            }
          ])
        }
      }
    ])
  }

  if(!isLoaded) return <View style={{backgroundColor: theme.primary, flex: 1}}></View>
  return (
    <View style={{backgroundColor: theme.primary, justifyContent: 'flex-start', flex: 1}}>
      <Text style={{justifyContent: 'center',textAlign: 'center', fontSize: 20, padding: 20}}>Choose Color Theme</Text>
      <View style={{alignItems: 'center'}}>
        
        {
        settingJson?.["colorthemes"].map((key, idx) => {
          return <ColorThemePreview changeColorTheme={changeColorTheme} key={idx} id={idx} colors={settingJson["colorthemes"][idx]}></ColorThemePreview>
        })}
      </View>
      <Text style={{textAlign: 'center', fontSize: 20, padding: 20}}>Reset to factory settings</Text>
      <TouchableOpacity onPress={()=>{resetToFactorySettings()}}style={{...styles.borderAndShadowDefault, marigin: 20, backgroundColor: theme.negative, borderRadius: 50, padding: 10, margin: 60, marginTop: 0}}>
        <Text style={{textAlign: 'center'}}>Reset to factory settings</Text>
      </TouchableOpacity>

    </View>
  )
}

const ColorThemePreview = ({colors, id, changeColorTheme}) => {
  return(
    <View style={{width: '100%', margin: 10}}>
      <TouchableOpacity onPress={()=> changeColorTheme(id)} style={{...styles.borderAndShadowDefault, marginLeft: '10%', marginRight: '10%', padding: 15, backgroundColor: 'grey', borderRadius: 50}}>
        <View style={{flexDirection: 'row', marginLeft: 10, marginRight: 10, borderWidth: 2}}>
          <View style={{backgroundColor: colors[0], flex: 1, height: 20}}></View>
          <View style={{backgroundColor: colors[1], flex: 1}}></View>
          <View style={{backgroundColor: colors[2], flex: 1}}></View>
          <View style={{backgroundColor: colors[3], flex: 1}}></View>
        </View>
      </TouchableOpacity>
    </View>
  )
}



export default CommunityDecks;