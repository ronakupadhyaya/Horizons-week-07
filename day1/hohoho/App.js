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
  StatusBar,
  RefreshControl
} from 'react-native';
import { StackNavigator } from 'react-navigation';

//Screens
class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  static navigationOptions = {
    title: 'Login'
  };

  press() {
    if (this.state.username && this.state.password) {
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
          Alert.alert('Success!', 'Login successful')
          this.props.navigation.navigate('Users');
        })
        .catch((err) => {
          Alert.alert('Error', err.message);
        });
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Text style={styles.welcome}>Welcome to HoHoHo!</Text>
        <TextInput
          style={[styles.button, styles.input]}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({ username: text })}
        />
        <TextInput
          style={[styles.button, styles.input]}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
        />
        <TouchableOpacity onPress={() => { this.press() }} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => { this.register() }}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  static navigationOptions = {
    title: 'Register'
  };

  register() {
    if (this.state.username && this.state.password) {
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
          Alert.alert('Success!', 'Registration successful')
          this.props.navigation.goBack();
        })
        .catch((err) => {
          Alert.alert('Error', err.message);
        });
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={[styles.button, styles.input]}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({ username: text })}
        />
        <TextInput
          style={[styles.button, styles.input]}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
        />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={() => this.register()}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([{ username: 'Loading...' }]),
      refreshing: false
    };
    this.fetchData();
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={() => { navigation.state.params.onRightPress() }} />
  });

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: () => this.messages()
    })
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  fetchData() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        });
      })
      .catch((err) => {
        Alert.alert('Error', err.message);
      });
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

  touchUser(id) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: id
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        Alert.alert('Success!', 'Message sent')
      })
      .catch((err) => {
        Alert.alert('Error', err.message);
      });
  }

  render() {
    return (
      <View>
        <StatusBar hidden={true} />
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableOpacity onPress={() => this.touchUser(rowData._id)}>
              <Text style={styles.user}>{rowData.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([{
        from: { username: 'Loading...' },
        to: { username: 'Loading...' },
        timestamp: 'Loading...'
      }]),
      refreshing: false
    };
    this.fetchData();
  }

  fetchData() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        });
      })
      .catch((err) => {
        Alert.alert('Error', err.message);
      });
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  render() {
    return (
      <View>
        <StatusBar hidden={true} />
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <View>
              <Text style={styles.message}>From: {rowData.from.username}</Text>
              <Text style={styles.message}>To: {rowData.to.username}</Text>
              <Text style={styles.timestamp}>{rowData.timestamp}</Text>
            </View>

          )}
        />
      </View>
    );
  }
}

//Navigator
export default StackNavigator({
  Welcome: {
    screen: WelcomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UsersScreen
  },
  Messages: {
    screen: MessagesScreen
  }
}, { initialRouteName: 'Welcome' });

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
  input: {
    height: 40
  },
  user: {
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  message: {
    fontSize: 17,
    padding: 5
  },
  timestamp: {
    padding: 5,
    fontSize: 15,
    fontStyle: 'italic',
    color: 'grey',
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  }
});
