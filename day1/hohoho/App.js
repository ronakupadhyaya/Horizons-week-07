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
class HomeScreen extends React.Component{
  static navigationOptions = {
    title: 'Home'
  };

  register() {
    this.props.navigation.navigate('Register');
  }

  login() {
    this.props.navigation.navigate('Login');
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

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor(){
    super();
    this.state={
      message:''
    }
  }

  press(){

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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if (responseJson.success){
        this.props.navigation.navigate('Users')
      }
      else{
        this.setState({message:'failed to login'})
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('error', err);
    });

}


  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40,padding:10}}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40,padding:10}}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <Text>{this.state.message}</Text>

        <TouchableOpacity onPress={this.press.bind(this)} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>

      </View>

    )
  }
}




class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  }

  constructor() {
    super();
    this.state={
      username:'',
      password:''
    }
  }

  press() {
    if (this.state.username.trim().length>0 && this.state.password.trim().length>0){
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
        if(responseJson.success) {
          this.props.navigation.navigate('Login')
        } else {
          console.log(responseJson);
        }
        /* do something with responseJson and go back to the Login view but
        * make sure to check for responseJson.success! */

      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error', err);
      });
    }
    }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, padding:10}}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40,padding:10}}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
        />

        <TouchableOpacity onPress={this.press.bind(this)} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>

      </View>
    )
  }
}


class UsersScreen extends React.Component {
  //navigationOptions code
  static navigationOptions = props => ({
    title: 'Users', //you put the title you want to be displayed here
    headerRight: <TouchableOpacity onPress={()=>props.navigation.navigate('Messages')}><Text>Messages</Text></TouchableOpacity>
  });
  constructor(props) {
    super(props);
    this.state = {
      arr:[]
    };
    this.touchUser = this.touchUser.bind(this);
    this.messages = this.messages.bind(this);
  }

  componentDidMount(){
    fetch("https://hohoho-backend.herokuapp.com/users",{
      method:'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson)=>{
      if (responseJson.success){
        this.setState({arr: responseJson.users})
      }
    })
    .catch((err)=>{
      console.log('error',err);
    })
  }

  touchUser(user){
    fetch("https://hohoho-backend.herokuapp.com/messages",{
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
      })
    })
    .then((response) => response.json())
    .then((responseJson)=>{
      if (responseJson.success){
        Alert.alert(
        'Alert successful',
        'Your message to '+user.username+ ' has been sent',
        [{text: 'Dismiss Button'}] // Button
      )}
      else{
        Alert.alert(
        'Alert failed',
        'Your message to '+user.username+ ' could not be sent',
        [{text: 'Dismiss Button'}] // Button
      )
      }
    })
    .catch((err)=>{
      console.log('error',err);
    })
  }
// 
// messages(){
//   this.props.navigation.navigate('Messages')
// }

  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView
        dataSource={ds.cloneWithRows(this.state.arr)}
        renderRow={(user) =>
          <View>
            <TouchableOpacity onPress={() => this.touchUser(user)}>
              <View>
                <Text style={{textAlign:'center',borderWidth:0.5,borderColor:'lightgrey',fontSize:20,padding:5}}>
                  {user.username}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      />
    )
  }
}

class MessagesScreen extends React.Component {
  static navigationOptions = {
  title: 'Messages' //you put the title you want to be displayed here
  };
  constructor(props) {
    super(props);
    this.state = {
      messages:[]
    };
  }

  componentDidMount(){
    console.log('YO')
    fetch("https://hohoho-backend.herokuapp.com/messages",{
      method:'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson)=>{
      if (responseJson.success){
        this.setState({messages: responseJson.messages})
      }
    })
    .catch((err)=>{
      console.log('error',err);
    })
  }


  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView
        dataSource={ds.cloneWithRows(this.state.messages)}
        renderRow={(message)=>
          <View>
            <Text>From {message.from.username}</Text>
            <Text>To {message.to.username}</Text>
            <Text>Message: Yo</Text>
            <Text>When {Date.now()}</Text>
          </View>
        }
      />

    )
  }
}


//Navigator
export default StackNavigator({
  Home:{
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen
  }
}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding:5
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
