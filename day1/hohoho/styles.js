//Styles
import {
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e4df',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#e8e4df',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#463628',
  },
  textSmall: {
    fontSize: 12,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    borderColor: '#bbae7a',
    borderWidth: 5,
    width: 300
  },
  buttonRed: {
    backgroundColor: '#e8e4df',
  },
  buttonBlue: {
    backgroundColor: '#e8e4df',
  },
  buttonGreen: {
    backgroundColor: '#e8e4df'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#463628'
  },
  inputField: {
    height: 40,
    borderColor: '#bbae7a',
    borderWidth: 3,
    margin: 5,
    borderRadius: 20,
    paddingLeft: 15,
    width: 300
  },
  image: {
    display: 'block',
    height: 100,
    width: 250,
    resizeMode: 'stretch',
    marginBottom: 20,
    marginTop: 20,
  },
  imageSmall: {
    display: 'block',
    height: 50,
    width: 125,
    resizeMode: 'stretch',
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 80
  },
  textInstruct: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#463628',
  }
});

export default styles
