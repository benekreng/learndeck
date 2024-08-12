import { Text, TouchableOpacity} from 'react-native';
import React from 'react';

import styles from '../styles/mainStyles'

//button component used throughout the app
const ButtonElement = ({name, style, textStyle, onPress, handleFeedback}) => {
	const whenPressed = () => {
		onPress?.();
		handleFeedback?.(name);
	}
	return (
		<TouchableOpacity style={{...{
			//set padding as min size
			padding: 7,
			backgroundColor: 'lightgrey',
			shadowOffset: { width: 6, height: 6 }, 
			shadowColor: 'rgb(71, 71, 68)', 
			shadowOpacity: 0.75, 
			shadowRadius: 0, 
			borderWidth: 2,
			borderRadius: 50, 
			shadowOffset: { width: 3, height: 3 }, 
			flexGrow: 1, 
			margin: 10, 
			alignItems: 'center', 
			justifyContent: 'center'
		}, ...style}} onPress={whenPressed}>
			<Text numberOfLines={1} adjustsFontSizeToFit style={{...styles.midText02, ...textStyle}}> {name} </Text>
		</TouchableOpacity>
	)
}

export default ButtonElement;