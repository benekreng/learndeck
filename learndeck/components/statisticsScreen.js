
import { Text, View, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useState, useEffect, useContext} from 'react';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles/mainStyles'
import { ThemeContext } from '../styles/theme';

const StatisticsScreen = ({route}) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  //load from storage to memory to read and write the statistics
  const { deckName, deckStorageId} = route.params;
  const [deckJson, setDeckJson] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [percentages, setPercentages] = useState([0, 0, 0]);
  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.primary },
    });
  }, [navigation, theme]);

  useEffect(() => {
    (async () => {
      try {
        console.log("this is the storage id right??", deckStorageId);
        const deckAsJson = await AsyncStorage.getItem(deckStorageId); 
        const deckParsed = await JSON.parse(deckAsJson);
        console.log('this json has been fetched from the database ', deckAsJson)
        const lastCardIndex = deckParsed['statistics']['errorsPerRun'].length;
        setDeckJson(deckParsed);

        let correctSum = 0;
        let unsureSum = 0;
        let wrongSum = 0;

        const errorList = deckParsed?.['statistics']?.['errorsPerRun'];
        for(i = 0; i < errorList.length; i++){
          correctSum += Number(errorList[i][0]);
          console.log(correctSum)
          unsureSum += Number(errorList[i][1]);
          wrongSum += Number(errorList[i][2]);
        }

        let correctPercentage = Math.floor((correctSum / (unsureSum + wrongSum + correctSum))*100);
        console.log(correctSum, '/', unsureSum, '+', wrongSum)
        let unsurePercentage = Math.floor((unsureSum / (correctSum + wrongSum + unsureSum))*100); 
        let wrongPercentage = Math.floor((wrongSum / (correctSum + unsureSum + wrongSum))*100); 
        setPercentages([correctPercentage, unsurePercentage, wrongPercentage]);

        if(lastCardIndex == 0){
          Alert.alert("You have to absolve at least one study to see statistics", "", [
            {
              text: 'Ok',
              onPress: () => {
                navigation.goBack()
              }
            }
          ])
        }else{
          setIsLoaded(true)
        }     
      } catch (error) {
        console.log('Failed to retrieve data from storage', error);
      }

    })();
  }, []);

  if(!isLoaded) return <View style={{backgroundColor: theme.primary, flex: 1}}></View>
  return (
    <View style={{backgroundColor: theme.primary, flex: 1}}>
      <View style={{...styles.statisticsBox}}>
        <Text style={{...styles.midText02, alignSelf: 'center', padding: 20}}>This Session</Text>
        <View numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: theme.positive, borderRadius: '50vh'}}>
          <Text style={{...styles.midText00}}> Correct: {percentages[2]} %</Text>
        </View>
        <View numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: 'grey', borderRadius: '50vh'}}>
          <Text style={{...styles.midText00}}> Unsure: {percentages[1]} %</Text>
        </View>
        <View  numberOfLines={1} adjustsFontSizeToFit style={{alignSelf: 'center', padding: 5, margin: 5, backgroundColor: theme.negative, borderRadius: '50vh'}}>
          <Text style={{...styles.midText00}}> Wrong: {percentages[0]} %</Text>
        </View>
        <Text style={{alignSelf: 'center', padding: 20, paddingBottom: 0}}>All Sessions Graph</Text>
        <AllStatisticsGraph perRunStatisticsArray={deckJson}/>
      </View>
    </View>
  ) }


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

export default StatisticsScreen;