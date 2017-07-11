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

class Users extends React.Component {
    static navigationOptions = {
        title: 'Users'
    };

    constructor(){
        super();
        this.state = {
            dataSource: ds.cloneWithRows([]),
        }

        fetch('https://hohoho-backend.herokuapp.com/users', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                dataSource: ds.cloneWithRows(
                    responseJson.map((user) => user))
                });
            });
            .catch((err) => {
                /* do something if there was an error with fetching */
                console.log("Failure!!!!", err)
            });

    }

    touchUser = (user) => {
        fetch('https://hohoho-backend.herokuapp.com/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: user._id
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            let alertMsg;
            if(responseJson.success) {
                this.props.navigation.goBack()
                Alert.alert(
                    "Success",
                    "HOHOH, "+ user.username + " has been sent",
                    [{text: 'Dismiss Button'}] // Button
                )
            }else{
                Alert.alert(
                    "Failure",
                    "see title",
                    [{text: 'Dismiss Button'}] // Button
                )
            }

            /* do something with responseJson and go back to the Login view but
            * make sure to check for responseJson.success! */
        })
        .catch((err) => {
            /* do something if there was an error with fetching */
            console.log("Failure!!!!", err)
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(user) => <TouchableOpacity onPress={this.touchUser(user)}>
                    <Text>{user.username}</Text>
                </TouchableOpacity>}
                />
            </View>
        )}
    }


class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('Login')
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
        };

    }
  static navigationOptions = {
    title: 'Register'
  };

  registerReq = () => {
      console.log(this.state.username);
      if (typeof this.state.username !== "string" || typeof this.state.password !== "string"){
          return;
      }

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
        console.log(responseJson)
              this.props.navigation.goBack()
          }
          /* do something with responseJson and go back to the Login view but
          * make sure to check for responseJson.success! */
      })
      .catch((err) => {
          /* do something if there was an error with fetching */
          console.log("Failure!!!!", err)
      });

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput style={{height:40, width: 200}}
        placeholder="Username"
        onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{height:40, width: 200}}
        placeholder="Password"
        onChangeText={(text) => this.setState({password: text})}
        secureTextEntry={true}/>
        <Button onPress={this.registerReq} style={styles.buttonRed} title="Register"/>

      </View>
    )
  }
}

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    loginReq = () => {
        console.log('this functon called')
        if (typeof this.state.username !== "string" || typeof this.state.password !== "string"){
            return;
        }
        console.log('nade it here')
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
            console.log('responseJson is : ',  responseJson)
            if(responseJson.success) {
                this.props.navigation.navigate('Users')
            }
            /* do something with responseJson and go back to the Login view but
            * make sure to check for responseJson.success! */
        })
        .catch((err) => {
            /* do something if there was an error with fetching */
            console.log("Failure!!!!", err)
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.textBig}>Login</Text>
                <TextInput style={{height:40, width: 200}}
                placeholder="Username"
                onChangeText={(text) => this.setState({username: text})}/>
                <TextInput style={{height:40, width: 200}}
                placeholder="Password"
                onChangeText={(text) => this.setState({password: text})}
                secureTextEntry={true}/>
                <Button onPress={this.loginReq} style={styles.buttonRed} title="Login"/>
            </View>
        )
    }

}

//Navigator
export default StackNavigator({
  Home: {
    screen: LoginScreen,
  },
  Login: {
      screen: Login,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: Users,
  }
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
