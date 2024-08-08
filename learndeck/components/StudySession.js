
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect, useContext} from 'react';
import React from 'react';
import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';


import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

const StudySession = ({route}) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  //load from storage to memory to read and write the statistics
  const { deck, studyMode, storageId} = route.params;
  const navigation = useNavigation();

  const [isFlipped, setFlipped] = useState(false);
  const [currentCard, setNextCard] = useState(0);
  const [lastCard, setLastCard] = useState(0);
  const [deckJson, setDeckJson] = useState(0);
  const [finished, setFinished] = useState(false);
  const [sessionScore, setSessionScore] = useState([0, 0, 0]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  useEffect(() => {
    (async () => {
      try {
        const deckAsJson = await AsyncStorage.getItem(storageId); 
        const deckParsed = JSON.parse(deckAsJson);
        const lastCardIndex = deckParsed['cards'].length-1;
        if(lastCardIndex == -1){
          Alert.alert("You have no cards in this deck", "", [
            {
              text: 'Ok',
              onPress: () => {
                navigation.goBack()
              }
            }
          ])
        }
        setLastCard(lastCardIndex);
        setDeckJson(deckParsed);
      } catch (error) {
        console.log('Failed to retrieve data from storage', error);
      }
    })();
  }, []);

  //when deckjson is set than 
  useEffect(() => {
    if(deckJson){
      reloadStudySession();
    }
    
  }, [deckJson])

  const reloadStudySession = () => {
    setFlipped(false);
    setFinished(false);
    deckJson['statistics']['errorsPerRun'].push([0,0,0]);
  }

  const handleFeedback = (feedback) => {
    
    try{
      if(feedback == 'Wrong'){
        deckJson['cards'][currentCard]['statistics'][0] += 1
        let newScore = sessionScore[0] + 1
        setSessionScore([newScore, sessionScore[1], sessionScore[2]])
        deckJson['statistics']['errorsPerRun'][deckJson['statistics']['errorsPerRun'].length-1][0] += 1;

      }else if(feedback == 'Unsure'){
        deckJson['cards'][currentCard]['statistics'][1] += 1
        let newScore = sessionScore[1] + 1
        setSessionScore([sessionScore[0], newScore, sessionScore[2]])
        deckJson['statistics']['errorsPerRun'][deckJson['statistics']['errorsPerRun'].length-1][1] += 1;

      }else if(feedback == 'Correct'){
        deckJson['cards'][currentCard]['statistics'][2] += 1
        let newScore = sessionScore[2] + 1
        setSessionScore([sessionScore[0], sessionScore[1], newScore])
        deckJson['statistics']['errorsPerRun'][deckJson['statistics']['errorsPerRun'].length-1][2] += 1;
      }
    }catch(err){
      console.log("Could not set feedback for this card or update statistics for this session", err)
    }

    if(currentCard < lastCard){
      setNextCard(currentCard + 1);
      setFlipped(false);
      return;
    }

    //after feedback for last card was given
    setFinished(true);
    setNextCard(currentCard + 1);
    setSessionScore(deckJson['statistics']['errorsPerRun'][deckJson['statistics']['errorsPerRun'].length-1]);

    try{
      (async () => {
          const jsonStringified = JSON.stringify(deckJson);
          await AsyncStorage.setItem(storageId, JSON.stringify(deckJson));
          const theJson = await AsyncStorage.getItem(storageId);
        }
      )();
      
    }catch(err){
      console.log('Storing new object to async storage failed', err);
    }
    return;
  }

  return (
    <SafeAreaView style={{backgroundColor: theme.primary, flex: 1, justifyContent: 'flex-end'}}>
      <View style={{flex: 9}}>
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center'}}>{route.params.deck}</Text>
        </View>
        <View style={{flex: 0.3}}>
          <ProgressBar currentCard={currentCard} lastCard={lastCard} />
        </View>
        {
          !finished ? (
            <>
            <TouchableOpacity style={{flex: 2.5}} onPress={() => setFlipped(!isFlipped)}>
              <FlashCard deckJson={deckJson} cardNumber={currentCard} side={'front'}/>
            </TouchableOpacity>

            <View style={{flex: 2.5}}>
              {
                isFlipped ? 
                (<FlashCard deckJson={deckJson} cardNumber={currentCard}  side={'back'}/>)
                :
                (<></>)
              }
            </View>
            </>
          ) : (
            <>
            <View style={{flex: 0.7, justifyContent: 'center'}}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center'}}>Statistics</Text>
            </View>
            <View style={{flex: 4.3, justifyContent: 'center'}}>
              {/* box area to hold statistics */}
              <View style={{...styles.statisticsBox}}>
                  <Text style={{...styles.midText02, alignSelf: 'center', padding: 20}}>This Session</Text>
                  <View numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: theme.positive, borderRadius: '50vh'}}>
                    <Text style={{...styles.midText00}}> Correct: {sessionScore[2]} </Text>
                  </View>
                  <View numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: 'grey', borderRadius: '50vh'}}>
                    <Text style={{...styles.midText00}}>Unsure: {sessionScore[1]}</Text>
                  </View>
                  <View  numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: theme.negative, borderRadius: '50vh'}}>
                    <Text style={{...styles.midText00}}>Wrong: {sessionScore[0]}</Text>
                  </View>
                  <Text style={{alignSelf: 'center', padding: 20, paddingBottom: 0}}>All Sessions Graph</Text>
                  <AllStatisticsGraph perRunStatisticsArray={deckJson}/>
              </View>
            </View>
            </>
            ) 
          }
        </View>
        {
          //to displayed when not training, not finished
        !finished ? (
          <View style={{flex: 1, padding: 10}}>
            <Collapsible collapsed={!isFlipped} duration={400} easing={'easeOutCubic'} >
              <View style={{flex: 1, flexDirection: 'row'}}>
                <ButtonElement name="Wrong" style={{backgroundColor: theme.negative, flex: 1}} textStyle={{...styles.midText01}} handleFeedback={handleFeedback}/>
                <ButtonElement name="Unsure" textStyle={{...styles.midText01}} handleFeedback={handleFeedback}/>
                <ButtonElement name="Correct" style={{backgroundColor: theme.positive}} textStyle={{...styles.midText01}} handleFeedback={handleFeedback}/>
              </View>
            </Collapsible>
            {!isFlipped ? (
            <ButtonElement name="FLIP" style={{backgroundColor: theme.neutral}} textStyle={{...styles.bigText, color: theme.text02}}onPress={()=> setFlipped(!isFlipped)}/>
            ):
            (<></>)}
          </View>

        ) : (
          <View style={{flex: 1, padding: 10, flexDirection: 'row'}}>
            <ButtonElement name="Repeat" style={{...styles.transition, backgroundColor: theme.negative}} textStyle={{...styles.bigText}}onPress={()=> {setNextCard(0);reloadStudySession()}}/>
            <ButtonElement name="Finish" style={{...styles.transition, backgroundColor: theme.positive}} textStyle={{...styles.bigText}}onPress={()=> navigation.goBack()}/>
          </View>
        )
      }
      </SafeAreaView>
    )
}

const ProgressBar = ({currentCard, lastCard}) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const [greenPart, setGreenPart] = useState(0);
  const [invisiblePart, setInvisiblePart] = useState(lastCard);

  const [progress, setProgress] = useState('11/20')
  
  useEffect(() => {
    setProgress((currentCard).toString() + ' / ' + (lastCard+1).toString())
    setGreenPart(currentCard);
    setInvisiblePart(lastCard + 1 - currentCard);
  }, [currentCard, lastCard])

  return (
      <View style={{...styles.progressBarInnerView}}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{borderRadius: '50vh', flex: greenPart, backgroundColor: theme.positive}}></View>
          <View style={{borderRadius: '50vh', flex: invisiblePart, backgroundColor: 'transparent'}}></View>
        </View>
        <View style={{...styles.progressBarText}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{textAlign: 'center', fontSize: 15}}> {progress} </Text>
        </View>
      </View>
  )
}

const FlashCard = ({ deckJson, cardNumber, side}) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  return (
    <View style={{ ...styles.flashcardView }}>
      <View style={styles.flashcardInnerView}>
        <View style={styles.flashcardTextView}>
          <Markdown>{String(deckJson?.['cards']?.[cardNumber]?.[side])}</Markdown>
        </View>
      </View>
    </View>
  );
};


const AllStatisticsGraph = ({perRunStatisticsArray, currentCard=0}) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const errorsPerRun = perRunStatisticsArray?.['statistics']?.['errorsPerRun'] ?? [];

  return(
    <>
      <View style={{flex: 1,  margin: 20, marginTop: 0}}>
        <View style={{padding: 20, flex: 1, flexDirection: 'row',  justifyContent: 'space-around'}}>
          {errorsPerRun.map((key, index)=>
          {
          return(
            <View key={index} style={{flex: 1}}>
              <View style={{flex: key[2], backgroundColor: theme.positive, marginLeft: 2, marginRight: 2}}></View>
              <View style={{flex: key[1], backgroundColor: 'dimgrey', marginLeft: 2, marginRight: 2}}></View>
              <View style={{flex: key[0], backgroundColor: theme.negative, marginLeft: 2, marginRight: 2}}></View>
            </View>
          )
        }
        )}
        </View>
      </View>
    </>
  )
}

// const FlashCard = ({ deckJson, cardNumber, side}) => {
//   const [cardContent, setCardContent] = useState('');

//   useEffect(() => {
//     if(deckJson['cards'] == undefined){
//       return;
//     }
//     setCardContent(deckJson['cards'][cardNumber][side])
//   },[deckJson, cardNumber])

//   return (
//     <View style={{ ...styles.flashcardView }}>
//       <View style={styles.flashcardInnerView}>
//         <View style={styles.flashcardTextView}>
//           <Text>{cardContent}</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

export default StudySession;