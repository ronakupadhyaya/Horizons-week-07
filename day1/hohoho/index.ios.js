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
  Alert,
  AsyncStorage
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Main,
          title: "Main",

        }}
        style={{flex: 1}}
      />
    );
  }
});

var Messages = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});
    return {
      dataSource: ds.cloneWithRows([])
    };
  },
  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((res) => res.json())
    .then((respjson) => {
      if (!respjson.success) {
        console.log('unable to get user messages')
      } else {
        console.log("MY MESSAGES", respjson);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(respjson.messages)
        });
      }
    })
  },
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => {
          return (
            <View>
              <Text>From: {rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>Message: {rowData.body}</Text>
              <Text>When: {rowData.timestamp}</Text>
            </View>
          );
        }}
      />
    );
  }
});

var Users = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});
    return {
      dataSource: ds.cloneWithRows([])
    };
  },
  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method:'POST',
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((resp) => resp.json())
    .then((respjson) => {
      if (!respjson.success) {
        console.log('hohoho failed');
      } else {
        Alert.alert(
          'Success!',
          'Your Ho Ho Ho! to ' + user.username + ' has been sent.',
          [{text: 'Dismiss Button'}]
        );
      }
    })
  },
  componentDidMount(){
    fetch('https://hohoho-backend.herokuapp.com/users',{
      method:'GET',
    })
    .then((resp)=>resp.json())
    .then((respjson)=>{
      if(!respjson.success){
        console.log('fuck you')
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(respjson.users)
        });
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
  },
  render() {
    this.props.navigator.rightButtonTitle = 'Messages';
    this.props.navigator.onRightButtonPress = ()=>(this.refs.navigator.push({
      component: Messages,
      title: 'Messages'
    }));
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => {
          return(
            <TouchableOpacity onPress={this.touchUser.bind(null, rowData)}>
              <Text style={{fontSize:15, margin:5, textDecorationLine:'underline', justifyContent:'center',alignSelf:'center'}}>
                {rowData.username}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
    );
  }
});

var Login = React.createClass({
  getInitialState(){
    return{
      username:'',
      password:'',
      message:''
    }
  },
  componentDidMount() {
    AsyncStorage.getItem('user')
      .then((result) => {
        var parsedUser = JSON.parse(result);
        var username = parsedUser.username;
        var password = parsedUser.password;
        if (username && password) {
          this.submitForm(username, password);
        }
      });
  },
  submitForm(username, password){
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        username: username || this.state.username,
        password: password || this.state.password
      })
    })
    .then((resp)=> resp.json())
    .then((respjson)=> {
      if(!respjson.success){
         this.setState({
           message: 'Login not succesful'
         })
        }
       else {
        AsyncStorage.setItem('user', JSON.stringify({
          username: username || this.state.username,
          password: password || this.state.password
        }))
        .then(() => {
          this.props.navigator.push({
            component: Users,
            title:"Users",
            rightButtonTitle: 'Messages',
            onRightButtonPress: this.messages
          });
        });
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    })
  },
  render(){
    return (
      <View style={styles.container}>
      {this.state.message.length>0 && <Text style={{color:'red'}}>{this.state.message}</Text>}
        <TextInput
        style={{height: 40, textAlign: 'center'}}
        placeholder="Enter your username"
        onChangeText={(text) => this.setState({username: text})}/>
        <TextInput
        style={{height: 40, textAlign: 'center'}}
        placeholder="Enter your password"
        onChangeText={(text)=> this.setState({password: text})}/>
        <TouchableOpacity onPress={this.submitForm} style={[styles.button, styles.buttonRed]}>
         <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
})
var Register = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: ''
    };
  },
  submitForm() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json()) // returns a promise
    .then((responseJson) => {
      if (!responseJson.success) {
        console.log("unable to register");
      } else {
        // success
        this.props.navigator.pop();
      }
    })
    .catch((err) => {
      console.log("error", err);
    })
  },
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={this.submitForm} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Main = React.createClass({
  press() {

  },
  login(){
    this.props.navigator.push({
      component: Login,
      title: "Login"
    })
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
        <TouchableOpacity onPress={this.login} style={[styles.button, styles.buttonGreen]}>
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
