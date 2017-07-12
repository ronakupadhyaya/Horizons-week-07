import { Dimensions, StyleSheet } from 'react-native';

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F2'
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#FFF9F9'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    // color: '#333333',
    marginBottom: 5
  },
  textBig: {
    fontSize: 40,
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold'
  },
  button: {
    // alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    width: win.width/2
  },
  buttonRed: {
    backgroundColor: '#FF585B'
  },
  buttonBlue: {
    backgroundColor: '#2EC0DD',
    width: win.width/2,
    borderRadius: 3
    // color: '#ffffff'
  },
  buttonGreen: {
    backgroundColor: '#23C6A3'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  inputBox: {
    borderColor: '#C1C1C1',
    height: 40,
    width: win.width - 40,
    borderRadius: 3,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 2,
    display: 'block',
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  user: {
    textAlign: 'center'
  },
  message: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#4AC9BA',
    borderRadius: 3,
    padding: 10,
  },
  userWrapper: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    borderRadius: 3,
    backgroundColor: '#4AC9BA'
  }
});

export default styles;
