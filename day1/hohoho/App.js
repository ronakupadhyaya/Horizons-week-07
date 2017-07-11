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
import {StackNavigator} from 'react-navigation';

//Screens
class LoginScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    }
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
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    }).then((response) => response.json()).then((responseJson) => {
      //console.log("response",responseJson);
      if (responseJson.success) {
        this.props.navigation.navigate('UsersScreen');
      } else {

        this.setState({message: responseJson.error});
      }
    }).catch((err) => {
      alert(err);
    });

  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>

        <TextInput style={{
          alignItems: 'center',
          width: 300,
          height: 50,
          backgroundColor: 'powderblue'
        }} placeholder="Enter your username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          alignItems: 'center',
          width: 300,
          height: 50,
          backgroundColor: 'powderblue'
        }} placeholder="Enter your password" secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>

        <TouchableOpacity onPress={() => {
          this.press()
        }} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {
          this.register()
        }}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>

        <Text>{this.state.message}</Text>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  signUp() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    }).then((response) => response.json()).then((responseJson) => {
      //console.log("response",responseJson);
      if (responseJson.success) {
        this.props.navigation.goBack();
      } else {
        alert(responseJson.error);
      }
    }).catch((err) => {
      alert(err);
    });

  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={styles.textBig}>Register</Text>

        <TextInput style={{
          alignItems: 'center',
          width: 300,
          height: 50,
          backgroundColor: 'powderblue'
        }} placeholder="Enter your username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          alignItems: 'center',
          width: 300,
          height: 50,
          backgroundColor: 'powderblue'
        }} placeholder="Enter your password" secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>

        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {
          this.signUp()
        }}>
          <Text style={styles.buttonLabel}>Tap to register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      dataSource: ds.cloneWithRows([]),
       refreshing: false
    }
    this.getUsers(ds);
  }
  static navigationOptions = (props) => ({
    title: 'Users',
   headerRight:   <TouchableOpacity onPress={()=> props.navigation.navigate('Messages')}>
          <Text>Messages</Text>
        </TouchableOpacity>
  });

  messages(){
    this.props.navigation.navigate('Messages')
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({to:user._id})
    }).then((response) => response.json()).then((responseJson) => {
      //console.log("response",responseJson);
      if (responseJson.success) {
        Alert.alert(
  'Alert Title',
  `Your Ho Ho Ho! to ${user.username}`,
  [{text: 'Dismiss Button'}] // button
)
      } else {
        Alert.alert(
  'Error',
  `${responseJson.error}`,
  [{text: 'Dismiss Button'}] // button
)
      }
    }).catch((err) => {
      alert(err);
    });

  }

  getUsers(ds) {
    fetch('https://hohoho-backend.herokuapp.com/users', {method: 'GET'}).then((response) => response.json()).then((responseJson) => {
      //   console.log('respoisnejson is', responseJson);
      if (responseJson.success) {
        //  console.log('success', responseJson);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.setState({
          refreshing: false,
          dataSource: ds.cloneWithRows(responseJson.users)
        });
        //  this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
      } else {
        alert(responseJson.error);
        console.log('error in get users', responseJson.error);
        this.setState({refreshing: false});
      }
    }).catch((err) => {
      console.log('caught error in catch', err);
    });

  }

  _onRefresh() {
      console.log('ON REFRESH CALLED');
      this.setState({refreshing: true});
      this.getUsers();
  }
  render() {
    return (
      <View style={{
        flex: 1
      }}>

        {/*
               */}
        <ListView dataSource={this.state.dataSource} renderRow={(rowData) =>
            <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
               <Text style={styles.row}>{rowData.username}</Text>
              </TouchableOpacity>
         }
         refreshControl={
             <RefreshControl
                 refreshing={this.state.refreshing}
                 onRefresh={this._onRefresh.bind(this)}
                 tintColor="#ff0000"
                 title="Loading..."
                 titleColor="#00ff00"
                 colors={['#ff0000', '#00ff00', '#0000ff']}
                 progressBackgroundColor="#ffff00"
             />}
             >
        </ListView>
      </View>
    )
  }
}


class Messages extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      refreshing: false,
      dataSource: ds.cloneWithRows([])
    }
    this.getMessages(ds);
  }
  static navigationOptions = {
    title: 'Messages'
  };

  getMessages() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {method: 'GET'}).then((response) => response.json()).then((responseJson) => {
      //   console.log('respoisnejson is', responseJson);
      if (responseJson.success) {
        //  console.log('success', responseJson);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.setState({
          refreshing: false,
          dataSource: ds.cloneWithRows(responseJson.messages)
        });
        //  this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
      } else {
        alert(responseJson.error);
        console.log('error in get messages', responseJson.error);
      }
    }).catch((err) => {
      console.log('caught error in get messages', err);
    });

  }

  _onRefresh() {
      console.log('ON REFRESH CALLED');
      this.setState({refreshing: true});
      this.getMessages();
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}>


{/* <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
            </TouchableOpacity> */}

        <ListView dataSource={this.state.dataSource} renderRow={(rowData) =>
            <View style={styles.messageBox}>
               <Text >from : {rowData.from.username}</Text>
             <Text >To : {rowData.to.username}</Text>
           <Text>Message : {rowData.body}</Text>
         <Text >Time : {rowData.timestamp}</Text>
        </View>
         }
         refreshControl={
             <RefreshControl
                 refreshing={this.state.refreshing}
                 onRefresh={this._onRefresh.bind(this)}
                 tintColor="#ff0000"
                 title="Loading..."
                 titleColor="#00ff00"
                 colors={['#ff0000', '#00ff00', '#0000ff']}
                 progressBackgroundColor="#ffff00"
             />}>
        </ListView>
      </View>
    )
  }
}



//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen
  },
  Register: {
    screen: RegisterScreen
  },
  UsersScreen: {
    screen: UsersScreen
  },
  Messages: {
    screen: Messages
  }
}, {initialRouteName: 'Login'});

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10
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
    backgroundColor: '#FF585B'
  },
  buttonBlue: {
    backgroundColor: '#0074D9'
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  row: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    borderWidth: 1,
    borderColor: 'black'
  },
  messageBox: {
    fontSize: 16,
    color: 'black',
    borderWidth: 1,
    borderColor: 'black'
  }
});
