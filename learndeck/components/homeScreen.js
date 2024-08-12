import { Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React, {useContext} from 'react';

import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';


function HomeScreen(){
  const { theme, updateTheme } = useContext(ThemeContext);
	const navigation = useNavigation();
  const [refreshHook, setRefreshHook] = useState(0);
  const scrollViewRef = useRef(null);

  //updates header style on theme change
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  return (
    <View key={refreshHook} ref={scrollViewRef} style={{flex: 1, backgroundColor: theme.primary, justifyContent: 'flex-start'}}refresh={theme}>
			<Text style={{textAlign: 'center', marginTop: 20, fontSize: 40}}>Welcome Back</Text>
      <View style={{justifyContent: 'space-around', flex: 1}}>
        <View>
          <ButtonElement style={{height: 80}} textStyle={{...styles.bigText}} key={"Your Decks"} name={"Your Decks"} onPress={() => navigation.navigate("Card Decks")}/>
          <ButtonElement  style={{height: 80}} textStyle={{...styles.bigText}} key={"Community Decks"} name={"Community Decks"} onPress={() => navigation.navigate("Community Decks")}/>
          <ButtonElement  style={{height: 80}} textStyle={{...styles.bigText}} key={"Settings"} name={"Settings"} onPress={() => navigation.navigate("Settings")}/>
        </View>
      </View>
    </View>
  )
}

export default HomeScreen;