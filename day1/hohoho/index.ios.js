import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Button,
  TextField,
  Alert
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Login,
          title: "Login"
        }}
        style={{flex: 1}}
      />
    );
  }
});

var Users = React.createClass({
  getInitialState(){
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([])
    };
  },
  componentDidMount(){
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/users',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((resp) => resp.json())
    .then((respJson)=>{
      if(respJson.success){
        console.log('Users should be displayed')
        const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=> r1 !== r2});
        self.setState({
          dataSource: ds.cloneWithRows(respJson.users)
        })
        console.log(respJson.users)
      } else {
        console.log('Error')
      }


    })
    .catch((err)=>{
      console.error(err)
    });
  },
  press(user){
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/messages',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((resp) => resp.json())
    .then((respJson)=>{
      if(respJson.success){
        Alert.alert(
          'Successssss',
          'Your HoHoHo' + user.username + 'has been sent',
           'has been sent',
          [{text: 'HoHoHo'}]
        )
      } else {
        Alert.alert(
          'Faileddddd',
          'Failed to send to message to ' + user.username,
          [{text: 'AYYYEEYEYEYE'}]
        )
      }
    })
    .catch((err)=>{
      console.error(err)
    });
  },
  render(){
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}

          renderRow={(rowData)=>  <TouchableOpacity onPress={this.press.bind(this,rowData)}>
          <Text style={{textAlign: 'center'}}>
          {rowData.username}</Text>
          </TouchableOpacity>
        }
        />
      </View>
    )
  }
});


var Messages = React.createClass({
  getInitialState(){
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([])
    };
  },
  componentDidMount(){
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/messages',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((resp) => resp.json())
    .then((respJson)=>{
      if(respJson.success){
        console.log('Users should be displayed')
        const ds = new ListView.DataSource({rowHasChanged: (r1,r2)=> r1 !== r2});
        self.setState({
          dataSource: ds.cloneWithRows(respJson.messages)
        })
        console.log(respJson.users)
      } else {
        console.log('Error')
      }


    })
    .catch((err)=>{
      console.error(err)
    });
  },
  render(){
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData)=>  <View style={styles.container}>
          <Text>From: {rowData.from.username}</Text>
          <Text>To: {rowData.to.username}</Text>
          <Text>Time: {rowData.timestamp}</Text>
          </View>
        }
        />
      </View>
    )
  }
})

var Register = React.createClass({
  getInitialState(){
    return {
      username: '',
      password: ''
    }
  },
  main(){
    fetch('https://hohoho-backend.herokuapp.com/register',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((resp) => resp.json())
    .then((respJson)=>{
      console.log(respJson, 'Just registered a user')
      this.props.navigator.push({
        component: Login,
        title: "Login"
      });

    })
    .catch((err)=>{
      console.error(err)
    });

  },
  render() {
    return (
      <View style={styles.container} >
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={{height: 40}}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
        />
        <TouchableOpacity>
          <Text style={{backgroundColor: 'red', color: 'white', width: 100 }} onPress={this.main}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var LoginInput = React.createClass({
  getInitialState(){
    return {
      username: '',
      password: '',
      message: '',
      users: []
    }
  },
  messages(){
    this.props.navigator.push({
      component: Messages,
      title: 'MessagePage'
    })
  },
  main(){
    fetch('https://hohoho-backend.herokuapp.com/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((resp) => resp.json())
    .then((respJson)=>{
      console.log(respJson, 'Just logged in')
      if(respJson.success){
        this.props.navigator.push({
          component: Users,
          title: "Users",
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.messages
        });
      } else(
        console.log('Error, username or password is incorrect')
      )


    })
    .catch((err)=>{
      console.error(err)
    });

  },
  render(){
    return (
      <View style={styles.container} >
        <Text style={styles.textBig}>Login</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={{height: 40}}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
        />
        <TouchableOpacity>
          <Text style={{backgroundColor: 'red', color: 'white', width: 100 }} onPress={this.main}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
})

var Login = React.createClass({
  press() {
    this.props.navigator.push({
      component: LoginInput,
      title: 'LoginPage'
    })
  },
  main(){
    fetch('https://hohoho-backend.herokuapp.com/register',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((resp) => resp.json())
    .then((respJson)=>{
      console.log(respJson, 'Just registered a user')
      this.props.navigator.push({
        component: Login,
        title: "Login"
      });

    })
    .catch((err)=>{
      console.error(err)
    });

  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

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

AppRegistry.registerComponent('hohoho', () => hohoho );
