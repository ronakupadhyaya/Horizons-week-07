import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  AsyncStorage,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('RealLogin')
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

  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    };
  }

  register(){
    var self = this;
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
  console.log(responseJson);
  this.props.navigation.goBack();
})
  }

  render() {
        //const self = this;
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput style={{height: 40}} placeholder="Enter your username" onChangeText={(text)=>this.setState({username: text})} />
        <TextInput style={{height: 40}} secureTextEntry={true} placeholder="Enter Password" onChangeText={(text)=>this.setState({password: text})} />
        <TouchableOpacity onPress={()=>this.register()}>
          <View style={styles.button}>
            <Text>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

class RealLoginScreen extends React.Component {
  static navigationOptions = {
  title: 'Login'
  };

  constructor(){
    super();
    this.state={
      username: '',
      password: ''
    }
  }

  realLoginPress(){
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
        console.log(responseJson);
        this.props.navigation.navigate('Users');
      })
      .catch((err)=>(console.log('Error!-', err)))
  }

  render(){

    return(
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
        <TextInput style={{height: 40, width: 200}} placeholder="Enter your username" onChangeText={(text)=>this.setState({username: text})} />
        <TextInput style={{height: 40, width: 200}} secureTextEntry={true} placeholder="Enter Password" onChangeText={(text)=>this.setState({password: text})} />
        <TouchableOpacity onPress={()=>this.realLoginPress()}>
          <View style={styles.button}>
            <Text>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

class Users extends React.Component {
  static navigationOptions = {
  title: 'Users'
  };

  constructor(){
    console.log('Inside component');
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2)=>(r1 !== r2)
    });
    this.state = {
      users: ds.cloneWithRows([]),
    };
    this.touchUser = this.touchUser.bind(this);

  }

  componentDidMount(){
    const self = this;
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET'
    })
    .then(function(resp){
      return resp.json();
    })
    .then(function(json){
      console.log(json.users);
      const ds2 = new ListView.DataSource({
        rowHasChanged: (r1, r2)=>(r1 !== r2)
      });
      self.setState({
        users: ds2.cloneWithRows(json.users),
      })
    })
  }

  touchUser(user){
    console.log('In touch user - ', user);
    fetch('https://hohoho-backend.herokuapp.com/messages',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then(function(resp){
      return resp.json();
    })
    .then(function(json){
      if(json.success){
        Alert.alert(
          'Success',
          'Your Ho Ho Ho! to' + user.username + ' has been sent',
          [{text: 'Cool'}] // Button
        )}

    })
    .catch(function(err){
      console.log(err);
    })


  }

  render(){
    return (
      <View style={styles.container}>
        <ListView renderRow={(user)=>(<TouchableOpacity onPress={this.touchUser(user)}><View style={{alignItems: 'center'}}><Text>{user.username}</Text></View></TouchableOpacity>)} dataSource={this.state.users}/>
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
  RealLogin: {
    screen: RealLoginScreen,
  },
  Users: {
    screen: Users,
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
