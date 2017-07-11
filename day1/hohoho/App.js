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
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper';
//Screens
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  login() {
    this.props.navigation.navigate('Login');
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.login()} } style={[styles.button, styles.buttonGreen]}>
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
  static navigationOptions = {
    title: 'Register'
  };

  constructor() {
    super();
    this.state = {
      username:'',
      password:''
    }
  };

  home() {
    this.props.navigation.navigate('Home');
  }

  press() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: self.state.username,
        password: self.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      self.home()
    })
    .catch((err) => {
      console.log(err)
    });
  }

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
          style={{height:70}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={text => this.setState({password:text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super();
    this.state = {
      username:'',
      password:'',
      error:'',
    }
  };

  componentDidMount() {
    console.log("mounting");
    const self = this;
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        console.log(parsedResult);
        if (parsedResult) {
          var username = parsedResult.username;
          var password = parsedResult.password;
          if (username && password) {
            return self.login(username, password)
              .then(resp => resp.json())
              .then(responseJson => {
                if (responseJson.success) {
                  self.swiper();
                } else {
                  self.setState({error:"invalid account"});
                }
              })
          }
        }
      })
      .catch( err => {
        console.log(err);
        self.setState({error:err});
      })
  }

  login(username,password) {
    console.log("inside login");
    const self = this;
    const promise = fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
    return promise;
  }

  swiper() {
    this.props.navigation.navigate('Swipe');
  };

  press() {
    console.log("pressed");
    const self = this;
    return self.login(self.state.username,self.state.password)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success) {
          AsyncStorage.setItem('user', JSON.stringify({
            username: self.state.username,
            password: self.state.password
          }))
            .then(() => self.swipe());
        } else {
          self.setState({error:"invalid account"});
        }
      })
      .catch((err) => {
        self.setState({error:err});
      })
  };

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
          style={{height:70}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={text => this.setState({password:text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Submit</Text>
          <Text style={styles.textBig}>{this.state.error}</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);
    const self = this;
    const ds = new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
    this.state = {
      ds: ds,
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    };
    this._onRefresh.bind(self)();
  };

  // componentDidMount() {
  //   const self = this;
  //   self.props.navigation.setParams({
  //     onRightPress: self.messages.bind(self),
  //   })
  // };

  sendHOHOHO(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to:user._id
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Your hohoho data has been sent',
          [{text: 'Awesome'}] // Button
        )
      }
    })
  };

  _onRefresh() {
    const ds = this.state.ds;
    console.log(ds);
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson.users.length !== 0) {
        console.log(responseJson);
        this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log("have no permission");
    } else {
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      console.log(location);
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id,
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          }
        })
      })
      .then(resp => resp.json())
      .then(responseJson => {
        if (responseJson.success) {
          Alert.alert(
            'Success',
            'Your location data has been sent',
            [{text: 'HOHOHO'}] // Button
          )
        }
      })
    }
  }

  render() {
    console.log("in rendering");
    return(
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />}
          dataSource = {this.state.dataSource}
          renderRow = { row => (
            <TouchableOpacity
              onPress={this.sendHOHOHO.bind(this,row)}
              onLongPress={this.sendLocation.bind(this, row)}
              >
              <Text>user</Text>
              <Text>{row.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
};

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    const self = this;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson.messages);
      if (responseJson.messages.length !== 0) {
        self.setState({dataSource:ds.cloneWithRows(responseJson.messages)})
      }
    })
    .catch(err => {
      console.log(err);
    })
  };

  render() {
    return(
      <View style={styles.container}>
        <ListView
          renderRow = {(row) => (
            <View>
              <Text>From: {row.from.username}</Text>
              <Text>To: {row.to.username}</Text>
              <Text>Message: {row.body}</Text>
              <Text>When: {row.timestamp}</Text>
              <View>
                {row.location ? <MapView style={{width:200,height:100}} showsUserLocation={true} scrollEnabled={false} region={{longitude: row.location.longitude, latitude: row.location.latitude, longitudeDelta: 1, latitudeDelta: 1}}/>: <Text>no location</Text>}
              </View>
            </View>
          )}
          dataSource = {this.state.dataSource}
        />
      </View>
    )
  };
}

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };

  render() {
    return (
      <Swiper>
        <View style={{flex:1}}>
          <UsersScreen />
        </View>
        <View style={{flex:1}}>
          <MessagesScreen />
        </View>
      </Swiper>
    );
  }
}

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Swipe: {
    screen: SwiperScreen,
  },
}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  swiperContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: 300,
    height: 400
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
