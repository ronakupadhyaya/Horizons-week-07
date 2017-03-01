import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  NavigatorIOS,
  AsyncStorage,
  ListView,
  MapView
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
  getInitialState() {
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if (responseJson.success) {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        });
      } else {
        console.log('error')
      }
    })
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([])
    };
  },
  touchUser(user){
    console.log(user)
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
      console.log(responseJson);
      if (responseJson.success) {
        Alert.alert(
          'Notification',
          'Your Ho Ho Ho! to ' + user.username + ' has been sent!',
          [{text: 'Dismiss Button'}] // Button
        )
      } else {
        Alert.alert(
          'Notification',
          'Your Ho Ho Ho! to ' + user.username + ' has NOT been sent!',
          [{text: 'Dismiss Button'}] // Button
        )
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },
  sendLocation(user){
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Got position:", position);
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
          console.log(responseJson);
          if (responseJson.success) {
            Alert.alert(
              'Notification',
              'Your Ho Ho Ho! to ' + user.username + ' has been sent!',
              [{text: 'Dismiss Button'}] // Button
            )
          } else {
            Alert.alert(
              'Notification',
              'Your Ho Ho Ho! to ' + user.username + ' has NOT been sent!',
              [{text: 'Dismiss Button'}] // Button
            )
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },
  render() {
    return (
      <View style={styles.container}>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <TouchableOpacity
        onLongPress={this.sendLocation.bind(this, rowData)}
        delayLongPress={400}
        onPress = {this.touchUser.bind(this, rowData)}>
        <Text>{rowData.username}</Text>
        </TouchableOpacity>}
        />
        </View>
      )
    }
  })

  var Messages = React.createClass({
    getInitialState() {
      fetch('https://hohoho-backend.herokuapp.com/messages')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success) {
          this.setState({
            dataSource: ds.cloneWithRows(responseJson.messages)
          });
        } else {
          console.log('error')
        }
      })
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        dataSource: ds.cloneWithRows([])
      };
    },
    render(){
      return(
        <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =><View><Text> From: {rowData.from.username},
        To: {rowData.to.username} @ {rowData.timestamp}</Text>
        {(rowData.location && rowData.location.longitude &&
          <MapView style={{height:200}}
          showsUserLocation={true}
          scrollEnabled={false}
          region={{
            longitude: rowData.location.longitude,
            latitude: rowData.location.latitude,
            longitudeDelta: 1,
            latitudeDelta: 1
          }}
          annotations={[{
            latitude: 33.6434822,
            longitude: -117.5809571,
            title: "Ethan's School"
          }]}
          />)}
          </View>}
          />
        )
      }
    })



    var Register = React.createClass({
      setInitialState() {
        this.state={
          username: '',
          password: ''
        };
      },
      press() {
        console.log(this.state.username);
        console.log(this.state.password);
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
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success) {
            this.props.navigator.pop();
          } else {
            console.log(responseJson);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      render() {
        return (
          <View style={styles.container}>
          <Text style={styles.textBig}>Register</Text>
          <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          />
          <TextInput
          style={{height: 40}}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          />
          <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
          </TouchableOpacity>
          </View>
        );
      }
    });


    var actualLogin = React.createClass({
      setInitialState() {
        this.state={
          username: '',
          password: '',
          message: ' '
        };
      },
      componentDidMount(){
        console.log('inside DidMount')
        AsyncStorage.getItem('user')
        .then(result => {
          var parsedResult = JSON.parse(result);
          var username = parsedResult.username;
          var password = parsedResult.password;
          console.log(username)
          console.log(password)
          if (username && password) {
            fetch('https://hohoho-backend.herokuapp.com/login', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                username: username,
                password: password
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              if (responseJson.success) {
                this.props.navigator.push({
                  component: Users,
                  title: "Users",
                  rightButtonTitle: 'Messages',
                  onRightButtonPress: this.messages
                })
              } else {
                this.setState({
                  message: responseJson.error
                })
              }
            })
          }
        })
        .catch(err => { console.log(err)})
      },
      press() {
        console.log(this.state.username);
        console.log(this.state.password);
        fetch('https://hohoho-backend.herokuapp.com/login', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success) {
            AsyncStorage.setItem('user', JSON.stringify({
              username: this.state.username,
              password: this.state.password
            }));
            this.props.navigator.push({
              component: Users,
              title: "Users",
              rightButtonTitle: 'Messages',
              onRightButtonPress: this.messages
            })
          } else {
            this.setState({
              message: responseJson.error
            })
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      messages(){
        this.props.navigator.push({
          component: Messages,
          title: 'Messages'
        })
      },
      render() {
        return (
          <View style={styles.container}>
          <Text style={styles.textBig}>Login</Text>
          <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          />
          <TextInput
          style={{height: 40}}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          />
          <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
          </TouchableOpacity>

          </View>
        );
      }
    });



    var Login = React.createClass({
      press() {
        this.props.navigator.push({
          component: actualLogin,
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
      buttonLabel: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white'
      }
    });

    AppRegistry.registerComponent('hohoho', () => hohoho );
