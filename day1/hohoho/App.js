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
const _ = require('underscore');


//Screens
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.success) {
        console.log('success', json);
        this.props.navigation.navigate('Users', {username: this.state.username})
      }
    })
    .catch((err) => {
      // Alert.alert('something wrong with app');
      this.setState({message: err}) })
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.message}</Text>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <View>
        <TextInput
          style={{height: 40, borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
      </View>
      <View>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
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
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  registerSubmit() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success){
        console.log('hi hi');
        this.props.navigation.goBack();
      }else{
        console.log('not a success: ', json)
      }
    })
    .catch((err) => {
      console.log('err', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <View>
        <TextInput
          style={{height: 40, borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.registerSubmit()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      refreshing: false
    };

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.success) {
        console.log('retrieving user success!');
        this.setState({
          dataSource: this.ds.cloneWithRows(json.users)
        });
      }else{
        console.log('not a success: ', json)
      }
    })
    .catch((err) => console.log("error is: " + err));

  }

  componentDidMount(){
    this.props.navigation.setParams({
      onRightPress: () => {
        // get the id of person using app
        fetch('https://hohoho-backend.herokuapp.com/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            console.log('retrieving user success!');
            // this.setState({
            //   dataSource: ds.cloneWithRows(json.users)
            // });
            console.log('Received parameters', this.props.navigation.state.params.username);
            var myId = _.findWhere(json.users, {username: this.props.navigation.state.params.username })['_id'];
            this.props.navigation.navigate('Messages', {id: myId});
          }else{
            console.log('not a success: ', json)
          }
        })
        .catch((err) => console.log("error is: ", err));
      }
    })

  }
  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <TouchableOpacity onPress={() => props.navigation.state.params.onRightPress()}>
      <Text>Messages</Text>
    </TouchableOpacity>
  });

  _onRefresh() {
   this.setState({refreshing: true});
   fetch('https://hohoho-backend.herokuapp.com/users', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
     },
   })
   .then((response) => response.json())
   .then((json) => {
     if (json.success) {
       console.log('retrieving user success!');
       this.setState({
         dataSource: this.ds.cloneWithRows(json.users),
         refreshing: false,
       });
     }else{
       console.log('not a success: ', json)
     }
   })
   .catch((err) => console.log("error is: " + err));

 }

  sendYo(_id, username) {
    console.log('Send Yo', _id, username);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: _id,
      }),
    })
    .then((response) => (response.json()))
    .then((json) => {
      if(json.success){
        //Alert.alert('hi');
        Alert.alert(
        'LOOK HERE!',
        'Your HoHoHo to ' + username  + ' has been sent.',
        [{text: 'COOL'}]
        );
        // Alert.alert(
        //   'Alert Title',
        //   'Alert Contents',
        //   [{text: 'Dismiss Button'}] // Button
        // );
      }else{
        // Alert.alert('Sorry it wasn\'t sent');
        console.log('not a success', json);
      }
    })
  }

  render() {
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        dataSource={this.state.dataSource}
        renderRow={({username, _id}) => <TouchableOpacity onPress={this.sendYo.bind(this, _id, username)}><Text>{username}</Text></TouchableOpacity>}
      />
    )
  }
}

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      // console.log('the response is....', response)
      return response.json();
    })
    .then((json) => {
      console.log(json)
      if (json.success) {
        console.log('retrieving messages success!');
        this.setState({
          dataSource: ds.cloneWithRows(json.messages)
        });
      }else{
        console.log('not a success: ', json)
      }
    })
    .catch((err) => console.log("error is: ", err));

  }

  static navigationOptions = {
    title: 'Messages'
  };
  helperStyle(objId) {

    if (this.props.navigation.state.params.id === objId) {
      return {backgroundColor: 'skyblue'}
    }
      return {backgroundColor: 'yellow'}
  }
  render() {
    console.log('this params', this.props.navigation.state.params.id);
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(messageObj) =>

        <View style={this.helperStyle.call(this, messageObj.from._id)}>
          <Text>From: {messageObj.from.username}</Text>
          <Text>To: {messageObj.to.username}</Text>
          <Text>Body: {messageObj.body}</Text>
          <Text>Time: {messageObj.timestamp}</Text>
      </View>}
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
  },
  Messages: {
    screen: MessagesScreen
  }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
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
    padding: 40,
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
