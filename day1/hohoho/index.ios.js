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
  AsyncStorage,
  MapView,
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

var ws = new WebSocket('ws://host.com/path');

var Messages = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      })
    })
    return{
      dataSource: ds.cloneWithRows([]),
    }
  },

  componentDidMount(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    setInterval( () =>{
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        })
      })
      return{
        dataSource: ds.cloneWithRows([]),
      }
    }, 10000)
  },

  render(){
    return (

      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <View style={styles.container}>
      <Text>{rowData.from.username}</Text>
      <Text>{rowData.to.username}</Text>
      <Text>{rowData.timestamp}</Text>
      {rowData.location && rowData.location.longitude && rowData.location.latitude && <MapView
        style={{height: 200, width: 200}}
        showsUserLocation={true}
        scrollEnabled={false}
        region={{
          longitude: rowData.location.longitude,
          latitude: rowData.location.latitude,
          longitudeDelta: 1,
          latitudeDelta: 1
        }}
        annotations={[{
          latitude: rowData.location.longitude,
          longitude: rowData.location.latitude,
          title: "My house"
        }]}
        />
      }
      </View>}/>

    )
  }
})



var Users = React.createClass({
  getInitialState() {

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
      // body: JSON.stringify({
      //   username: this.state.username,
      //   password: this.state.password,
      // })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      })
    })
    return{
      dataSource: ds.cloneWithRows([]),
    }
  },

  sendLocation(user){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Got position:", position);
        /* use fetch() with the received position here */
        fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: user._id,
            location: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            }
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            dataSource: ds.cloneWithRows(responseJson.users)
          })
        })
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     console.log("Got Position:", position)
    //
    //     var initialPosition = JSON.stringify(position);
    //     this.setState({initialPosition});
    //   },
    //   (error) => alert(JSON.stringify(error)),
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    // );
    // this.watchID = navigator.geolocation.watchPosition((position) => {
    //   var lastPosition = JSON.stringify(position);
    //   this.setState({lastPosition});
    // });
  },

  render(){
    return (
      <View style={styles.container}>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <View style={styles.container}>
      <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}
      onLongPress= {this.sendLocation.bind(this, rowData)}
      delayLongPress= {1000}
      >
      <Text>{rowData.username}</Text></TouchableOpacity>
      </View>} />
      </View>
    )
  },


  //     console.log("Got position:", position);
  //     {
  //       to: user_.id,
  //       location: {
  //         longitude: longitude/* the received longitude from getCurrentPosition */,
  //         latitude: latitude/* the received latitude from getCurrentPosition */
  //       }
  //     }
  //
  //   },
  //   error => alert(error.message),
  //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  // );


  touchUser(user){
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('EYYY: ', responseJson);
      if(responseJson.success){

        Alert.alert(
          'Successful',
          `Your Hohoho to ${user.username} has been sent`,
          [{text: 'YEZZUR'}] // Button
        )
      }

      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      else {
        Alert.alert(
          'Failed',
          'You failed, like you always do at life',
          [{text: 'LOL OKAY MOFO'}] // Button
        )
      }
    })
  }
})






var Register = React.createClass({
  // constructor(){
  //   super();
  //
  //   this.state={
  //     username: '',
  //     password: ''
  //   };
  // },
  getInitialState () {
    return {
      username: '',
      password: ''
    }
  },

  press(){
    console.log('PRESS WORKS');
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
      console.log('EYYY: ', responseJson);
      if(responseJson.success === true){
        console.log('Success!');
      }

      console.log(this.state.username, this.state.password)
      this.props.navigator.pop()
    })
    /* do something with responseJson and go back to the Login view but
    * make sure to check for responseJson.success! */
    .catch((err) => {
      console.log('urr boooooi', err);
    });
  },

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Register</Text>
      <TextInput
      style={{height: 40}}
      placeholder="Enter your username"
      onChangeText={(text1) => this.setState({username: text1})}/>

      <TextInput secureTextEntry={true}
      style={{height: 40}}
      placeholder="Gimme your password or you get STD ;)"
      onChangeText={(text2) => this.setState({password: text2})}/>

      <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonPink]}>
      <Text>Submit thiz shiz</Text>
      </TouchableOpacity>
      </View>
    );
  }
});


var Login1 = React.createClass({
  getInitialState () {
    return {
      username: '',
      password: ''
    }
  },
  messages(){
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    })
  },

  press(username,password){
    // var self = this;
    console.log('TUPAC');
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
      this.props.navigator.push({
        component: Users,
        title: "Users",
        passProps: {
          username: this.state.username,
          password: this.state.password
        },
        rightButtonTitle: 'Messages',
        onRightButtonPress: this.messages
      })
      console.log('storing ', this.state.username, this.state.password);
      AsyncStorage.setItem('user', JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }));


    })
    /* do something with responseJson and go back to the Login view but
    * make sure to check for responseJson.success! */
    .catch((err) => {
      console.log('LOGIN ERROR BOOOI', err);
    });
  },

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Log In</Text>
      <TextInput
      style={{height: 40}}
      placeholder="Enter your login username"
      onChangeText={(text1) => this.setState({username: text1})}/>

      <TextInput secureTextEntry={true}
      style={{height: 40}}
      placeholder="Gimme your login password or you get STD ;)"
      onChangeText={(text2) => this.setState({password: text2})}/>

      <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonYellow]}>
      <Text>Submit thiz shiz Boi</Text>
      </TouchableOpacity>
      </View>
    );
  }

});


var Login = React.createClass({
  componentDidMount(){
    console.log('eyyy1');
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      console.log(result, username, password);
      if (username && password) {
        console.log('You made it?!', this.props.navigator)
        this.props.navigator.push({
          component: Users,
          title: "Users",
          passProps: {
            username: username,
            password: password
          },
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.messages
        });
      }
    })
    .catch(err => console.log(err))
  },
  messages(){
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    })
  },
  press() {
    this.props.navigator.push({
      component: Login1,
      title: "Login"
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
  buttonPink:{
    backgroundColor: 'pink'
  },
  buttonYellow:{
    backgroundColor: 'yellow'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});

AppRegistry.registerComponent('hohoho', () => hohoho );
