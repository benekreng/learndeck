
import { Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect} from 'react';
import React from 'react';
import Collapsible from 'react-native-collapsible';
import Markdown from 'react-native-markdown-display';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'

const StudySession = ({route}) => {
  //load from storage to memory to read and write the statistics
  const { deck, studyMode } = route.params; 
  const navigation = useNavigation();

  const [isFlipped, setFlipped] = useState(false);
  const [currentCard, setNextCard] = useState(0);
  const [lastCard, setLastCard] = useState(0);
  const [deckJson, setDeckJson] = useState(0);
  const [finished, setFinished] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const deckAsJson = await AsyncStorage.getItem(deck); 
        setDeckJson(await JSON.parse(deckAsJson));
      } catch (error) {
        console.log('Failed to retrieve data from storage', error);
      }
    })();
  }, []);
  
  useEffect(() => {
    if (deckJson['cards'] != null && deckJson['cards'] != undefined) {
      const lastCardIndex = deckJson['cards'].length-1;
      setLastCard(lastCardIndex);
    }
  }, [deckJson]);

  const reloadStudySession = () => {
    setFlipped(false);
    setFinished(false);
  }

  const handleFeedback = (feedback) => {
    console.log('handeling feedback')
    if(currentCard < lastCard){
      setNextCard(currentCard + 1);
      setFlipped(false);
      return;
    }
    setFinished(true);
    setNextCard(currentCard + 1);
    return;
  }

  return (
    <SafeAreaView style={{backgroundColor: 'beige', flex: 1, justifyContent: 'flex-end'}}>
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
                  <Text style={{...styles.midText02, alignSelf: 'center', padding: 10}}>This Session</Text>
                  <View numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: '#419D78', borderRadius: '50vh'}}>
                    <Text style={{...styles.midText00}}> Correct: 10 </Text>
                  </View>
                  <View numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: 'grey', borderRadius: '50vh'}}>
                    <Text style={{...styles.midText00}}>Unsure: 5</Text>
                  </View>
                  <View  numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: 'pink', borderRadius: '50vh'}}>
                    <Text style={{...styles.midText00}}>Wrong: 5</Text>
                  </View>
                  <Text style={{alignSelf: 'center', padding: 10}}>All Sessions Graph</Text>
                  <View style={{backgroundColor: 'dimgrey', flex: 1, margin: 20, marginTop: 10}}></View>
              </View>
            </View>
            </>
            ) 
          }
        </View>
        {
        !finished ? (
          <View style={{flex: 1, padding: 10}}>
            <Collapsible collapsed={!isFlipped} duration={400} easing={'easeOutCubic'} >
              <View style={{flex: 1, flexDirection: 'row'}}>
                <ButtonElement name="Wrong" style={{backgroundColor: '#ffb6c1', flex: 1}} textStyle={{...styles.midText01}} handleFeedback={handleFeedback}/>
                <ButtonElement name="Unsure" textStyle={{...styles.midText01}} handleFeedback={handleFeedback}/>
                <ButtonElement name="Correct" style={{backgroundColor: '#419D78'}} textStyle={{...styles.midText01}} handleFeedback={handleFeedback}/>
              </View>
            </Collapsible>
            <ButtonElement name="FLIP" style={{display: !isFlipped ? 'flex' : 'none', ...styles.transition}} textStyle={{...styles.bigText}}onPress={()=> setFlipped(!isFlipped)}/>
          </View>

        ) : (
          <View style={{flex: 1, padding: 10, flexDirection: 'row'}}>
            <ButtonElement name="Repeat" style={{...styles.transition, backgroundColor: '#ffb6c1'}} textStyle={{...styles.bigText}}onPress={()=> {setNextCard(0);reloadStudySession()}}/>
            <ButtonElement name="Finish" style={{...styles.transition, backgroundColor: '#419D78'}} textStyle={{...styles.bigText}}onPress={()=> navigation.goBack()}/>
          </View>
        )
      }
      </SafeAreaView>
    )
}

const ProgressBar = ({currentCard, lastCard}) => {
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
          <View style={{borderRadius: '50vh', flex: greenPart, backgroundColor: '#3d9470'}}></View>
          <View style={{borderRadius: '50vh', flex: invisiblePart, backgroundColor: 'transparent'}}></View>
        </View>
        <View style={{...styles.progressBarText}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{textAlign: 'center', fontSize: 15}}> {progress} </Text>
        </View>
      </View>
  )
}

const FlashCard = ({ deckJson, cardNumber, side}) => {
  return (
    <View style={{ ...styles.flashcardView }}>
      <View style={styles.flashcardInnerView}>
        <View style={styles.flashcardTextView}>
          <Text>{deckJson?.['cards']?.[cardNumber]?.[side]}</Text>
        </View>
      </View>
    </View>
  );
};

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

const EditableMarkdownBox = () => {
  const [markdownText, setMarkdownText] = useState('');

  return (
    <PaperProvider theme={MD3LightTheme}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          multiline
          onChangeText={setMarkdownText}
          value={markdownText}
          placeholder="Type your markdown here..."
        />
        <ScrollView style={styles.markdownContainer}>
          <Markdown>{markdownText}</Markdown>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default StudySession;