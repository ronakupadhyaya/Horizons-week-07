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
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('LoginPage')
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  account(){
    fetch('https://hohoho-backend.herokuapp.com/register', {
      // Check the url to see the enteries of the JSON file.
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
         // alert('It works!')
         this.props.navigation.navigate('LoginPage');
       } else {
         alert('Try registering again!')
       }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      alert(err, "Unable to register account. Please try again")
    });
  }

  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        {/* <Text style={styles.textBig}>Register</Text> */}
        <TextInput style={{height: 40, paddingLeft: 20, paddingRight: 20}} placeholder="Register a Username" underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({username: text})}
          />
        <TextInput style={{height: 40, paddingLeft: 20, paddingRight: 20}} secureTextEntry={true} placeholder="Enter a Password" underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({password: text})}
          />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={() =>
          {this.account()}}><Text style={styles.buttonLabel}>Register for an Account!</Text></TouchableOpacity>
      </View>
    )
  }
}

class LoginPageScreen extends React.Component {
  static navigationOptions = {
    title: 'LoginPage'
  };

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  account(){
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
       if(responseJson.success === true){
         alert("Login successful!");
         this.props.navigation.navigate('Users');
       } else {
        //  <Text style={styles.cointainer}>Invalid username or password!</Text>
         alert('Try logging in again!')
       }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      // <Text style={styles.container}>{err} Please try again.</Text>
      alert(err, "Unable to login. Please try again")
    });
  }

  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        {/* <Text style={styles.textBig}>Register</Text> */}
        <TextInput style={{height: 40, paddingLeft: 20, paddingRight: 20}} placeholder="Username" underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({username: text})}
          />
        <TextInput style={{height: 40, paddingLeft: 20, paddingRight: 20}} secureTextEntry={true} placeholder="Password" underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({password: text})}
          />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={() =>
            {this.account()}}><Text style={styles.buttonLabel}>Login!</Text></TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component{
  static navigationOptions =  (props) => ({
    title: 'Users',
    headerStyle: {
      paddingRight: 20,
    },
    headerRight: <TouchableOpacity onPress={() =>
      (props.navigation.navigate('Messages'))}>
      <Text style={{'color': 'dodgerBlue'}}>
          Messages
      </Text>
    </TouchableOpacity>
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
    // this.state = {
    //   dataSource: ds.cloneWithRows([
    //     'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
    //   ])
    // };
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => (response.json()))
    .then((res) => {
      // console.log(res.users);
      this.setState({
        dataSource: ds.cloneWithRows(res.users)
      })
    })
    .catch((err) => {
      console.log(err, "Error")
    })
  }

  send(user) {
   fetch ('https://hohoho-backend.herokuapp.com/messages', {
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
     if(responseJson.success){
       Alert.alert(
         'Success',
         'Your Ho Ho Ho! to ' + user.username + ' has been sent!',
         [{text: 'Dismiss'}]
       )
     } else {
       Alert.alert(
         'Failure',
         'Your Ho Ho Ho! to ' + user.username + ' has not been sent!',
         [{text: 'Dismiss'}]
       )
     }
   })
   .catch((err) => {
     alert(err, 'Error');
   });
 }

  render(){
    return(
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <View style={{borderWidth: 1, borderColor: 'black', borderRadius: 5, alignItems: 'center', padding: 10}}>
            <TouchableOpacity onPress={this.send.bind(this, rowData)}>
              <Text>{rowData.username}</Text>
            </TouchableOpacity>
          </View>}
        />
      </View>
    )
  }
}

class MessageScreen extends React.Component{
  static navigationOptions = {
    title: 'Messages'
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => (response.json()))
    .then((responseJson) => {
        if(responseJson.success){
          this.setState({dataSource: ds.cloneWithRows(responseJson.messages)})
        }
    })
    .catch((err) => {
      console.log(err, "Error")
    })
  }

  render(){
    return(
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <ListView dataSource = {this.state.dataSource} renderRow={(rowData) =>
          <View style={{borderWidth: 1, borderColor: 'black', borderRadius: 5, alignItems: 'center', padding: 10}}>
            <Text>{rowData.to, rowData.from, rowData.body}</Text>
          </View>}/>
      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  LoginPage: {
    screen: LoginPageScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessageScreen,
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
  }
});
