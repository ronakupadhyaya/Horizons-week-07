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
    this.props.navigation.navigate('Loginin');
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
  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  register(){
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: self.state.username,
        password: self.state.password,
      })
    })
    .then((responseJson) => {
        self.props.navigation.navigate('Login');
    })
    .catch((err) => {
      console.log('error', err)
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={()=>this.register()}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LogininScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      failedLogin: false
    }
  }
  static navigationOptions = {
    title: 'Login'
  };

  register(){
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: self.state.username,
        password: self.state.password,
      })
    })
    .then((response) => {
      console.log(response.status);
        if(response.status === 200) {
            self.props.navigation.navigate('Home');
        } else {
          this.setState({failedLogin: true})
        }
    })
    .catch((err) => {
      console.log('error', err)
    });

  }

  render() {
    return (
      <View style={styles.container}>
          <Text>{this.state.failedLogin? 'Failed Login!': ''}</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={()=>this.register()}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class HomeScreen extends React.Component {
  //navigationOptions code
  static navigationOptions = (props)=>({
    title: 'Home',
    headerRight: <TouchableOpacity onPress={()=>props.navigation.navigate('Message')}><Text>Message</Text></TouchableOpacity>
  })
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }
  componentDidMount() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then(response => {
        return response.json();
      })
      .then((data) =>
        self.setState({users: data.users})
      );
  }
  sendM(id, name) {
    fetch('https://hohoho-backend.herokuapp.com/messages',
          {method: 'POST',
           headers: {
            "Content-Type": "application/json"
           },
           body: JSON.stringify({
             to: id
            })
          })
        .then(response => {
          console.log(response.status);
          if(response.status === 200) {
            Alert.alert(
              'Sent!',
              'Hohoho to ' + name,
              [{text: 'OK'}] // Button
            )
          }
        })
        .catch(err => console.log('err', err))
  }
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView renderRow={((item) => (<View>
          <Text style={[styles.button, styles.buttonRed]} onPress={()=> this.sendM(item._id, item.username)}>{item.username}</Text>
      </View>) )}
       dataSource={ds.cloneWithRows(this.state.users)}
        ></ListView>
    )
  }
}

class MessageScreen extends React.Component {
  //navigationOptions code
  static navigationOptions = {
    title: 'Message'
  };
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }
  componentDidMount() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/messages')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data)
        self.setState({messages: data.messages})
      });
  }
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView renderRow={((item) => (<View style={{borderColor: 'gray', borderWidth: 2}}>
          <Text style={[styles.welcome]} >To: {item.to.username}</Text>
          <Text style={[styles.welcome]} >Hohoho</Text>
          <Text style={[styles.welcome]} >From: {item.from.username}</Text>
      </View>) )}
       dataSource={ds.cloneWithRows(this.state.messages)}
        ></ListView>
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
  Loginin: {
    screen: LogininScreen
  },
  Home: {
    screen: HomeScreen
  },
  Message: {
    screen: MessageScreen
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
