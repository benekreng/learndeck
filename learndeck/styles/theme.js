// theme.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback, useEffect } from 'react';
import { createContext } from 'react';

const defaultTheme = {
  primary: '#f5f5dc',
  negative: '#ffb6c1',
  positive: '#3d9470',
  neutral: '#2D3047',
  text02: '#ffffff',
};

export const ThemeContext = createContext({
  theme: defaultTheme,
  updateTheme: () => {},
});

export function useTheme() {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(()=> {
    (async () => {
      try{
        const selectedColorTheme = await AsyncStorage.getItem("selectedColorTheme");
        const userSettingsJsonString = await AsyncStorage.getItem("userSettings");
        const id = Number(selectedColorTheme)
        const userSettingsJson = JSON.parse(userSettingsJsonString);
        const colorThemeToApply = userSettingsJson["colorthemes"][id];
        updateTheme(colorThemeToApply);
        //on the very first launch of the application where default settings are written to async storage this is a race condition. 
        //we shall catch the error and take the default theme
      }catch(err){
        console.log("error loading the default from async storage", err)
      }
    })()
  }, [])

  const updateTheme = useCallback((newTheme) => {
    setTheme({
      primary: newTheme[0],
      negative: newTheme[1],
      positive: newTheme[2],
      neutral: newTheme[3],
      text02: newTheme[4],
    });
  }, []);

  return { theme, updateTheme };
}