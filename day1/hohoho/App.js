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
  constructor(){
    super();
    this.state = {username: "", password: ""};
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
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        this.props.navigation.navigate('Users');
      }else{
        alert("Database error!");
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err);
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
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
  constructor(){
    super();
    this.state = {username: "", password: ""};
  }

  static navigationOptions = {
    title: 'Register'
  };

  onSubmit(){
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        this.props.navigation.goBack();
      }else{
        alert("Database error!");
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{height: 40}}
          placeholder="username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={() => this.onSubmit()}>
          <Text style={[styles.button, styles.buttonBlue]}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Users extends React.Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((res) => res.json())
    .then((resJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(resJson.users)
      })
    });
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: () => this.messages()
    })
  }

  touchUser(user){
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((res) => res.json())
    .then((resJson) => {
      if(resJson.success){
        Alert.alert(
          'Message',
          'Message to ' + user.username + ' was sent!',
          [{text: 'OK'}] // Button
        )
      }else{
        Alert.alert(
          'Message',
          'Message to ' + user.username + ' failed to send!',
          [{text: 'OK'}] // Button
        )
      }
    })
    .catch((err) => console.log(err));
  }

  messages(){
    this.props.navigation.navigate('Messages');
  }

  render(){
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
              <Text>{rowData.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

class Messages extends React.Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((res) => res.json())
    .then((resJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(resJson.messages)
      })
    });
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  static navigationOptions = {
    title: 'Messages' //you put the title you want to be displayed here
  };

  render(){
    return(
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <View>
              <Text>{rowData.timestamp}</Text>
              <Text>From: {rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>HoHoHo!</Text>
            </View>
          )}
        />
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
  Users: {
    screen: Users,
  },
  Messages: {
    screen: Messages,
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
