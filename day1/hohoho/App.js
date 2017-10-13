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
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
const SERVER_URL = "https://hohoho-backend.herokuapp.com";
const DEFAULT_LAT_DELTA = 0.0250;
const DEFAULT_LON_DELTA = 0.0125;


//Screens
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  press() {
    this.props.navigation.navigate('Login');
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


class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount(){
    AsyncStorage.getItem('user')
    .then((credentials)=>{
      credentials = JSON.parse(credentials);
      var username = credentials.username;
      var password = credentials.password;
      if(username && password){
         this.setState({username,password})
         this.handleLogin();
      }
    })
    .catch((error)=>{
      alert('Error loading login credentials');
    });
  }


  handleLogin(){
    fetch(`${SERVER_URL}/login`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username || false,
        password: this.state.password || false
      })
    })
    .then((resp)=>
      resp.json()
    ).then((respJson)=>{
      if(!respJson.success){
        throw('Error!');
      }
      return AsyncStorage.setItem('user', JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }));
    }).then(()=>{
      this.props.navigation.navigate('Users');
    }).catch((err)=>{
      alert('Error: login failed.');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          placeholder="Username"
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          placeholder="Password"
        ></TextInput>
        <TouchableOpacity onPress={()=>this.handleLogin()} style={styles.button}>
          <Text style={{fontSize: 20, color: 'white'}}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class RegisterScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Register'
  };

  handleRegister(){
    fetch(`${SERVER_URL}/register`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((resp)=>
      resp.json()
    ).then((respJson)=>{
      alert('Success! Account created for ' + respJson.user.username + '.');
      this.props.navigation.navigate('Home');
    }).catch((err)=>{
      alert('Error: account not registerd.');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          placeholder="Username"
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          placeholder="Password"
        ></TextInput>
        <TouchableOpacity onPress={()=>this.handleRegister()} style={styles.button}>
          <Text style={{fontSize: 20, color: 'white'}}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

//Other Components
class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  constructor(props){
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  messages(){
    this.props.navigation.navigate('Messages');
  }

  componentDidMount(){
    fetch(`${SERVER_URL}/users`,{
      method: 'GET'
    })
    .then((resp)=>(
      resp.json()
    ))
    .then((respJson)=>{
      if(!respJson.success){
        throw('Error');
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(respJson.users)
      });
    })
    .catch((err)=>{
      alert('Error loading friends.');
    });

    this.props.navigation.setParams({
      onRightPress: ()=>(this.messages())
    });
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted'){
      alert('Enable location sharing in settings.');
    }
    else{
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.touchUser(user,location.coords);
    }
  }

  touchUser(user, coords){
    fetch(`${SERVER_URL}/messages`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: (coords ? coords.longitude : false),
          latitude: (coords ? coords.latitude : false)
        }
      })
    })
    .then((resp)=>(
      resp.json()
    ))
    .then((respJson)=>{
      var message = `Your 'Ho Ho Ho!' to ${user.username} `;
      if(respJson.success){
        message += 'has been sent.';
      }
      else{
        message += 'cound not be sent.';
      }
      alert(message);
    })
    .catch((err)=>{
      alert(`Your 'Ho Ho Ho!' to ${user.username} could not be sent.`);
    })
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <TouchableOpacity
            key={rowData._id}
            onPress={()=>this.touchUser(rowData)}
            onLongPress={()=>this.sendLocation(rowData)}
            delayLongPress={1000}
          >
            <Text
            style={{fontSize: 20}}
            >
              {rowData.username}
            </Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

class MessageScreen extends React.Component {
  static navigationOptions = {
    title: 'Message'
  };

  constructor(props){
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount(){
    fetch(`${SERVER_URL}/messages`,{
      method: 'GET'
    })
    .then((resp)=>(
      resp.json()
    ))
    .then((respJson)=>{
      if(!respJson.success){
        throw('Error');
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(respJson.messages)
      });
    })
    .catch((err)=>{
      alert('Error loading messages.');
    })
  }

  renderMapView(rowData){
    if(rowData.location && rowData.location.longitude){
      return(
        <MapView
          style={{height: 200, alignSelf: 'stretch'}}
          region={{
            latitude: rowData.location.latitude,
            longitude: rowData.location.longitude,
            latitudeDelta: DEFAULT_LAT_DELTA,
            longitudeDelta: DEFAULT_LON_DELTA
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: rowData.location.latitude,
              longitude: rowData.location.longitude
            }}
            title={rowData.from.username}
          />
        </MapView>
      );
    }
  }

  render() {
    return (
      <ListView
        className='containerFull'
        style={{display:'flex'}}
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <View
            className='containerFull'
          >
            <Text
            key={rowData._id}
            style={{fontSize: 10}}
            >
              {`${rowData.from.username} -> ${rowData.to.username}\nTime: ${rowData.timestamp}\n${rowData.body}`}
            </Text>
            {this.renderMapView(rowData)}
          </View>
        }
      />
    );
  }
}



//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UserScreen,
  },
  Messages: {
    screen: MessageScreen,
  }
}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
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
