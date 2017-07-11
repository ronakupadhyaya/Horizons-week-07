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

  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    }
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
    //turn fetch raw response into json you can process
    .then((response) => response.json())
    .then((resp) => {
      console.log('login success obj', resp)
      if(resp.success){
        this.props.navigation.navigate('Users')
      } else{
        alert('incorrect credentials')
      }
    })
    .catch((err) => {
      alert('error in login route', err)
    });
  };

  register() {
    //navigate using navigation
    this.props.navigation.navigate('Register');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={{height: 40, marginLeft: 30}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, marginLeft: 30}}
          placeholder="Enter your password"
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
  //title header
  static navigationOptions = {
    title: 'Register'
  };

  constructor(){
    super();
    this.state={
      username: '',
      password: '',
    }
  };

  register(){
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
    //turn fetch raw response into json you can process
    .then((response) => response.json())
    .then((resp) => {
      console.log('registration object', resp)
      if(resp.success){
        this.props.navigation.navigate('Login')
      } else{
        alert('bad user input')
      }
    })
    .catch((err) => {
      alert('error', err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, marginLeft: 30}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, marginLeft: 30}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.register()}}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Users extends React.Component {
  //title header
  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight:
    <TouchableOpacity onPress={() => (props.navigation.navigate('Messages'))}>
      <Text>Messages</Text>
    </TouchableOpacity>
  });

  constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  };

  componentDidMount(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((resp) => (resp.json()))
    .then((resp) => {
      console.log('retrieving users response', resp)
      this.setState({dataSource: ds.cloneWithRows(resp.users)})
    })
    .catch((err)=>{
      console.log(err)
      alert('error in get request to server', err)
    })
  };

  touchUser(user){
    fetch('https://hohoho-backend.herokuapp.com/messages',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          to: user._id
      }),
    })
    .then((resp)=>(resp.json()))
    .then((resp)=>{
      console.log('retrieving post message response', resp)
      if(resp.success){
        alert('message sent successfully to: '+ user.username)
      } else{
        alert('message sent UNsuccessfully to: '+ user.username)
      }
    })
    .catch((err)=>{console.log('error in post message', err)})
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableOpacity  onPress={this.touchUser.bind(this, rowData)}>
              <Text>{rowData.username}</Text>
            </TouchableOpacity>)}
          enableEmptySections={true}
        />
      </View>
    )
  }
};

class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  }

  constructor(){
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state ={
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((resp) => (resp.json()))
    .then((resp) => {
      console.log('retrieving users messages', resp)
      this.setState({dataSource: ds.cloneWithRows(resp.messages)})
    })
    .catch((err)=>{
      console.log(err)
      alert('error in get message request to server', err)
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
              <View>
                <Text>To: {rowData.to.username}</Text>
                <Text>From: {rowData.from.username}</Text>
                <Text>Message: {rowData.body}</Text>
                <Text>Time: {rowData.timestamp}</Text>
              </View>
            )}
          enableEmptySections={true}
        />
      </View>
    )
  }
}



//Navigator
export default StackNavigator({
  //naviagtion
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
