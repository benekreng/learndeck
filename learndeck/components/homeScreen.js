import { Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React, {useContext} from 'react';
import Collapsible from 'react-native-collapsible';

import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

const CardDeckBannerCell = forwardRef(({name, storageId, pressed}, ref) => {
  const [isOpened, setOpened] = useState(true);

  useImperativeHandle(ref, () => ({
    changeLocalCollapseState
  }));

  const changeLocalCollapseState = (deck) => {
    if(deck == name){
      setOpened(!isOpened)
      return
    }
    setOpened(true)
  }

  return(
  <View style={{...styles.bannerOuterView, flex: 1, maxHeight: 100, marginLeft: 10, marginRight: 10}} >
    <TouchableOpacity style={{...styles.banner, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' , borderRadius: 50}} onPress={pressed}>
        <Text numberOfLines={2}  style={{...styles.bigText, alignSelf: 'center', textAlign: 'center', flex: 1}}> {name} </Text>
    </TouchableOpacity>
    <Collapsible collapsed={isOpened} duration={400} easing={'easeOutCubic'} style={{padding: 10}}>
      <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 0}}>
        <View style={{backgroundColor: 'dimgrey', padding: 5, borderRadius: 50}}>
          <Text style={{color: 'white', fontWeight: '400'}}>Choose Study Mode</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
        <ButtonElement  name="Reset Stats" style={{marginRight: 5, marginLeft: 5}}/>
        <ButtonElement  name="Archive" style={{marginRight: 5, marginLeft: 5}}/>
        <ButtonElement name="See Stats" style={{marginRight: 5, marginLeft: 5}}/>
      </View>
    </Collapsible>
  </View>
  )
});

function HomeScreen(){
  const { theme, updateTheme } = useContext(ThemeContext);
	const navigation = useNavigation();
  const [refreshHook, setRefreshHook] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  return (
    <View key={refreshHook} ref={scrollViewRef} style={{flex: 1, backgroundColor: theme.primary, justifyContent: 'flex-start'}}refresh={theme}>

			<Text style={{textAlign: 'center', marginTop: 20, fontSize: 20}}>Streak 🔥: 2</Text>
			<Text style={{textAlign: 'center', marginTop: 20, fontSize: 20}}>Reach todays goal!</Text>
			<View style={{...styles.dailyGoalOuterView, backgroundColor: theme.positive, borderRadius: 20, margin: 30}}>
				<Text style={{...styles.midText02, alignSelf: 'center', padding: 20}}>Complete one Study Session!</Text>
			</View>

			<CardDeckBannerCell key={"Your Decks"} name={"Your Decks"} pressed={() => navigation.navigate("Card Decks")}/>
			<CardDeckBannerCell key={"Create New"} name={"Create New"} pressed={() => navigation.navigate('Edit Deck', { deckName: null, storageId: null})}/>
			<CardDeckBannerCell key={"Community Decks"} name={"Community Decks"} pressed={() => navigation.navigate("Community Decks")}/>
			<CardDeckBannerCell key={"Settings"} name={"Settings"} pressed={() => navigation.navigate("Settings")}/>
    </View>
  )
}

export default HomeScreen;