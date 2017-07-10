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
    constructor(){
        super()
        this.state = {
            username: '',
            password: '',
            message: ''
        }
    }

    static navigationOptions = {
        title: 'Login'
    };


    register() {
        this.props.navigation.navigate('Register');
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
            console.log(responseJson)
            if(!responseJson.success){
                this.setState({message: responseJson.error})
            }else{
                this.props.navigation.navigate('Users')
            }
        })
        .catch((err) => {
            console.log(err)
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textBig}>Login to HoHoHo!</Text>
                <Text style={{color: 'red', fontSize: 50, textAlign: 'center'}}>{this.state.message}</Text>
                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your username"
                    onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your password"
                    onChangeText={(text) => this.setState({password: text})}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.press()} }>
                    <Text style={styles.buttonLabel}>Login</Text>
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
        super()
        this.state = {
            username: '',
            password: ''
        }
    }
    static navigationOptions = {
        title: 'Register'
    };


    registerUser(){
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
            console.log(responseJson)
            if(!responseJson.success){
                alert('Registration failed')
            }else{
                this.props.navigation.goBack()
            }
        })
        .catch((err) => {
            console.log(err)
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your username"
                    onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your password"
                    onChangeText={(text) => this.setState({password: text})}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.registerUser()} }>
                    <Text style={styles.textBig}>Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class UsersScreen extends React.Component {
  //navigationOptions code
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      to: ''
    };
  }

  messages(){
      this.props.navigation.navigate('Messages');
  }

  static navigationOptions = (props) => ({
      title: 'User',
      headerRight: <TouchableOpacity onPress={ () => {props.navigation.navigate('Messages')} }>
          <Text>Messages</Text>
      </TouchableOpacity>
  });

  componentDidMount(){
      fetch('https://hohoho-backend.herokuapp.com/users', {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {

          console.log(responseJson)
          if(!responseJson.success){
              alert('Registration failed')
          }else{
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
              this.setState({
                  dataSource: ds.cloneWithRows(responseJson.users)
              })
          }
      })
      .catch((err) => {
          console.log(err)
      });
  }

  touchUser(rowData){
      fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              to: rowData._id
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          if(!responseJson.success){
              Alert.alert(
                  'FAILURE',
                  "'Your Ho Ho Ho! to '+ rowData.username + ' could not be sent'",
                  [{text: 'Oh no, try again'}]
              )
          }else{
              Alert.alert(
                  'SUCCESS',
                  'Your Ho Ho Ho! to '+ rowData.username + ' was sent',
                  [{text: 'yay'}]
              )
          }
      })
      .catch((err) => {
          console.log(err)
      });
  }

  render(){
      return(
          <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>
                  <TouchableOpacity onPress={this.touchUser.bind(this,rowData)}>
                      <Text style={styles.Users}>{rowData.username}</Text>
                  </TouchableOpacity>
              }
          />
      )
  }
}

class MessagesScreen extends React.Component {
  //navigationOptions code
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  static navigationOptions = {
      title: 'Messages'
  };

  componentDidMount(){
      fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {
          if(!responseJson.success){
              alert('You failed')
          }else{
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            //   responseJson.messages.filter((msg) => {msg.to.username === user})
              this.setState({
                  dataSource: ds.cloneWithRows(responseJson.messages)
              })
          }
      })
      .catch((err) => {
          console.log(err)
      });
  }

  render(){
      return(
          <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>
                  <TouchableOpacity style={styles.messages}>
                      <Text>From: {rowData.from.username}</Text>
                      <Text>To: {rowData.to.username}</Text>
                      <Text>Message: {rowData.body}</Text>
                      <Text>When {rowData.timestamp}</Text>
                  </TouchableOpacity>
              }
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
        screen: UsersScreen,
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
    Users: {
        borderBottomWidth: 3,
        width: '100%',
        padding: 10,
        textAlign: 'center',
        fontSize: 16
    },
    messages: {
        borderBottomWidth: 3,
        width: '100%',
        padding: 10,
        textAlign: 'center',
        fontSize: 16
    }
});
