import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, ImageBackground, ImageUri, Image, SafeAreaView, TextInput, Alert} from 'react-native';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React, {useContext} from 'react';
import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

const CardDeckBannerCell = forwardRef(({name, storageId, pressed}, ref) => {
  
  const navigation = useNavigation();
  const [isOpened, setOpened] = useState(true);
	// const [today, setToday] = useState(moment().format('YYYY-MM-DD'));

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
    <TouchableOpacity style={{...styles.banner, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' , borderRadius: '50vh'}} onPress={pressed}>
        <Text numberOfLines={2}  style={{...styles.bigText, alignSelf: 'center', textAlign: 'center', flex: 1}}> {name} </Text>
    </TouchableOpacity>
    <Collapsible collapsed={isOpened} duration={400} easing={'easeOutCubic'} style={{padding: 10}}>
      <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 0}}>
        <View style={{backgroundColor: 'dimgrey', padding: 5, borderRadius: '50vh'}}>
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
  const [cardDeckStorageKeys, setCardDeckStorageKeys] = useState([]);
  const [cardDeckNames, setCardDeckNames] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshHook, setRefreshHook] = useState(0);
  const deckBannerRef = useRef([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("SCREEN WENT INTO FOCUS");
  //     setRefreshHook(prevHook => {
  //       console.log("Previous refreshHook:", prevHook);
  //       return prevHook + 1;
  //     });
  //   }, [])
  // );

	// deckBannerRef.current = Array(numChildren).fill().map((_, i) => deckBannerRef.current[i] || React.createRef());
  
  const handleCollapse = (event, deck) => {
    deckBannerRef.current.forEach(ref => {
        ref.current.changeLocalCollapseState(deck);
    });
    //scrollViewRef.current?.scrollToEnd({ animated: true });
  }

	const [isCollapsed, setIsCollapsed] = useState(true);

  // if(!isLoaded) return(<></>)
  return (
    <View key={refreshHook} ref={scrollViewRef} style={{flex: 1, backgroundColor: theme.primary, justifyContent: 'flex-start'}}refresh={theme}>

			<Text style={{textAlign: 'center', marginTop: 20, fontSize: 20}}>Streak 🔥: 2</Text>
			<Text style={{textAlign: 'center', marginTop: 20, fontSize: 20}}>Reach todays goal!</Text>
			<View style={{...styles.dailyGoalOuterView, backgroundColor: theme.positive, borderRadius: '20vh', margin: 30}}>
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