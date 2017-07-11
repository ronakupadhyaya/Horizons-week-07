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

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      message: false,
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
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success){
        this.props.navigation.navigate('Users');
        console.log('success!!!');
      } else {
        this.setState({message: 'invalid login, sorry'})
      }
    })
    .catch((err) => {});
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Smack Dat!</Text>
        <TextInput
          style={styles.register}
          placeholder="Enter a username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <Text>{this.state.message}</Text>
        <TextInput
          style={styles.register}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonWhite]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabelGreen}>Tap to Register</Text>
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

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.register}
          placeholder="Enter a username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.register}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={() => {
          fetch('https://hohoho-backend.herokuapp.com/register', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
            }),
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.success){
              console.log(responseJson.success);
              this.props.navigation.goBack();
            } else {
              console.log('something went wrong');
            }
          })
          .catch((err) => {
            console.log('error', err);
          });
        }} >
          <Text style={styles.textBig}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

//Users
class UserScreen extends React.Component {

  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
    this.touchUser = this.touchUser.bind(this);
    this.messages = this.messages.bind(this);
  }

  componentDidMount(){
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((respJson) => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(respJson.users)
      });
      // console.log(respJson);
    })
    .catch((err) => {
      console.log('error', err);
    })
    this.props.navigation.setParams({
      onRightPress: () => {this.messages()}
    })
  }

  touchUser(user){
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      body: JSON.stringify({
        to: user._id
      }),
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((res) => {
      res.json();
      // console.log(res);
    })
    .then((resJson) => {
      // console.log(resJson);
      Alert.alert(
        'Success!',
        'You have successfully smacked dat ' + user.username + '!',
        [{text: 'Yuhh'}]
      )
      // console.log('message sent to ' + user.username);
    })
    .catch((err2) => {
      console.log('error!', err2);
    })
  };

  messages(){
    this.props.navigation.navigate('Messages')
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Who you wanna smack?',
    headerRight: <Button title='Receipts' onPress={() => {navigation.state.params.onRightPress()}}/>
  });

  render(){
    return(
      <View style={styles.hoBox}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity onPress={() => this.touchUser(rowData)} style={styles.eachHo}><Text style={styles.hoText}>{rowData.username}</Text></TouchableOpacity>}
        />
      </View>
    )
  };
}

//messages
class MessageScreen extends React.Component {

  constructor(props){
    super(props);
    const ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource2: ds2.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
    // this.touchUser = this.touchUser.bind(this);
  }

  componentDidMount(){
    fetch('https://hohoho-backend.herokuapp.com/messages?username'+this.props.navigation.state.params.username
    +'&password=' +this.props.navigation.state.params.password, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response2) => response2.json())
    .then((resp2Json) => {
      let ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource2: ds2.cloneWithRows(resp2Json.messages)
      });
      console.log('messages', this.state.dataSource2);
    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  static navigationOptions = {
    title: 'Smack Receipts'
  };

  render(){
    return(
      <View style={styles.hoMessageBox}>
        <ListView
          dataSource={this.state.dataSource2}
          renderRow={(rowData) =>
            <View style={styles.eachHoMessage}>
              <Text style={styles.hoMessageText}>From: {rowData}</Text>
          </View>}
        />
      </View>
    )
  };
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
    screen: UserScreen
  },
  Messages: {
    screen: MessageScreen
  },
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#96DC78',
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
  buttonWhite: {
    backgroundColor: 'white',
    // color: '#1E6400'
  },
  buttonGreen: {
    backgroundColor: '#1E6400',
    // color: 'white'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  buttonLabelGreen: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1E6400'
  },
  register: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 2,
    marginRight: 30,
    marginLeft: 30,
    padding: 5
  },
  hoBox: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  eachHo: {
    flex: 1,
    // height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#6BBC48'
  },
  hoText: {
    textAlign: 'center',
    fontSize: 24
  },
  hoMessageBox: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  eachHoMessage: {
    flex: 1,
    // height: 100,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#6BBC48'
  },
  hoMessageText: {
    // textAlign: 'center',
    fontSize: 24
  },
});
