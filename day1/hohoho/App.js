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
  RefreshControl

} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class WelcomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('EnterLogin')
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

class LoginScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      username:'',
      password:'',
      errorMessage:'',
    }
  }
  static navigationOptions = {
    title: 'Login'
  };

  press(){
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
        if (responseJson.success) {
          this.props.navigation.navigate('Users', {username:this.state.username, password:this.state.password})
        }
        else {
          this.setState({errorMessage:responseJson.error})
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'red',fontWeight:'bold'}}>{this.state.errorMessage}</Text>
        <Text>Login Below!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your Username here..."
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40}}
          placeholder="Enter your Password here..."
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonSky]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      username:'',
      password:'',
      errorMessage:'',
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  press(){
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
        if (responseJson.success) {
          this.props.navigation.goBack()
        }
        else {
          this.setState({errorMessage:responseJson.error})
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'red',fontWeight:'bold'}}>{this.state.errorMessage}</Text>
        <Text>Register Below!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your Username here..."
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40}}
          placeholder="Enter your Password here..."
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonSky]}>
          <Text style={styles.buttonLabel}>Tap to Submit</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

class UserScreen extends React.Component {
  constructor(){
    super();
    let ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1._id !== r2._id)
    });
    this.state = {
      users: ds.cloneWithRows([]),
      errorMessage:'',
    }
  }
  componentWillMount() {
    console.log('mounting');
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1,r2) => (r1._id !== r2._id)
          });
          this.setState({users: ds.cloneWithRows(responseJson.users)})
          }
          else {
            this.setState({errorMessage:responseJson.error})
          }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  sendHo(toUser,id) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log('it was a success the whole time');
          Alert.alert('Success', 'Your HoHoHo to ' + toUser + ' has been sent!',[{text:'Cool'}])
        }
        else{
          Alert.alert('Unable to send message')
        }
      })
      .catch((err) => {
        console.log('got error');
        Alert.alert(err)
      });
  }

  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => (props.navigation.navigate('Message',{username:props.navigation.state.params.username, password:props.navigation.state.params.password}))} />
  });

  render(){
    return (
      <View style={styles.container}>
        <Text>{this.state.errorMessage}</Text>
        <ListView
          renderRow={ (item) => (
            <View style={{alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.sendHo(item.username, item._id)}>
                <Text>{item.username}</Text>
              </TouchableOpacity>
            </View>
        )}
          dataSource={this.state.users}
          enableEmptySections={true}
        />
      </View>
    )
  }
}

class MessageScreen extends React.Component {
  constructor(){
    super();
    let ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1._id !== r2._id)
    });
    this.state = {
      messages: ds.cloneWithRows([]),
      errorMessage:'',
      refreshing:false,
    }
  }

  static navigationOptions = {
    title: 'Messages',
  };

  fetchData() {
    return fetch('https://hohoho-backend.herokuapp.com/messages?username=' +
      this.props.navigation.state.params.username + '&password=' +
      this.props.navigation.state.params.password)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1,r2) => (r1._id !== r2._id)
          });
          this.setState({messages: ds.cloneWithRows(responseJson.messages)})
        }
        else {
          this.setState({errorMessage:responseJson.error})
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  componentWillMount() {
    this.fetchData()
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData().then(() => {
      console.log('made it to then');
      this.setState({refreshing: false});
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>{this.state.errorMessage}</Text>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {this._onRefresh()}}
            />
          }
          renderRow={ (item) => (
            <View style={{alignItems:'center'}}>
              <Text>
                From:{' '}{item.from.username}
              </Text>
              <Text>
                To:{' '}{item.to.username}
              </Text>
              <Text>
                Message:{' '}{item.body}
              </Text>
              <Text>
                When:{' '}{item.timestamp}
              </Text>
            </View>
          )}
          dataSource={this.state.messages}
          enableEmptySections={true}
        />
      </View>
    );
  }
}



//Navigator
export default StackNavigator({
  Login: {
    screen: WelcomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  EnterLogin: {
    screen: LoginScreen,
  },
  Users: {
    screen: UserScreen,
  },
  Message: {
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
    padding:10
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
  buttonSky: {
    backgroundColor: 'skyblue'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
