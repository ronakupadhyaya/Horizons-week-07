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
import axios from 'axios';
const backendUrl = "https://hohoho-backend.herokuapp.com/";
//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('LoginOnly');
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
class LoginOnlyScreen extends React.Component {
  static navigationOptions ={
    title: 'Login'
  }
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }

  loginUser(){
    fetch(backendUrl+'login', {
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
      console.log("responseJson", responseJson);
      if(!responseJson.success){
        console.log("Error loggin in");
      }
      if(responseJson.success){
        this.props.navigation.navigate('Users', {username: this.state.username});
      } else{

      }

    })
    .catch((err) => {
      console.log("ERR", err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}> Login </Text>
      <TextInput
        style={{height: 40, borderColor: 'gray',
            borderWidth: 1, marginBottom: 10, paddingLeft: 5}}
        placeholder="Username"
        onChangeText={(text) => this.setState({username: text})}
        value = {this.state.username}
      />
      <TextInput
        style={{height: 40, borderColor: 'gray',
            borderWidth: 1, paddingLeft: 5}}
        placeholder="Password"
        secureTextEntry = {true}
        onChangeText={(text) => this.setState({password: text})}
        value = {this.state.password}
      />
      <TouchableOpacity
        onPress={this.loginUser.bind(this)}
        style={[styles.button, styles.buttonRed]}
      ><Text style={styles.buttonLabel}> Login </Text></TouchableOpacity>

      <Text style={{marginTop: 20, color: 'red'}}>{this.state.message}</Text>
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
    }
  }
  registerUser(){
    fetch(backendUrl+'register', {
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
      console.log("responseJson", responseJson);

      this.props.navigation.navigate('LoginOnly');
    })
    .catch((err) => {
      console.log("ERR", err);
    });
  }
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}> Register </Text>
      <TextInput
        style={{height: 40, borderColor: 'gray',
            borderWidth: 1, marginBottom: 10, paddingLeft: 5}}
        placeholder="Username"
        onChangeText={(text) => this.setState({username: text})}
        value = {this.state.username}
      />
      <TextInput
        style={{height: 40, borderColor: 'gray',
            borderWidth: 1, paddingLeft: 5}}
        placeholder="Password"
        secureTextEntry = {true}
        onChangeText={(text) => this.setState({password: text})}
        value = {this.state.password}
      />
      <TouchableOpacity
        onPress={this.registerUser.bind(this)}
        style={[styles.button, styles.buttonRed]}
      ><Text style={styles.buttonLabel}> Register </Text></TouchableOpacity>
      </View>
    )
  }
}

class UserList extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
            title: 'Users',
            headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
            }
};
  constructor(props) {
     super(props);

     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.state = {
       dataSource: ds.cloneWithRows([]),
       refreshing: false
     };

     fetch(backendUrl + 'users')
     .then((response) => response.json())
     .then((response) => {
       console.log("user response", response);
       if(response.success){
         this.setState({dataSource: ds.cloneWithRows(response.users)});
       } else{
         console.log("ERROR")
       }

     })
   }

  componentDidMount(){
    const name = this.props.navigation.state.username;
    this.props.navigation.setParams({
       onRightPress: (name) => {
         console.log("NAME again", this.props.navigation.state.params)
         return this.props.navigation.navigate('Messages', {username: this.props.navigation.state.params.username})
       }
     })
  }

  _onRefresh(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({refreshing: true});
    fetch(backendUrl + 'users')
    .then((response) => response.json())
    .then((response) => {
      console.log("user response", response);
      if(response.success){
        this.setState({dataSource: ds.cloneWithRows(response.users), refreshing: false});
      } else{
        console.log("ERROR")
      }

    })

  }

  touchUser(item) {
    console.log("check id", item._id);
    fetch(backendUrl+'messages?', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: item._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("responseJson", responseJson);
      if(responseJson.success){
        Alert.alert(
          'Succes',
          'Your Hohoho to ' + item.username + ' has been sent' ,
          [{text: 'Dismiss Button'}] // Button
        )
      } else{
        console.log('problem with that');
      }

    })
    .catch((err) => {
      console.log("ERR", err);
    });
  }

  render(){
    const { params } = this.props.navigation.state;
    console.log("PARAMS", params);
    return(
      <View style={styles.container}>
        <Text style={{marginBottom: 20, fontSize: 40}}> Welcome {params.username}! Click a user below to send a BRO </Text>
        <ListView
          renderRow={(item) => (
          <TouchableOpacity style={styles.userItem} onPress={this.touchUser.bind(this, item)}><View><Text style={{textAlign: 'center', color: 'white', fontSize: 20}}>{item.username}</Text></View></TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource = {this.state.dataSource}
        />
      </View>
    )
  }
}

class MessageList extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Messages',
    headerLeft: <Button title='Users' onPress={ () => {navigation.state.params.onLeftPress()} } />
  });

  constructor(props) {
     super(props);

     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     this.state = {
       dataSource: ds.cloneWithRows([]),
       refreshing: false
     };

     fetch(backendUrl + 'messages')
     .then((response) => response.json())
     .then((response) => {
       console.log("message response", response);
       if(response.success){
         this.setState({dataSource: ds.cloneWithRows(response.messages)});
       } else{
         console.log("ERROR")
       }

     })
   }
   componentDidMount() {
     this.props.navigation.setParams({
        onLeftPress: () => (this.props.navigation.navigate('Users'))
      })
  }

  _onRefresh(){
    this.setState({refreshing: true});
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch(backendUrl + 'messages')
    .then((response) => response.json())
    .then((response) => {
      console.log("message response", response);
      if(response.success){
        this.setState({refreshing: false});
        this.setState({dataSource: ds.cloneWithRows(response.messages)});
      } else{
        console.log("ERROR")
      }

    })
  }
   render(){
     const { params } = this.props.navigation.state;
     console.log("PARAMS message", params);
     return(
       <View style={styles.container}>
         <ListView
           renderRow={(msg) => {
             if(msg.from.username === params.username){
               return (
                 <View style={{borderColor: 'grey', borderWidth: 1, marginBottom: 10, borderRadius: 3, padding: 5, backgroundColor: '#9b59b6'}}>
                  <Text style={{color: 'white'}}>From: {msg.from.username}</Text>
                  <Text style={{color: 'white'}}>To: {msg.to.username}</Text>
                  <Text style={{color: 'white'}}>Message: BRO </Text>
                  <Text style={{color: 'white'}}>When: {msg.timestamp} </Text>
                  </View>
               )
             } else{
               return(
                 <View style={{borderColor: 'grey', borderWidth: 1, marginBottom: 10, borderRadius: 3, padding: 5, backgroundColor: '#2ecc71'}}>
                  <Text style={{color: 'white'}}>From: {msg.from.username}</Text>
                  <Text style={{color: 'white'}}>To: {msg.to.username}</Text>
                  <Text style={{color: 'white'}}>Message: BRO </Text>
                  <Text style={{color: 'white'}}>When: {msg.timestamp} </Text>
                  </View>
               )
             }
         }}
           refreshControl={
             <RefreshControl
               refreshing={this.state.refreshing}
               onRefresh={this._onRefresh.bind(this)}
             />
           }
           dataSource = {this.state.dataSource}
         />
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
  LoginOnly: {
    screen: LoginOnlyScreen
  },
  Users: {
    screen: UserList
  },
  Messages: {
    screen: MessageList
  }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10
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
  userItem: {
    backgroundColor: 'coral',
    marginBottom: 10,
    borderRadius: 3,
    alignSelf:  'stretch',
    padding: 10,
    flex: 1
  }
});
