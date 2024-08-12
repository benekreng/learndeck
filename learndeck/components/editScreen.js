import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect, useContext} from 'react';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

//component which shows the front and back side of a flash card next besides each other
const BothMiniFlashCards = ({refreshCallback, saveNewCardsToAsncStorage, deckJson, frontCardContent, backCardContent, cardNumber, side, additionalStyle, editButtonText="edit"}) => {
	const { theme, updateTheme } = useContext(ThemeContext);
	const [editMode, setEditMode] = useState(0);

	//stores new card value
	const storeNewContent = (text, side) => {
		deckJson["cards"][cardNumber][side] = text; 
	}

	//alert to ask user if he is sure if the wants to delete the card
	const deleteButtonPress = () => {
		Alert.alert("Are you sure you want to delete this card", "", [
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
		saveNewCardsToAsncStorage(deckJson);
		refreshCallback();
	}

	//this handles the press of the edit and save button of one side of a card depending on the cardID passed
	const editButtonPress = (cardID, action) => {
		setEditMode(cardID)

		//if the card id was 0 then the button has been pressed in save mode
		if(cardID == 0){
			saveNewCardsToAsncStorage(deckJson)
		}
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
										editButtonStyle={(editMode==1) ? {backgroundColor: theme.positive} : {}} 
										customStyle={{position: 'absolute', backgroundColor: theme.negative}}
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
										editButtonStyle={(editMode==2) ? {backgroundColor: theme.positive} : {}} 
										customStyle={{position: 'absolute', backgroundColor: theme.negative}}
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
	const { theme, updateTheme } = useContext(ThemeContext);
	const whenPressed = () => {
		if(name == "Save"){
			callback(0);
			return
		}
		callback(cardID);
	}

	return (
		<TouchableOpacity style={{position: 'absolute', backgroundColor: theme.negative, padding: 10, margin: 5, top: 0, right: 0, borderRadius: 50, borderWidth: 2.5, alignContent: 'center',...customStyle,}} onPress={() => whenPressed()}>
			<Text numberOfLines={1} adjustsFontSizeToFit style={{...styles.midText02}}> {name}</Text>
		</TouchableOpacity>
	)
}

const DeleteButton = ({name, callback, cardID, customStyle}) => {
	const { theme, updateTheme } = useContext(ThemeContext);
	const whenPressed = () => {
		callback();
	}
	return (
		<TouchableOpacity style={{ position: 'absolute', backgroundColor: theme.negative, padding: 10, margin: 5, bottom: 0, right: 0, borderRadius: 50, borderWidth: 2.5, alignContent: 'center',...customStyle,}} onPress={() => whenPressed()}>
			<Text numberOfLines={1} adjustsFontSizeToFit style={{...styles.midText02}}> {name}</Text>
		</TouchableOpacity>
	)
}


//the edit screen creates a BothMiniFlashCards component for each flashcard there is in the deck

const EditScreen = ({route}) => {
	const { theme, updateTheme } = useContext(ThemeContext);
	const { deckName, deckStorageId, onGoBack} = route.params;
	const [deck, setDeck] = useState(deckName);
	const [storageId, setDeckStorageID] = useState(deckStorageId);
	const navigation = useNavigation();
	const [deckJson, setDeckJson] = useState();
	const [refreshProp, setRefreshProp] = useState(0);
	const [newName, setNewName] = useState(deck);
	const [isLoaded, setIsLoaded] = useState(false);

	//updates header style on theme change
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

	//this is the logic to change the title name of a deck	
	const changeName = async () => {
		//changeName is called every time the user leaves the screen, if the name changed, the name is changed
		if (newName === deck) {
			return Promise.resolve("New name is the same as the old name. No change needed.");
		}
		
		const oldKeyName = 'carddeck_' + deck;
		const newKeyName = 'carddeck_' + newName;
	
		try {
			//if key already exist abort
			const existingNewDeckJson = await AsyncStorage.getItem(newKeyName);
			if (existingNewDeckJson !== null) {
				throw new Error("A deck with the new name already exists.");
			}
			//fetches deck from storage and saves it under a new key. The old key gets deleted
			const existingDeckJson = await AsyncStorage.getItem(oldKeyName);
			if (existingDeckJson === null) {
				return Promise.resolve("No existing deck found with the name: " + deck);
			}

			await AsyncStorage.setItem(newKeyName, JSON.stringify(deckJson));
			// await AsyncStorage.setItem(newKeyName, existingDeckJson);
			await AsyncStorage.removeItem(oldKeyName);
			setDeck(newName);
			setDeckStorageID(newKeyName);
			return Promise.resolve("Deck renamed successfully.");
	
		} catch (error) {
			// return Promise.reject(error);
			Alert.alert("Name already exist");
		}
	};

	//on load
	useEffect(() => {
		//when deck is null then the create new deck function was used
		if(deck == null){
			//logic to create a new card deck form scratch if deck is null
			(async () => {
					const defaultDeckJson = {
						"statistics": {
							"errorsPerRun": []
						},
						"cards": [
							{
								"front": "Enter your question here",
								"back": "Enter your answer here",
								"statistics": [0, 0, 0]
							}
						]
					}
					setDeckJson(defaultDeckJson);

					//logic to create a unique title that does not exist already. If untitled1 exist it will call it unitlted2 etc
					const allKeys = await AsyncStorage.getAllKeys();
					const untitledList = allKeys.filter(item => item.toLowerCase().includes("untitled"));

					const numbers = untitledList.map(item => {
						const match = item.match(/untitled(\d+)/i);
						return match ? parseInt(match[1]) : null;
					}).filter(num => num !== null);
					const highestNumber = numbers.length > 0? Math.max(...numbers) + 1 : 0;
					const newUntitledName = `untitled${highestNumber}`;
					const newUntitledStorageKey = `carddeck_${newUntitledName}`;

					setDeck(newUntitledName);
					setNewName(newUntitledName);
					setDeckStorageID(newUntitledStorageKey);
					if(typeof newUntitledStorageKey !== "string"){
						console.log("newUntitledStorageKey is not a string", newUntitledStorageKey)
						return
					}
					try{
						await AsyncStorage.setItem(newUntitledStorageKey, JSON.stringify(defaultDeckJson));
					}catch(err){
						console.log("failed to insert defaultDeckJson into async storage", err)
					}
					setIsLoaded(true);
					return;
			})();
		}else{
			//if deck is not null then the user wants to edit the deck. Loading it in here
			(async () => {
				try {
					const deckAsJson = await AsyncStorage.getItem(deckStorageId); 
					const deckParsed = JSON.parse(deckAsJson);
					setDeckJson(deckParsed);
				} catch (error) {
					console.log('Failed to retrieve data from storage', error);
				}
				setIsLoaded(true);
			})();
		}
  }, []);

	//save new card to async storage
	const saveNewCardsToAsncStorage = async (newJson) => {
			try{
				const serializedJson = JSON.stringify(newJson);
				await AsyncStorage.setItem(storageId, serializedJson);
				refresh();
			}catch(err){
				console.log("Could not save edited cards to async storage", err)
			}
	}

	//force refresh
	const refresh = () => {
		setRefreshProp(refreshProp + 1);
	}
	
	//and a new card and save card deck object to async storage
	const addNewCard = async () => {
		const newCard = {
			"front": "Edit Front",
			"back": "Edit Back",
			"statistics": [0, 0, 0]
		}
		deckJson["cards"].unshift(newCard);
		await saveNewCardsToAsncStorage(deckJson);
		refresh();
	}

  const handleGoBack = () => {
    navigation.navigate('Card Decks', { refresh: true });
  };

	if(!deckJson || !isLoaded) return <Text>Loading: {String(!isLoaded)}</Text>
	return(
		<>
		<ScrollView key={refreshProp} style={{backgroundColor: theme.primary, position: 'relative'}}>
			<View style={{alignItems: 'center', padding: 10}}>
				<Text>Edit name:</Text>
				<View style={{borderWidth: 2}}>
					<TextInput returnKeyType="done" value={newName} onChangeText={setNewName} onSubmitEditing={changeName} style={{fontSize: 20, padding: 5}}></TextInput>
				</View>
			</View>
			{deckJson?.['cards']?.map((card, index) => {
				return(<BothMiniFlashCards key={index} deckJson={deckJson} cardNumber={index} refreshCallback={refresh} saveNewCardsToAsncStorage={saveNewCardsToAsncStorage}/>)
			})}
		</ScrollView>
    <TouchableOpacity onPress={addNewCard} 
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

export default EditScreen;
