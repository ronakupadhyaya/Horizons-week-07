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


//Screens-----------------------------------------------------------------------Login Page Component
class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      password: '',
      username: '',
      message:''
    }
  };
  static navigationOptions = {
    title: 'Login Page'
  };
  login(username, password){
    if(username.split('').join('')!=='' && password.split('').join('')!==''){
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success){
          this.props.navigation.navigate('Users');
        } else {
          console.log(responseJson);
          this.setState({message:responseJson.error});
        }
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }
  render(){
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={ () => {this.login(this.state.username,this.state.password)} } style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <Text>{this.state.message}</Text>
      </View>
    )
  }
}
//------------------------------------------------------------------------------Default Login screen
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login Screen'
  };

  press() {
    console.log('pressed')
    console.log(this.props.navigation.navigate)
    this.props.navigation.navigate('LoginPage');
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
//------------------------------------------------------------------------------Registration Screen
class RegisterScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username:'',
      password:''
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  register(username,password){
    if(username.split('').join('')!=='' && password.split('').join('')!==''){
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('success?',responseJson.success)
        if(responseJson.success){
          // this.props.navigation.navigate('Login')
          this.props.navigation.goBack();
        } else {
          console.log(responseJson);
        }
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
      })
      .catch((err) => {
        console.log(err)
        /* do something if there was an error with fetching */
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          // value={this.state.password.split('').map(item => 'X').join('')}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={()=>this.register(this.state.username,this.state.password)}>
          <Text style={styles.buttonGreen, styles.button}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

//------------------------------------------------------------------------------User Screen
class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
          //we need to put this in constructor otherwise ds will not be defined!! unless we define it again.
        });
      } else {
        console.log(responseJson);
      }
    })
    .catch((err) => {
      console.log(err)
    });
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });
  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
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
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if(responseJson.success){
        Alert.alert(
          'Success',
          'Your Ho Ho Ho! to '+user.username+' has been sent!',
          [{text: 'Dismiss Button'}] // Button
        )
      } else {
        Alert.alert(
          'Failure',
          'Your Ho Ho Ho! to '+user.username+' could not be sent!',
          [{text: 'Dismiss Button'}] // Button
        )
        console.log(responseJson.error)
      }
    })
  }
  messages(){
    this.props.navigation.navigate('Messages')
  }
  render(){
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this,rowData)}><Text>{rowData.username}</Text></TouchableOpacity>}
        />
      </View>
    )
  }
}

//------------------------------------------------------------------------------Messages
class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }
  componentDidMount(){
    // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("This is the response from the responseJson.messages:",responseJson.messages)
      // console.log('this is the clonewithrows:', ds.cloneWithRows(responseJson.messages))
      if(responseJson.success){
        this.setState({
          messages: responseJson.messages
        });
        console.log('state is now set to:',this.state.messages)
      } else {
        console.log(responseJson.error);
      }
    })
    .catch((err) => {
      console.log(err)
    });
  }
  static navigationOptions = {
    title: 'Messages'
  };
  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log('directe to messages successfully')
    return(
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.state.messages)}
          renderRow={(rowData) =>
            <View>
              <Text>From:{rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>Message: {rowData.body}</Text>
              <Text>When: {rowData.timestamp}</Text>
            </View>}
        />
      </View>
    )
  }
}

//Navigator
export default StackNavigator({ //similar to mapstate to props
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  LoginPage: {
    screen: LoginPage, //this is the one that ask for user to key in information
  },
  Users: {
    screen: UserScreen,
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
  },
  input: {
    height: 40,
    textAlign: 'center',
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1
  }

});
