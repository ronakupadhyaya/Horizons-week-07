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
  AsyncStorage,
  RefreshControl
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper';
import styles from './styles';
export default class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      password: '',
      username: '',
      message:''
    }
  };
  static navigationOptions = {
    title: 'Login Page'
  };
  login(username, password){
    if(username.split('').join('')!=='' && password.split('').join('')!==''){
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success){
          AsyncStorage.setItem('user', JSON.stringify({
            username: this.state.username,
            password: this.state.password
          }));
          this.props.navigation.navigate('Swiper');
        } else {
          console.log(responseJson);
          this.setState({message:responseJson.error});
        }
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }
  componentDidMount(){
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.login(username, password); //the return here is very very very important!!!
        }
        // Don't really need an else clause, we don't do anything in this case.
      })
      .catch(err => { console.log(err) })
  }
  render(){
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={ () => {this.login(this.state.username,this.state.password)} } style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <Text>{this.state.message}</Text>
      </View>
    )
  }
};
