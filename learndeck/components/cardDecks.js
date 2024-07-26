import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, ImageBackground, ImageUri, Image, SafeAreaView, TextInput, Alert} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React from 'react';
import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'

const CardDeckBannerCell = forwardRef(({name, pressed}, ref) => {
  const navigation = useNavigation();
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
  <View style={styles.bannerOuterView}>
    <TouchableOpacity style={styles.banner} onPress={(event) => pressed(event, name)}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.bigText}> {name} </Text>
        </View>
        <TouchableOpacity style={styles.bannerEditButton} onPress={() => navigation.navigate('Edit Deck', {name: name})}>
          <Text>Edit</Text>
        </TouchableOpacity>
    </TouchableOpacity>
    <Collapsible collapsed={isOpened} duration={400} easing={'easeOutCubic'} style={{padding: 10}}>
      <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 0}}>
        <View style={{backgroundColor: 'dimgrey', padding: 5, borderRadius: '50vh'}}>
          <Text style={{color: 'white', fontWeight: '400'}}>Choose Study Mode</Text>
        </View>
      </View>
      <StudyModeElement studyMode="Study Weaknesses" deck={name}/>
      <StudyModeElement studyMode="Study Mixed" deck={name}/>
      <StudyModeElement studyMode="Study Comprehensive" deck={name}/>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
        <ButtonElement  name="Reset Stats" style={{marginRight: 5, marginLeft: 5}}/>
        <ButtonElement  name="Archive" style={{marginRight: 5, marginLeft: 5}}/>
        <ButtonElement name="See Stats" style={{marginRight: 5, marginLeft: 5}}/>
      </View>
    </Collapsible>
  </View>
  )
});


function CardDecks(){
  const [cardDeckKeys, setCardDeckKeys] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const deckBannerRef = useRef([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const allKeys = await AsyncStorage.getAllKeys();
      const numChildren = allKeys.length;
      setCardDeckKeys(allKeys);
      console.log('use effecr card decks: ', numChildren)
      if (deckBannerRef.current.length !== numChildren) {
        deckBannerRef.current = Array(numChildren).fill().map((_, i) => deckBannerRef.current[i] || React.createRef());
      }
      setIsLoaded(true);
    })()
  },[])
  
  
  const handleCollapse = (event, deck) => {
    deckBannerRef.current.forEach(ref => {
        ref.current.changeLocalCollapseState(deck);
    });
    //scrollViewRef.current?.scrollToEnd({ animated: true });
  }
  if(!isLoaded) return(<></>)
  return (
    <ScrollView ref={scrollViewRef} style={{backgroundColor: 'beige'}}>
      <View style={{padding: 5}}>
      </View>
          {cardDeckKeys.map((key, idx) => 
            (<CardDeckBannerCell key={key} name={key} pressed={handleCollapse} ref={deckBannerRef.current[idx]}/>)
          )}
    </ScrollView>
  )
}

//elment to click on to select study mode
const StudyModeElement = ({studyMode, deck}) => {
  const navigation = useNavigation();
  return (
  <View style={styles.bannerOuterView}>
    <TouchableOpacity style={{...styles.buttonElement, margin: 5 }} onPress={() =>  navigation.navigate('Study Session', {deck: deck, studyMode: studyMode})}>
          <Text style={{...styles.midText01, alignItems: 'right'}}> {studyMode} </Text>
    </TouchableOpacity>
  </View>
  )
}

export default CardDecks;