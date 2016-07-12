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
  RefreshControl
} from 'react-native'
import reactNative from 'react-native'

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

var Register = React.createClass({
  register() {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    console.log('tapped register');
    console.log('---------------------------------------------------------')
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
      if (responseJson.success) {
        this.props.navigator.push({
          component: Login,
          title: "Login"
        });
      }
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log(responseJson);
      console.log('---------------------------------------------------------')
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log(err)
      console.log('---------------------------------------------------------')

    });
  },
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{left:100,height:40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{left:100,height:40}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
            <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Login = React.createClass({
  getInitialState() {
    return {
      message: ""
    }
  },

  toMessage() {
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    });
  },
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
      if (responseJson.success) {
        this.props.navigator.push({
          component: Users,
          title: "Users",
          rightButtonTitle:"Messages",
          onRightButtonPress:this.toMessage
        });
      } else {
        this.setState({message:responseJson.error})
      }
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log(responseJson)
      console.log('---------------------------------------------------------')
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */

      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log(err)
      console.log('---------------------------------------------------------')

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
        <Text style={styles.textError}> {this.state.message} </Text>
        <TextInput
          style={{left:100,height:40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{left:100,height:40}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
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

var Users = React.createClass({
  getInitialState() {
    var that = this
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
         "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        that.setState( {
          dataSource: ds.cloneWithRows(responseJson.users)
        });
      }
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log(err)
      console.log('---------------------------------------------------------')

    });

    return {
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    }

  },
  _onRefresh() {
    this.setState({refreshing: true});
    var that = this
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
         "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        that.setState( {
          dataSource: ds.cloneWithRows(responseJson.users),
          refreshing: false
        });
      }
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log(err)
      console.log('---------------------------------------------------------')

    });
  },
  touchUser(user) {
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
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log('212', responseJson)
      console.log('---------------------------------------------------------')
      if (responseJson.success) {
        reactNative.Alert.alert(
          'Success',
          'Your HOHOHO to ' + user.username + ' has been sent',
          [{text: 'k'}] // Button
        )
      } else {
        reactNative.Alert.alert(
          'SHIT',
          'Your HOHOHO to ' + user.username + ' could not been sent',
          [{text: 'FUCK ME'}] // Button
        )
      }
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */

      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log('234',err)
      console.log('---------------------------------------------------------')

    });
  },
  render() {
    return (

      <View style={styles.container2}>
        <ListView
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderRow={(rowData) =>
            <View style={styles.userbox}>
              <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
                <Text style={styles.textUser}>{rowData.username}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    )
  }
})



var Messages = React.createClass({
  getInitialState() {
    var that = this
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
         "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        that.setState( {
          dataSource: ds.cloneWithRows(responseJson.messages)
        });
      }
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      console.log(err)
      console.log('---------------------------------------------------------')

    });

    return {
      dataSource: ds.cloneWithRows([])
    }

  },
  render() {
    return (
      <View style={styles.container2}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <View style={styles.userbox}>
                <Text style={styles.textUser2}>From : {rowData.from.username}</Text>
                <Text style={styles.textUser2}>To : {rowData.to.username}</Text>
                <Text style={styles.textUser2}>{rowData.timestamp}</Text>
            </View>
          }
        />
      </View>
    )
  }
})



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection:'row'
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
  textError: {
    fontSize: 26,
    textAlign: 'center',
    margin: 10,
    color: '#FF585B'
  },
  textUser:{
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'blue'
  },
  textUser2:{
    fontSize: 20,
    margin: 10,
    color: 'green'
  },
  userbox:{
    flex:1,
    padding:2,
    borderBottomWidth:1
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
