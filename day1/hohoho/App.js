import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  ActivityIndicator,
  Modal
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import styles from './styles';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super();
    this.state = {
      loginFormVisible: false,
      username: '',
      password: '',
      loading: false
    };
  }

  toggleLoginModal(bool) {
    this.setState({ loginFormVisible: bool });
  }
  register() {
    this.props.navigation.navigate('Register');
  }
  loginUser() {
    alert("Logging in as "+this.state.username);
  }

  render() {
    return (
      <View style={styles.container}>

        <Modal
          animationType="slide"
          transparent="false"
          visible={this.state.loginFormVisible}
          onRequestClose={() => this.toggleLoginModal(false)}>

          <View style={styles.container}>
            <TextInput
              style={styles.formInput}
              placeholder="Username"
              onChangeText={text => this.setState({ username: text })}
              value={this.state.username}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Password"
              onChangeText={text => this.setState({ password: text })}
              value={this.state.password}
            />
            <TouchableOpacity>
              <Button
                onPress={this.loginUser.bind(this)}
                title="Login"
                color="#2ECC40"
                accessibilityLabel="Log into HoHoHo with the entered credentials"
              />
            </TouchableOpacity>

          </View>
          </Modal>

        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => this.toggleLoginModal(true) } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>

        {this.state.loading &&
          <View style={styles.loadingScreen}>
            <View style={styles.darkOverlay}><Text></Text></View>
            <ActivityIndicator size='large' />
          </View>}

      </View>
    );
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };

  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      loading: false
    };
  }

  registerUser() {
    this.setState({ loading: true })
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(resp => resp.json())
    .then(() => this.props.navigation.goBack())
    .catch(err => alert("An error occurred while trying to register: " + err))
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.formInput}
          placeholder="Username"
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />

        <TextInput
          style={styles.formInput}
          placeholder="Password"
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
        />

        <TouchableOpacity>
          <Button
            onPress={this.registerUser.bind(this)}
            title="Register"
            color="#0074D9"
            accessibilityLabel="Register with the entered credentials"
          />
        </TouchableOpacity>

        {this.state.loading &&
          <View style={styles.loadingScreen}>
            <View style={styles.darkOverlay}><Text></Text></View>
            <ActivityIndicator size='large' />
          </View>}

      </View>


    );
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
}, { initialRouteName: 'Login' });
