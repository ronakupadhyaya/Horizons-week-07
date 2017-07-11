import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: 'username',
      password: 'password',
      message: 'message'
    }
  }
  static navigationOptions = {
    title: 'Home'
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
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
       if(responseJson.success){
         this.props.navigation.navigate('Users')
       }else{
        //  this.setState({message: 'Could not login'})
        //  <Text> {this.state.message} </Text>
        alert('Could not login!')
       }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('error', err);
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textBox}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={ () => {this.press()} }>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: 'username',
      password: 'password'
    }
  }
  static navigationOptions = {
    title: 'Register'
  };
  press() {
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
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
       if(responseJson.success){
         this.props.navigation.navigate('Login')
       }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textBox}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.press()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  //navigationOptions code
  static navigationOptions = {
    title: 'Users' //you put the title you want to be displayed here
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
  }
  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
       if(responseJson.success){
         Alert.alert(
          'Success',
          'Sent!',
          [{text: 'Your Ho Ho Ho! to '+ user.username + ' has been sent!'}] // Button
        )
       }else{
         alert('Your Ho Ho Ho! to '+ user.username + ' could not be sent')
       }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('error', err);
    });
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
            <Text>{rowData}</Text>
          </TouchableOpacity>}
      />
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
  Users: {
    screen: UsersScreen
  }
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
  },
  textBox: {
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    borderStyle: 'solid'
  }
});
