import { StyleSheet } from 'react-native';
import { theme } from '../styles/theme.js';

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
    // backgroundColor: theme.negative, 
    textAlign: 'center', 
    justifyContent: "center", 
    alignItems: 'center',
    padding: 20,
    borderRadius: 50, 
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
    borderRadius: 50, 
    shadowOffset: { width: 3, height: 3 }, 
    flexGrow: 1, 
    margin: 10, 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  flashcardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  flashcardInnerView: {
    flex: 1,
    margin: 10,
    backgroundColor: 'pink', 
    // backgroundColor: theme.negative,
    borderRadius: 20,
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
    borderRadius: 50,
    backgroundColor: 'lightgrey',
    borderRadius: 50, 
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
	statisticsBox: {
		...styleElements.borderAndShadow,
		flex: 1, 
		backgroundColor: 'lightgrey', 
		margin: 20, 
		marginTop: 5, 
		borderRadius: 10, 
		justifyContent: 'space-around'
	},
  dailyGoalOuterView: {
		...styleElements.borderAndShadow,
  },
  borderAndShadowDefault: {
		...styleElements.borderAndShadow,
  },
});

export default styles;