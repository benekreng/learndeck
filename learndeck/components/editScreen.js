import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, ImageBackground, ImageUri, Image, SafeAreaView, TextInput, Alert} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React from 'react';


import Markdown from 'react-native-markdown-display';


import AsyncStorage from '@react-native-async-storage/async-storage';


import ButtonElement from './buttonElement'
import styles from '../styles/mainStyles'
import { jsx } from 'react/jsx-runtime';

const BothMiniFlashCards = ({refreshCallback, saveNewCardsToAsncStorage, deckJson, frontCardContent, backCardContent, cardNumber, side, additionalStyle, editButtonText="edit"}) => {
	// const [cardContent, setCardContent] = useState(['', ''])
	// useEffect(() => {
	// 	setCardContent(deckJson)	
	// }, [])

	const [editMode, setEditMode] = useState(0);

	const storeNewContent = (text, side) => {
		deckJson["cards"][cardNumber][side] = text; 
	}

	const deleteButtonPress = () => {
		Alert.alert("Are you sure you want to delete this deck", "", [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Yes',
				onPress: () => {
					deleteThisCard();	
				}
			}
		])
	}

	const deleteThisCard = () => {
		deckJson["cards"].splice(cardNumber, 1);
		console.log("this card should be deleted now", JSON.stringify(deckJson))
		saveNewCardsToAsncStorage(deckJson);
		refreshCallback();
	}

	const editButtonPress = (cardID, action=action) => {
		setEditMode(cardID)
		saveNewCardsToAsncStorage(deckJson)
		console.log("Prompt to save Content", cardID)
	}

  return (
		<View style={{flexDirection: 'row', width: '100%'}}>
			<View style={[{ ...styles.flashcardView, aspectRatio: 3/2, position: 'relative', marginTop: 0, marginBottom: 0},
										(editMode == 1) ? {flex: 1} : (editMode == 2) ? {display: 'none'} : {flex: 1}]}>
				<View style={styles.flashcardInnerView} onPress={{}}>
					<View style={styles.flashcardTextView}>
						{ 
							editMode == 0 ? ( <Markdown>{deckJson?.["cards"]?.[cardNumber]?.["front"]}</Markdown>):
							editMode == 1 ? ( <TextInput multiline={true} onChangeText={(text) => storeNewContent(text, "front")} >{deckJson?.["cards"]?.[cardNumber]?.["front"]}</TextInput> ):
							(<></>)
						}
					</View>
				</View>
				<EditButton callback={editButtonPress}
										cardID={1}
										name={(editMode==1) ? "Save" : "edit"} 
										editButtonStyle={(editMode==1) ? {backgroundColor: '#3d9470'} : {}} 
										customStyle={{position: 'absolute', backgroundColor: 'pink'}}
				/>
			</View>

			<View style={[{ ...styles.flashcardView, aspectRatio: 3/2, position: 'relative', marginTop: 0, marginBottom: 0}, 
										(editMode == 2) ? {flex: 1} : (editMode == 1) ? {display: 'none'} : {flex: 1}]}>
				<View style={styles.flashcardInnerView} onPress={{}}>
					<View style={styles.flashcardTextView}>
						{ 
							editMode == 0 ? ( <Markdown>{deckJson?.["cards"]?.[cardNumber]?.["back"]}</Markdown> ):
							editMode == 2 ? ( <TextInput multiline={true} onChangeText={(text) => storeNewContent(text, "back")} >{deckJson?.["cards"]?.[cardNumber]?.["back"]}</TextInput> ):
							(<></>)
						}
					</View>
				</View>
				<EditButton callback={editButtonPress}
										cardID={2}
										name={(editMode==2) ? "Save" : "edit"} 
										editButtonStyle={(editMode==2) ? {backgroundColor: '#3d9470'} : {}} 
										customStyle={{position: 'absolute', backgroundColor: 'pink'}}
				/>
				<DeleteButton callback={deleteButtonPress}
										name={"Delete"}
										customStyle={{position: 'absolute', backgroundColor: 'lightgrey', padding: 5, margin: 15}}
				/>
			</View>
		</View>
  );
};

const EditButton = ({name, editButtonStyle, callback, cardID, customStyle}) => {
	const whenPressed = () => {
		if(name == "Save"){
			callback(0);
			return
		}
		callback(cardID);
	}
	return (
		<TouchableOpacity style={{position: 'absolute', backgroundColor: 'pink', padding: 10, margin: 5, top: 0, right: 0, borderRadius: '50vh', borderWidth: 2.5, alignContent: 'center',...customStyle,}} onPress={() => whenPressed()}>
			<Text numberOfLines={1} adjustsFontSizeToFit style={{...styles.midText02}}> {name}</Text>
		</TouchableOpacity>
	)
}

const DeleteButton = ({name, callback, cardID, customStyle}) => {
	const whenPressed = () => {
		callback();
	}
	return (
		<TouchableOpacity style={{ position: 'absolute', backgroundColor: 'pink', padding: 10, margin: 5, bottom: 0, right: 0, borderRadius: '50vh', borderWidth: 2.5, alignContent: 'center',...customStyle,}} onPress={() => whenPressed()}>
			<Text numberOfLines={1} adjustsFontSizeToFit style={{...styles.midText02}}> {name}</Text>
		</TouchableOpacity>
	)
}

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


const EditScreen = ({route}) => {
	const { deck } = route.params;
	const navigation = useNavigation();
	const [deckJson, setDeckJson] = useState();
	const [refreshProp, setRefreshProp] = useState(0);

	useEffect(() => {
    (async () => {
      try {
        const deckAsJson = await AsyncStorage.getItem(deck); 
        const deckParsed = JSON.parse(deckAsJson);
        setDeckJson(deckParsed);
      } catch (error) {
        console.log('Failed to retrieve data from storage', error);
      }
    })();
  }, []);

	const saveNewCardsToAsncStorage = async (newJson) => {
			try{
				const serializedJson = JSON.stringify(newJson);
				await AsyncStorage.setItem(deck, serializedJson);
				console.log(serializedJson);
			}catch(err){
				console.log("Could not save edited cards to async storage", err)
			}
	}

	const refresh = () => {
		setRefreshProp(refresh + 1);
	}

	if(!deckJson) return <></>
	return(
		<ScrollView key={refreshProp} style={{backgroundColor: 'beige'}}>
			{deckJson?.['cards'].map((card, index) => {
				return(<BothMiniFlashCards key={index} deckJson={deckJson} cardNumber={index} refreshCallback={refresh} saveNewCardsToAsncStorage={saveNewCardsToAsncStorage}/>)
				// return(<BothMiniFlashCards frontCardContent={card["front"]} backCardContent={card["back"]} deckJson={deckJson}/>)
			})}
		</ScrollView>
	) 
}

export default EditScreen;