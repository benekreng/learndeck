import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, ImageBackground, ImageUri, Image, SafeAreaView, TextInput, Alert} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {useState,useRef, useImperativeHandle, forwardRef, useEffect} from 'react';
import React from 'react';


const HomeScreen = () => {
	const navigation = useNavigation();
	return(
		<Text>Home Screen</Text>
	) 
}

export default HomeScreen;