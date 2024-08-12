import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { NavigationContainer, useNavigation, useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect, useCallback} from 'react';
import React, {useContext} from 'react';
import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

//ui element for one card deck
const CardDeckBannerCell = forwardRef(({name, storageId, pressed, refreshParent}, ref) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [isOpened, setOpened] = useState(true);

  //imerative so the parent can call changeLocalCollapse method trigger collapse
  useImperativeHandle(ref, () => ({
    changeLocalCollapseState
  }));

  //changes local collapse state
  const changeLocalCollapseState = (deck) => {
    if(deck == name){
      setOpened(!isOpened)
      return
    }
    setOpened(true)
  }

  //this resets the statistics by loading the data of the deck, reseting the array storing the deck again
  const resetStatistics = () => {
     Alert.alert("Are you sure you want to reset the statistics?", "", [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {return}
      },
      {
        text: 'Delete',
        onPress: async () => {
          const deckAsJson = await AsyncStorage.getItem(storageId); 
          const deckParsed = JSON.parse(deckAsJson);
          deckParsed['statistics']['errorsPerRun'] = [];
          await AsyncStorage.setItem(storageId, JSON.stringify(deckParsed))
        }
      }
    ])
  }

  //deletes deck
  const deleteDeck = async () => {
    Alert.alert("Are you sure you want to delete this deck?", "", [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {}
      },
      {
        text: 'Delete',
        onPress: async () => {
          try{
            await AsyncStorage.removeItem(storageId);
          }catch(err){
            console.log("failed to delete deck", err);
          }
          refreshParent();
        }
      }
    ])
  }

  return(
    false ? 
    (
    <View style={styles.bannerOuterView}>
        <Text numberOfLines={2}  style={{...styles.bigText, alignSelf: 'center', flex: 1}}>{name}</Text>
    </View>

    ):
    (
      <View style={styles.bannerOuterView}>
      <TouchableOpacity style={{...styles.banner, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={(event) => pressed(event, name)}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={{...styles.bigText, alignSelf: 'center', flex: 1, marginRight: 5}}>{name}</Text>
        <View style={{flexDirection: 'column'}}>
          <TouchableOpacity style={{backgroundColor: 'darkgrey', padding: 5, marginBottom: 8, borderWidth: 2}} onPress={() => deleteDeck()} >
            <Text>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bannerEditButton, padding: 0, backgroundColor: theme.negative}} onPress={() => navigation.navigate('Edit Deck', { deckName: name, deckStorageId: storageId})} >
            <Text style={{padding: 0, margin: 0}}>Edit</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      {/* collapsible does not work on android */}

      {/* <Collapsible collapsed={isOpened} duration={400} easing={'easeOutCubic'} style={{padding: 10}}>
        <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 0}}>
          <View style={{backgroundColor: 'dimgrey', padding: 5, borderRadius: 50}}>
            <Text style={{color: 'white', fontWeight: 400}}>Choose Study Mode</Text>
          </View>
        </View>
        <StudyModeElement studyMode="Study This Deck" deck={name} storageId={storageId}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
          <ButtonElement  name="Reset Stats" style={{marginRight: 5, marginLeft: 5, flex: 1}} onPress={()=> resetStatistics()}/>
          <ButtonElement name="See Stats" style={{marginRight: 5, marginLeft: 5, flex: 1}} onPress={()=> navigation.navigate("StatisticsScreen", { deckName: name, deckStorageId: storageId})}/>
        </View>
      </Collapsible> */}
      { !isOpened ? 
      (
        <>
        <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
          {/* <View style={{backgroundColor: 'dimgrey', padding: 5, borderRadius: 50}}>
            <Text style={{color: 'white', fontWeight: 400}}>Choose Study Mode</Text>
          </View> */}
        </View>
        <StudyModeElement studyMode="Study This Deck" deck={name} storageId={storageId}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
          <ButtonElement  name="Reset Stats" style={{marginRight: 5, marginLeft: 5, flex: 1, felxShrink: 0}} onPress={()=> resetStatistics()}/>
          <ButtonElement name="See Stats" style={{marginRight: 5, marginLeft: 5, flex: 1}} onPress={()=> navigation.navigate("StatisticsScreen", { deckName: name, deckStorageId: storageId})}/>
        </View>
        </>
      ):
      (
        <></>
      )}
    </View>

    )
  )
});

//this is the comonent of the "card deck" stack screen which shows your collection of card decks
const CardDecks = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [cardDeckStorageKeys, setCardDeckStorageKeys] = useState([]);
  const [cardDeckNames, setCardDeckNames] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshHook, setRefreshHook] = useState(0);
  const deckBannerRef = useRef([]);
  const scrollViewRef = useRef(null);

  const route = useRoute();

  const prevCardDeckNamesRef = useRef();


  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  //checks if the card deck keys have changed, either renamed or one has ben added
  //then refresh it
  useFocusEffect(
    React.useCallback(() => {
      checkCardDeckNames().then(newNames => {
        if (JSON.stringify(newNames) !== JSON.stringify(prevCardDeckNamesRef.current)) {
          setIsLoaded(false);
          refresh();
        }
      });
    }, [])
  );

  //returns an array of the card deck names, if non are there it returns an empty array
  const checkCardDeckNames = async () => {
    const rawKeys = await AsyncStorage.getAllKeys();
    const carddeckPrefix = 'carddeck_';
    const allStorageKeys = rawKeys.filter(key => key.startsWith(carddeckPrefix));
    const deckNames = allStorageKeys.map(key => key.replace(/^carddeck_/, ''));
    return deckNames ? deckNames : [];
  }

  useEffect(() => {
    (async () => {
      //retrieves card decks from storage and passes callback functions to carddeckbannercells
      const rawKeys = await AsyncStorage.getAllKeys();
      const carddeckPrefix = 'carddeck_';
      const allStorageKeys = rawKeys.filter(key => key.startsWith(carddeckPrefix));
      const deckNames = allStorageKeys.map(key => key.replace(/^carddeck_/, ''));

      setCardDeckNames(deckNames);
      prevCardDeckNamesRef.current = deckNames;

      const numChildren = allStorageKeys.length;
      setCardDeckStorageKeys(allStorageKeys);
      if (deckBannerRef.current.length !== numChildren) {
        deckBannerRef.current = Array(numChildren).fill().map((_, i) => deckBannerRef.current[i] || React.createRef());
      }
      setIsLoaded(true);
    })()
  },[refreshHook])

  
  //called by the carddeckbannercell component if it has been clicked on/collapsed
  const handleCollapse = (event, deck) => {
    deckBannerRef.current.forEach(ref => {
        ref.current.changeLocalCollapseState(deck);
    });
  }

  //force refresh by using a state hook
  const refresh = () => {
    setRefreshHook(prevHook => {
      return prevHook + 1;
    });
  } 

  if(!isLoaded) return(<></>)
  return (
    <>
    <ScrollView key={refreshHook} ref={scrollViewRef} style={{backgroundColor: theme.primary, position: 'relative'}}>
      <View style={{padding: 5}}></View>
        {cardDeckNames.map((key, idx) => {
         return(<CardDeckBannerCell key={key} name={key} storageId={cardDeckStorageKeys[idx]} pressed={handleCollapse} ref={deckBannerRef.current[idx]} refreshParent={refresh}/>)
        }
        )}
    </ScrollView>
    <TouchableOpacity onPress={() => navigation.navigate('Edit Deck', { deckName: null, storageId: null})} 
    style={{...styles.bannerEditButton,  
            backgroundColor: theme.positive, 
            aspectRatio: 1/1, 
            position: 'relative', 
            borderRadius: 50, 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'absolute',
            padding: 10,
            width: '25%',
            right: '4%',
            bottom: '4%',
          }}
    >
      <View style={{
        width: '60%',
        height: '10%',
        backgroundColor: 'black',
        position: 'absolute',
      }} />
      <View style={{
        width: '10%',
        height: '60%',
        backgroundColor: 'black',
        position: 'absolute',
      }} />
    </TouchableOpacity>
    </>
  )
}

//elment to click on to enter study mode
const StudyModeElement = ({studyMode, deck, storageId}) => {
  const navigation = useNavigation();
  return (
  <View style={styles.bannerOuterView}>
    <TouchableOpacity style={{...styles.buttonElement, margin: 5 }} onPress={() =>  navigation.navigate('Study Session', {deck: deck, storageId: storageId, studyMode: studyMode})}>
          <Text style={{...styles.midText01, alignItems: 'right'}}> {studyMode} </Text>
    </TouchableOpacity>
  </View>
  )
}

export default CardDecks;
