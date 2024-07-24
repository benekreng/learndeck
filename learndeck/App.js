import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, ImageBackground, ImageUri, Image, SafeAreaView, TextInput, Alert} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React from 'react';
import Collapsible from 'react-native-collapsible';
import Markdown from 'react-native-markdown-display';
import PropTypes from 'prop-types';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';



const CardDeckBannerCell = forwardRef(({name, pressed}, ref) => {
  //check
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('Unix');
        if (value !== null) {
          // We have data!!
          //console.log('READ THIS DATA: ', value);
        }
      } catch (error) {
        // Error retrieving data
      }
    })()
  })


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

const CardDecksCollection = 
{
  "Unix": {
    "statistics": {
      "errorsPerRun": [0]
    },
    "cards": [
      {
        "front": "Question about Unix",
        "back": "explanation1",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question2",
        "back": "explanation2",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question3",
        "back": "explanation3",
        "statistics": [0, 0, 0]
      }
    ]
  },
  "The Web": {
    "statistics": {
      "errorsPerRun": [0]
    },
    "cards": [
      {
        "front": "Question about the Web",
        "back": "explanation1",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question2",
        "back": "explanation2",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question3",
        "back": "explanation3",
        "statistics": [0, 0, 0]
      }
    ]
  },
  "Networking": {
    "statistics": {
      "errorsPerRun": [0]
    },
    "cards": [
      {
        "front": "Question about Networking",
        "back": "explanation1",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question2",
        "back": "explanation2",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question3",
        "back": "explanation3",
        "statistics": [0, 0, 0]
      }
    ]
  },
  "ProgrammingQuestions": {
    "statistics": {
      "errorsPerRun": [0]
    },
    "cards": [
      {
        "front": "What is the primary purpose of using pointers in programming languages like C or C++?",
        "back": "Pointers are used for various purposes, including dynamic memory allocation, array manipulation, and efficient data structure management. They allow direct access to memory and enable the creation of complex data structures.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "Explain the concept and utility of virtual functions in C++.",
        "back": "Virtual functions are used to support dynamic polymorphism in C++. They allow a program to call methods of derived classes through base class pointers which helps in achieving runtime polymorphism.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is the difference between deep copy and shallow copy?",
        "back": "A shallow copy duplicates as little as possible, typically only the top-level object and the immediate values. A deep copy duplicates everything it can, including objects referenced by fields. Shallow copy is faster but can lead to issues with shared references, whereas deep copy is safer but more memory-intensive.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "Describe the use of the volatile keyword in C.",
        "back": "The volatile keyword is used in C to tell the compiler that the value of the variable may change at any time without any action being taken by the code the compiler finds nearby. This is often used in multi-threaded applications and with hardware that modifies its state independently from the running program.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is tail recursion? Provide an example.",
        "back": "Tail recursion is a recursion where the recursive call is the last operation in the function. It allows for optimization by compilers into iteration, which prevents stack overflow. Example: Calculating factorial in a tail-recursive manner involves an accumulator parameter to carry the factorial value.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "Discuss the concept of RAII in C++ and its benefits.",
        "back": "Resource Acquisition Is Initialization (RAII) is a programming idiom used in C++ to manage resource allocation and deallocation. RAII ensures that resources such as memory, file handles, and network connections are properly cleaned up when the owning object is destroyed, thus helping to prevent resource leaks and undefined behavior.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "Explain the difference between overriding and overloading in object-oriented programming.",
        "back": "Overriding is when a derived class implements a method of its base class that has the same signature, changing its behavior. Overloading is when two or more methods in the same scope have the same name but different parameters, allowing methods to be called based on the argument types.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What is a race condition and how can it be prevented?",
        "back": "A race condition occurs when two or more threads can access shared data and they try to change it at the same time. It can be prevented by using synchronization techniques like mutexes, locks, or by designing software where thread interference is minimized or eliminated.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "Describe how garbage collection works in Java.",
        "back": "Garbage collection in Java automatically deallocates memory that objects no longer use. The JVM periodically checks which objects are no longer reachable from any references in running code and frees the associated memory, helping to prevent memory leaks.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "What are generics in programming, and how do they improve software development?",
        "back": "Generics enable algorithms and classes to operate on generic types, allowing for code reuse across disparate data types. This leads to stronger type checks at compile time, elimination of casts, and the ability to implement generic algorithms. It simplifies the code and can lead to performance improvements.",
        "statistics": [0, 0, 0]
      }
    ]
  },
  "Programming2": {
    "statistics": {
      "errorsPerRun": [0]
    },
    "cards": [
      {
        "front": "What is the primary purpose of using pointers in programming languages like C or C++?",
        "back": "Pointers are used for various purposes, including dynamic memory allocation, array manipulation, and efficient data structure management. They allow direct access to memory and enable the creation of complex data structures.",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question2",
        "back": "explanation2",
        "statistics": [0, 0, 0]
      },
      {
        "front": "question3",
        "back": "explanation3",
        "statistics": [0, 0, 0]
      }
    ]
  }
}
  

function CardDecks(){
  const [cardDeckKeys, setCardDeckKeys] = useState([]);
  const numChildren = Object.entries(CardDecksCollection).length;
  const deckBannerRef = useRef([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const allKeys = await AsyncStorage.getAllKeys();
      setCardDeckKeys(allKeys);
    })()
  },[])

  console.log('THESE ARE THE CARD DECK KEYS', cardDeckKeys);
  
  if (deckBannerRef.current.length !== numChildren) {
    deckBannerRef.current = Array(numChildren).fill().map((_, i) => deckBannerRef.current[i] || React.createRef());
  }
  const handleCollapse = (event, deck) => {
    deckBannerRef.current.forEach(ref => {
        ref.current.changeLocalCollapseState(deck);
    });
    //scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  return (
    <ScrollView ref={scrollViewRef} style={{backgroundColor: 'beige'}}>
      <View style={{padding: 5}}>
      </View>
      <>
      { true ?  
      // {cardDeckKeys !== undefined ? 
        (
        Object.entries(CardDecksCollection).map(([key, value], idx)=>(
          <CardDeckBannerCell key={key} name={key} pressed={handleCollapse} ref={deckBannerRef.current[idx]}/>
        ))
      ):
      (
        <></>
      )}
      </>
      {/* {cardDeckKeys.forEach((key)=>(
        <CardDeckBannerCell key={key} name={key} pressed={handleCollapse} ref={deckBannerRef.current[idx]}/>
      ))} */}
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


//elment to click on to select study mode
const ButtonElement = ({name, style, textStyle, onPress, handleFeedback}) => {
  const navigation = useNavigation();
  const whenPressed = () => {
    onPress?.();
    handleFeedback?.(name);
  }
  return (
    <TouchableOpacity style={{...styles.buttonElement, ...style}} onPress={whenPressed}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{...styles.midText02, ...textStyle}}> {name} </Text>
    </TouchableOpacity>
  )
}

function EditScreen({name}) {
  //const deckName = route.params.lolman;
  return (
    <ScrollView style={{backgroundColor: 'beige'}}>
    </ScrollView>
  )
}  


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
              <View style={{...styleElements.borderAndShadow, flex: 1, backgroundColor: 'lightgrey', margin: 20, marginTop: 5, borderRadius: '10px', justifyContent: 'space-around'}}>
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





const Stack = createNativeStackNavigator();


export default function App() {
  const [firstLaunch, setFirstLaunch] = useState('false')
  useEffect(() => {
    //load the default decks from the hardcoded json object into the async storage if the app launched for the first time
    (async () => { 
      try {
        const keys = await AsyncStorage.getAllKeys();
        if(keys.length > 0){
          setFirstLaunch('false')
          console.log('App was already launched once')
        }else{
          setFirstLaunch('true')
          console.log('App was launched the first time')
        }
      } catch (error) {
        console.log('Failed to get all keys', error);
      }
    })();
    if(firstLaunch){
      (async () => {
        for await (const [key, value] of Object.entries(CardDecksCollection)){
          try {
            await AsyncStorage.setItem(
              key,
              JSON.stringify(CardDecksCollection[key]) 
            );
          } catch (error) {
            console.log('Failed to insert data', error);
          }
        }
      })()
    }
  }, []);


  return (
    <NavigationContainer style={{}}>
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen name="Card Deck's" component={CardDecks} options={{headerStyle: {
            backgroundColor: 'beige',
          },}}/>
        <Stack.Screen name="Edit Deck" component={EditScreen} options={
          ({ route }) => ({ 
              title: 'Edit Deck', 
              headerStyle: {
              backgroundColor: 'beige'
            }
          })
          }/>
        <Stack.Screen name="Study Session"  component={StudySession} 
        options={
          ({ route }) => ({ 
              studyMode: route.params.studyMode, 
              deck: route.params.deck, 
              headerStyle: {
              backgroundColor: 'beige'
            }
          })
        }/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styleElements = StyleSheet.create({
  borderAndShadow: {
    shadowOffset: { width: 6, height: 6 }, 
    shadowColor: 'rgb(71, 71, 68)', 
    shadowOpacity: 0.75, 
    shadowRadius: 0, 
    borderWidth: 2,
  }
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bigText02: {
    fontSize: 20,
  },
  midText00: {
    fontSize: 20,
    fontWeight: '500'
  },
  midText01: {
    fontSize: 16,
    fontWeight: '500'
  },
  midText02: {
    fontSize: 14,
    fontWeight: '500'
  },
  bannerOuterView: {
    paddingBottom: 5, 
    paddingTop: 5, 
    paddingLeft: 10, 
    paddingRight: 10
  },
  banner: {
    ...styleElements.borderAndShadow,
    flexDirection: 'column',
    flex: 1, 
    margin: 5, 
    justifyContent: 'space-between', 
    flexDirection: 'row', 
    verticalAlign:'middle', 
    padding: 10, 
    backgroundColor: 'lightgrey', 
  },
  bannerEditButton: {
    backgroundColor: 'pink', 
    textAlign: 'center', 
    justifyContent: "center", 
    padding: 20, 
    borderRadius: '50vh', 
    borderWidth: 2, 
    aspectRatio: 1 / 1
  },
  buttonElement: {
    //set padding as min size
    padding: 7,
    backgroundColor: 'lightgrey',
    shadowOffset: { width: 6, height: 6 }, 
    shadowColor: 'rgb(71, 71, 68)', 
    shadowOpacity: 0.75, 
    shadowRadius: 0, 
    borderWidth: 2,
    borderRadius: '50vh', 
    shadowOffset: { width: 3, height: 3 }, 
    flexGrow: 1, 
    margin: 10, 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  flashcardView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  flashcardInnerView: {
    flex: 1,
    margin: 10,
    backgroundColor: 'pink',
    borderRadius: '20px',
    backgroundColor: 'white',
    borderWidth: 3,
    shadowOffset: { width: 6, height: 6 }, 
    shadowColor: 'rgb(71, 71, 68)', 
    shadowOpacity: 0.75, 
    shadowRadius: 0, 
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flashcardTextView: {
    padding: 10,
    textAlign: 'center',
  },
  progressBarView: {
    flex: 1,
  },
  progressBarInnerView: {
    ...styleElements.borderAndShadow,
    flex: 1,
    margin: 2,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: '50vh',
    backgroundColor: 'lightgrey',
    borderRadius: '50vh', 
    shadowOffset: { width: 1, height: 1 }, 
  },

  progressBarText: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center'
  },
  customCollapsable: {
    transition: 'opacity 0.3s ease-in-out'
  },
  transition: {
    transition: 'opacity 5s ease-in-out',
    flex: 1
  },
});