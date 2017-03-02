import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  NavigatorIOS,
  ListView,
  AsyncStorage,
  MapView,
  Image,
  ImagePickerIOS
} from 'react-native'
import Swiper from 'react-native-swiper'

class Messages extends Component{
  constructor() {
    super();
    this.state = {
      dataSource:[],
      difference: 0
    };

    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      this.setState({
        dataSource: responseJson.messages
      });
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  componentDidMount(){

    setInterval(() => {

      fetch('https://hohoho-backend.herokuapp.com/messages')
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {

        if(responseJson.messages.length > this.state.dataSource.length){
          var diff = responseJson.messages.length - this.state.dataSource.length;
          for(var i=0; i<diff; i++){
            responseJson.messages[i].new = true;
          }

          this.setState({
            dataSource: responseJson.messages,
            difference: diff

          });
        }else{
          this.setState({
            dataSource: responseJson.messages,
            difference: diff
          });
        }
      })
      .catch(error => {
        console.log('error', error);
      });

    }, 10000);
  }

  /*
  //****To Render a map of the location****
  renderObj(rowData){
    if(rowData.new){
      return (
        <View style={{backgroundColor: '#e74c3c', borderColor: '#527FE4', borderWidth: 5, padding: 10}}>
          <Text>From: {rowData.from.username}</Text>
          <Text>To: {rowData.to.username}</Text>
          <Text>Message: {rowData.body}</Text>
          <Text>When: {rowData.timestamp}</Text>

          {rowData.location && rowData.location.longitude && rowData.location.latitude && <MapView
            style={{height: 200, margin: 40}}
            showsUserLocation={true}
            scrollEnabled={false}
            region={{
              longitude: rowData.location.latitude,
              latitude: rowData.location.longitude,
              longitudeDelta: 1,
              latitudeDelta: 1
            }}
            annotations={[{
              latitude: rowData.location.latitude,
              longitude: rowData.location.longitude,
              title: "Ethan's School"
            }]}
          />}
        </View>
      );
    }else{
      return (
        <View style={{backgroundColor: '#b6cbed', borderColor: '#527FE4', borderWidth: 5, padding: 10}}>
          <Text>From: {rowData.from.username}</Text>
          <Text>To: {rowData.to.username}</Text>
          <Text>Message: {rowData.body}</Text>
          <Text>When: {rowData.timestamp}</Text>
          {console.log(rowData.location)}
          {rowData.location && rowData.location.longitude && rowData.location.latitude && <MapView
            style={{height: 200, margin: 40}}
            showsUserLocation={true}
            scrollEnabled={false}
            region={{
              longitude: rowData.location.latitude,
              latitude: rowData.location.longitude,
              longitudeDelta: 1,
              latitudeDelta: 1
            }}
            annotations={[{
              latitude: rowData.location.latitude,
              longitude: rowData.location.longitude,
              title: "Ethan's School"
            }]}
          />}
        </View>
      );
    }
  }
  */

  renderObj(rowData){
    if(rowData.new){
      return (
        <View style={{backgroundColor: '#e74c3c', borderColor: '#527FE4', borderWidth: 5, padding: 10}}>
          <Text>From: {rowData.from.username}</Text>
          <Text>To: {rowData.to.username}</Text>
          <Text>Message: {rowData.body}</Text>
          <Text>When: {rowData.timestamp}</Text>

          {rowData.photo && <Image
            style={{height: 200, margin: 40}}
            source={{uri: rowData.photo}}
          />}
        </View>
      );
    }else{
      return (
        <View style={{backgroundColor: '#b6cbed', borderColor: '#527FE4', borderWidth: 5, padding: 10}}>
          <Text>From: {rowData.from.username}</Text>
          <Text>To: {rowData.to.username}</Text>
          <Text>Message: {rowData.body}</Text>
          <Text>When: {rowData.timestamp}</Text>

          {rowData.photo && <Image
            style={{height: 200, margin: 40}}
            source={{uri: rowData.photo}}
          />}
        </View>
      );
    }
  }

  render(){
    var ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1 !== r2)
    });

    return(
      <ListView
        dataSource={ds.cloneWithRows(this.state.dataSource)}
        renderRow={(rowData) => this.renderObj(rowData)}
      />
    );
  }
}


class Users extends Component{

  constructor() {
    super();
    var ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1 !== r2)
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    };


    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      });
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  touchUser(user){
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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if(responseJson.success){
        var username = user.username;
        Alert.alert(
          'Success',
          'Your HoHoHo to ' + username + 'has been sent.',
          [{text: 'Cool'}] // Button
        );
      }else{
        Alert.alert(
          'Failure',
          'Your HoHoHo to ' + username + 'DID NOT send.',
          [{text: 'Shit'}] // Button
        );
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("error: ", err);
    });
  }

  sendPhoto(user){

    console.log('HIT HERE 111111');

    ImagePickerIOS.openSelectDialog({}, imageUri => {

      var formData = new FormData();
      formData.append('photo', {
        uri: imageUri,
        type: 'multipart/form-data',
        name: 'whatever.jpg'
      });

      formData.append('to', user._id);

      console.log('2222222222');

      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })
      .then( (resp) => {

        console.log('3333333333');
        return resp.json();
      })
      .then((respJson) => {
        console.log('HIT JSONRESPONSE!!!!!!');
        console.log(respJson);
      })
      .catch((err) => {
        console.log('err', err);
      })
    },
    error => console.log(error));
  }

  sendLocation(user){

    var getPos;
    navigator.geolocation.getCurrentPosition(
      position => {
        getPos = position;

        fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: user._id,
            location: {
              longitude: getPos.coords.longitude,
              latitude: getPos.coords.latitude
            }
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          /* do something with responseJson and go back to the Login view but
          * make sure to check for responseJson.success! */
          if(responseJson.success){
            var username = user.username;
            Alert.alert(
              'Success',
              'Successfully shared location with ' + username,
              [{text: 'Close'}] // Button
            );
          }else{
            Alert.alert(
              'Failure',
              'Failed to share location with ' + username,
              [{text: 'Close'}] // Button
            );
          }
        })
        .catch((err) => {
          /* do something if there was an error with fetching */
          console.log("error: ", err);
        });
      },
      error => alert(error.message), {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );


  }

  render(){
    return(
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) =>
        <TouchableOpacity onPress={this.touchUser.bind(this, rowData)} onLongPress={this.sendPhoto.bind(this, rowData)} delayLongPress={1000}>
          <View style={{backgroundColor: '#2ecc71', borderColor: '#9b59b6', borderWidth: 2.5, padding: 10}}>
            <Text>{rowData.username}</Text>
          </View>
        </TouchableOpacity>}
      />
    );
  }

  //RENDER FUNCTION TO RENDER AN ONPRESS FOR SENDING LOCATION
  // render(){
  //   return(
  //     <ListView
  //     dataSource={this.state.dataSource}
  //     renderRow={(rowData) =>
  //       <TouchableOpacity onPress={this.touchUser.bind(this, rowData)} onLongPress={this.sendLocation.bind(this, rowData)} delayLongPress={1000}>
  //         <View style={{backgroundColor: '#2ecc71', borderColor: '#9b59b6', borderWidth: 2.5, padding: 10}}>
  //           <Text>{rowData.username}</Text>
  //         </View>
  //       </TouchableOpacity>}
  //     />
  //   );
  // }
}

// This is the root view
class hohoho extends Component{
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
}


class Register extends Component{

  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    };
  }
  submitReg(){
    // console.log(this.state.username);
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
      this.props.navigator.pop();
    })
    .catch((err) => {
      console.log("error: ", err);
    });
  }

  render() {
    return (
      <View style={{flex:1,alignItems: 'center', justifyContent:'center'}}>
        <TextInput
        style={{height: 40, paddingLeft: 100}}
        placeholder="Enter your username"
        onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
        style={{height: 40, paddingLeft: 100}}
        secureTextEntry={true}
        placeholder="Enter your password"
        onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={this.submitReg.bind(this)}>
        <View style={{height:35, width:200, backgroundColor: '#FF585B'}}>
          <Text style={{paddingLeft: 70, paddingTop: 8, color:'white'}}>
          Register
          </Text>
        </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class LoginPage extends Component{

  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  login(){
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
      if(responseJson.success){
        //HERE
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }));

        this.props.navigator.push({
          component: SwiperView, //******************
          title: "Users",
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.props.messages.bind(this)
        });
      } else{
        this.setState({
          error: responseJson.error
        });
      }

    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('error', err);
    });
  }

  componentDidMount(){

    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var userName = parsedResult.username;
      var passWord = parsedResult.password;

      if(userName && passWord){
        this.setState({
          username: userName,
          password: passWord
        });

        // return this.login.bind(this)
        return this.login.bind(this);
      }
    })
    .then(login => login())
    .catch(err => (console.log("error", err)))

  }

  render() {
    return (
      <View style={{flex:1,alignItems: 'center', justifyContent:'center'}}>
        <TextInput
        style={{height: 40, paddingLeft: 100}}
        placeholder="Enter your username"
        onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
        style={{height: 40, paddingLeft: 100}}
        secureTextEntry={true}
        placeholder="Enter your password"
        onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={this.login.bind(this)}>
          <View style={{height:35, width:200, backgroundColor: '#FF585B'}}>
            <Text style={{paddingLeft: 80, paddingTop: 8, color:'white'}}>
            Login
            </Text>
          </View>
        </TouchableOpacity>
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

class Login extends Component{
  press() {
    this.props.navigator.push({
      component: LoginPage,
      title: "Login User",
      passProps: { messages: this.messages }
    });
  }

  messages(){
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    });
  }

  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  }
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Login to HoHoHo!</Text>
      <TouchableOpacity onPress={this.press.bind(this)} style={[styles.button, styles.buttonGreen]}>
      <Text style={styles.buttonLabel}>Tap to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register.bind(this)}>
      <Text style={styles.buttonLabel}>Tap to Register</Text>
      </TouchableOpacity>
      </View>
    );
  }
}

class SwiperView extends Component{

  render(){
    return (
      <Swiper>
        <Users />
        <Messages />
      </Swiper>
    );
  }

}


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
