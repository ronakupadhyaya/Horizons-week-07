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
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  login() {
    this.props.navigation.navigate('Login');
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.login()} } style={[styles.button, styles.buttonGreen]}>
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

  constructor() {
    super();
    this.state = {
      username:'',
      password:''
    }
  };

  home() {
    this.props.navigation.navigate('Home');
  }

  press() {
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
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      self.home()
    })
    .catch((err) => {
      console.log(err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height:70}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={text => this.setState({password:text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super();
    this.state = {
      username:'',
      password:'',
      error:'',
    }
  };

  user() {
    this.props.navigation.navigate('Users');
  };

  press() {
    console.log("pressed");
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
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.user();
      } else {
        self.setState({error:"invalid account"});
      }
    })
    .catch((err) => {
      self.setState({error:err});
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height:70}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={text => this.setState({password:text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Submit</Text>
          <Text style={styles.textBig}>{this.state.error}</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

class UsersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  constructor(props) {
    super(props);
    const self = this;
    const ds = new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
    this.state = {
      ds: ds,
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    };
    this._onRefresh.bind(self)();
  };

  messages() {
    this.props.navigation.navigate('Messages');
  };

  componentDidMount() {
    const self = this;
    self.props.navigation.setParams({
      onRightPress: self.messages.bind(self),
    })
  };

  sendHOHOHO(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to:user._id
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Your hohoho data has been sent',
          [{text: 'Awesome'}] // Button
        )
      }
    })
  };

  _onRefresh() {
    const ds = this.state.ds;
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson.users.length !== 0) {
        this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return(
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />}
          dataSource = {this.state.dataSource}
          renderRow = { row => (
            <TouchableOpacity onPress={this.sendHOHOHO.bind(this,row)}>
              <Text>{row.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
};

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };

  constructor(props) {
    super(props);
    const self = this;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      console.log(responseJson.messages);
      if (responseJson.messages.length !== 0) {
        self.setState({dataSource:ds.cloneWithRows(responseJson.messages)})
      }
    })
    .catch(err => {
      console.log(err);
    })
  };

  render() {
    return(
      <View style={styles.container}>
        <ListView
          renderRow = {(row) => (
            <View style={styles.containerFull}>
              <Text>From: {row.from.username}</Text>
              <Text>To: {row.to.username}</Text>
              <Text>Message: {row.body}</Text>
              <Text>When: {row.timestamp}</Text>
            </View>
          )}
          dataSource = {this.state.dataSource}
        />
      </View>
    )
  };
}

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
  },
}, {initialRouteName: 'Home'});


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
