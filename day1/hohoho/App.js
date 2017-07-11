import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  Modal,
  TouchableHighlight
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  state = {
    modalVisible: false,
    username: '',
    passowrd: ''
  }
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {

      if (responseJson.success){
        alert('Logged In!')
      } else{
        console.log("hi", responseJson)
        alert('Some Error Logging In ' + responseJson.error)
      }
    })
    .catch((err) => {
      alert('Some Error Logging In')
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>

        <TouchableHighlight onPress={() => { this.setModalVisible(true) }} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableHighlight>

        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
            <View style={styles.container}>
              <View>
                <TextInput
                  style={{height: 20, width: 300, margin: 5, textAlign:'center'}}
                  placeholder="Enter desired username"
                  onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                  style={{height: 20, width: 300, margin: 5,textAlign:'center'}}
                  secureTextEntry={true}
                  placeholder="Enter desired password"
                  onChangeText={(text) => this.setState({password: text})}
                />
                <TouchableOpacity style={[styles.button, styles.buttonRed]}
                  onPress={() => {this.press()} }>
                  <Text style={styles.buttonLabel}> Login </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {
                  this.setModalVisible(!this.state.modalVisible)
                  this.register()
                } }>
                  <Text style={styles.buttonLabel}>Tap to Register</Text>
                </TouchableOpacity>


            </View>
          </View>
        </Modal>



    </View>
  )
}
}

class RegisterScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  validate(){
    if (this.state.password.length < 5){
      alert('Password invalid!')
    }else if (this.state.username.length < 5){
      alert('Username invalid!')
    } else{
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {

        if (responseJson.success){
          this.props.navigation.goBack()
          alert('User Saved!')
        } else{
          alert('Error in Saving User!')
        }
      })
      .catch((err) => {
        alert('Error in Saving User!')
      });
    }
  }

  login(){

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{height: 20, margin: 5, textAlign:'center'}}
          placeholder="Enter desired username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 20, margin: 5, textAlign:'center'}}
          secureTextEntry={true}
          placeholder="Enter desired password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonRed]}
          onPress={() => {this.validate()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
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
    fontSize: 36,
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
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
