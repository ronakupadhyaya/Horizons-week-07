import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  AsyncStorage,
} from 'react-native';
import styles from '../Styles/styles'

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  // componentWillMount() {
  //   AsyncStorage.getItem('user')
  //   .then(result => {
  //     const parsedResult = JSON.parse(result);
  //     if (parsedResult.username && parsedResult.password) {
  //       return this.login(parsedResult.username, parsedResult.password)
  //       .then( (responseJson) => {this.props.navigation.navigate('Users')} )
  //     }
  //     else {
  //       console.log('not logging in for some reaosn');
  //     }
  //   })
  //   .catch(error => {console.log('error in mount: ', error);})
  // }

  login(username, password) {
    return fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    .then( response => response.json() )
  }

  callLogin(username, password) {
    this.login(username, password)
    .then( responseJson => {
      responseJson.success ?
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          id: responseJson.user._id,
        }))
        .then( () => {
          this.props.navigation.navigate('Users')
        })
      :
        this.setState({
          message: responseJson.error,
        });
    })
    .catch( error => {console.log('error in login: ', error)})
  }
  navToRegister() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Welcome to HoHoHo!</Text>

        {this.state.message ?
          <Text style={styles.textError}>{this.state.message}</Text> :
          null
        }

        <TextInput
          style={[styles.inputText]}
          placeholder=" Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={[styles.inputText]}
          placeholder=" Password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={ () => {this.callLogin(this.state.username, this.state.password)} }
          style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={ () => {this.navToRegister()} }>
          <Text style={styles.buttonLabel}>Don't have an account? Register here!</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default LoginScreen;
