import { Text, TouchableOpacity} from 'react-native';
import React from 'react';

import styles from '../styles/mainStyles'

const ButtonElement = ({name, style, textStyle, onPress, handleFeedback}) => {
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

export default ButtonElement;