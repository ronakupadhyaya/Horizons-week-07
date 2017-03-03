import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  Alert,
  AsyncStorage,
  MapView,
  Image,
  ImagePickerIOS,
  ListView
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: '',
      typedUser: '',
      typedPwd: ''
    }
  },
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
  registering() {
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
    .then((resp) => resp.json())
    .then((json) => {
      this.props.navigator.pop();
    })
  },
  render() {
    return (
      <View style={styles.container}>
      <TextInput
      style={styles.inputField}
      placeholder='Enter your username'
      onChangeText={(text) => this.setState({
        username: text
      })}/>
      <TextInput
      style={styles.inputField}
      secureTextEntry={true}
      placeholder='Enter your password'
      onChangeText={(pwd) => this.setState({
        password: pwd
      })}/>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.registering}>
      <Text style={styles.buttonLabel}>Register</Text>
      </TouchableOpacity>

      </View>
    );
  }
});

var LoggingIn = React.createClass({
  loggingIn() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.typedUser,
        password: this.state.typedPwd
      })
    })
    .then((resp) => resp.json())
    .then((json) => {
      console.log('Login success');
      AsyncStorage.setItem('user', JSON.stringify({
        username: this.state.typedUser,
        password: this.state.typedPwd
      }))
      this.props.navigator.push({
        component: Users,
        title: 'All Users',
        rightButtonTitle: 'Messages',
        onRightButtonPress: this.messages
      })
    })
    .catch((err) => console.log('Error: ', err))

  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: 'Messages'
    })
  },
  render() {
    return (
      <View style={styles.container}>
      <TextInput
      style={styles.inputField}
      placeholder='Enter your username'
      onChangeText={(text) => this.setState({
        typedUser: text
      })}/>
      <TextInput
      style={styles.inputField}
      secureTextEntry={true}
      placeholder='Enter your password'
      onChangeText={(pwd) => this.setState({
        typedPwd: pwd
      })}/>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.loggingIn}>
      <Text style={styles.buttonLabel}>Login</Text>
      </TouchableOpacity>

      </View>
    )
  }
})

var Messages = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method:'GET',
      headers: {
        "Content-Type": "application/json"
      }})
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          dataSource: ds.cloneWithRows(json.messages)
        })
      })
      .catch((err) => console.log('Error', err))

      return {
        dataSource: ds.cloneWithRows([])
      }
    },

    getMessages() {
      return (

        <View>
        <ListView dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <View style={styles.msgContainer}>
          <Text style={styles.msg}>To: {rowData.to.username}</Text>
          <Text style={styles.msg}>From: {rowData.from.username}</Text>
          <Text style={styles.msg}>Message: {rowData.body}</Text>
          <Text style={styles.msg}>When: {rowData.timestamp}</Text>

          {(rowData.photo &&
            <Image style={{width: 300, height: 300, alignItems:'center', justifyContent:'center'}}
            source={{url: rowData.photo}}/>)}


          {(rowData.location && rowData.location.longitude &&
            <MapView
            style={{height: 200, marginRight: 10}}
            showsUserLocation={true}
            scrollEnabled={false}
            region={{
              longitude: rowData.location.longitude,
              latitude: rowData.location.latitude,
              longitudeDelta: 1,
              latitudeDelta: 1
            }}
            annotations={[{
              longitude: rowData.location.longitude,
              latitude: rowData.location.latitude,
              title: rowData.username + '\'s location'
            }]}
            />
          )}
          </View>

        }
        />

        </View>
      )
    },

    render() {
      return (
        <View>{this.getMessages()}</View>
      )
    }
  });

  var Users = React.createClass({
    getInitialState() {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      fetch('https://hohoho-backend.herokuapp.com/users', {
        method:'GET',
        headers: {
          "Content-Type": "application/json"
        }})
        .then((resp) => resp.json())
        .then((json) => {
          this.setState({
            dataSource: ds.cloneWithRows(json.users)
          })
        })
        .catch((err) => console.log('Error', err))

        return {
          dataSource: ds.cloneWithRows([]),
          lat: null,
          long: null
        }
      },
      touchUser(item) {
        fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: item._id
          })
        })
        .then((resp) => resp.json())
        .then((json) => {
          console.log('suhhhh', item._id);
          Alert.alert(
            'Success',
            'Your message to ' + item.username + ' has been sent.',
            [{text: 'Cool'}]
          )})
          .catch((err) => console.log('Error: ', err))
        },
        sendLocation(item) {
          navigator.geolocation.getCurrentPosition((position) => {
            var initialPosition = JSON.stringify(position);
            this.setState({
              lat: position.coords.latitude,
              long:position.coords.longitude
            })
          });

          fetch('https://hohoho-backend.herokuapp.com/messages', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: item._id,
              location: {
                latitude: this.state.lat,
                longitude: this.state.long
              }
            })
          })
          .then((resp) => resp.json())
          .then((json) => {
            console.log('sent location', this.state.lat);
            alert('i sent sumsing' + this.state.lat + ' , ' + this.state.long)
          })
          .catch((err) => console.log('Error: ', err))
        },
        choosePhoto(item) {
          console.log('i sent somethuerifjdgns');
          ImagePickerIOS.openSelectDialog({},

            imageUri => {
              var photo = {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'photo.jpg'
              }

              var body = new FormData();
              body.append('to', item._id);
              body.append('photo', photo);
              fetch('https://hohoho-backend.herokuapp.com/messages', {
                method: 'POST',
                headers: {
                  "Content-Type": "multipart/form-data"
                },
                body: body
              })
              .then((resp) => resp.json())
              .then((json) => {

                Alert.alert(
                  'Success',
                  'Your photo to ' + item.username + ' has been sent.',
                  [{text: 'Cool'}]
                )})
                .catch((err) => console.log('Error here: ', err))

            },
            error => console.log('Error: ', error)
          )
        },
        render() {
          console.log('users: ', this.state.dataSource);
          return (

            <View style={styles.container}>
            <ListView dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <View style={styles.msgContainer}>
              <TouchableOpacity
              onPress={this.touchUser.bind(this, rowData)}
              onLongPress={this.choosePhoto.bind(this, rowData)}
              delayLongPress={2000}>

              <Text style={styles.names}>{rowData.username}</Text>

              </TouchableOpacity>
              </View>}
              />
              </View>
            )
          }
        });

        var Login = React.createClass({
          press() {
            this.props.navigator.push({
              component: LoggingIn,
              title: 'Login'
            })
          },
          register() {
            this.props.navigator.push({
              component: Register,
              title: "Register"
            });
          },
          messages() {
            this.props.navigator.push({
              component: Messages,
              title: 'View messages'
            })
          },
          login(username, password) {
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
            .then((resp) => resp.json())
            .then((json) => {
              console.log('Login success');
              this.props.navigator.push({
                component: Users,
                title: 'All Users',
                rightButtonTitle: 'Messages',
                onRightButtonPress: this.messages
              })
            })
            .catch((err) => console.log('Error: ', err))
          },
          componentDidMount() {
            AsyncStorage.getItem('user')
            .then((result) => {
              var parsedResult = JSON.parse(result);
              var username = parsedResult.username;
              var password = parsedResult.password;
              if (username && password) {
                this.login(username, password);
              }
            })
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
          names: {
            alignSelf:'center',
            borderBottomWidth: 2,
            borderColor: 'pink',
            marginTop: 10
          },
          msg: {
            alignSelf:'flex-start',
            borderBottomWidth: 2,
            borderColor: 'pink',
            marginTop: 5
          },
          msgContainer: {
            borderBottomWidth: 2,
            borderColor: 'black',
            paddingLeft: 10
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
          inputField: {
            alignSelf: 'stretch',
            paddingTop: 10,
            height: 40,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 10,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'gray'
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
