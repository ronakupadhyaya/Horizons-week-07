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
  AsyncStorage,
  RefreshControl,
  Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper';
// import LoginPage from './components/LoginPage'
//Screens-----------------------------------------------------------------------Login Page Component
class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      password: '',
      username: '',
      message:''
    }
  };
  static navigationOptions = {
    title: 'Login Page'
  };
  login(username, password){
    if(username.split('').join('')!=='' && password.split('').join('')!==''){
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.success){
          AsyncStorage.setItem('user', JSON.stringify({
            username: this.state.username,
            password: this.state.password
          }));
          this.props.navigation.navigate('Swiper');
        } else {
          console.log(responseJson);
          this.setState({message:responseJson.error});
        }
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }
  componentDidMount(){
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.login(username, password); //the return here is very very very important!!!
        }
        // Don't really need an else clause, we don't do anything in this case.
      })
      .catch(err => { console.log(err) })
  }
  render(){
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={ () => {this.login(this.state.username,this.state.password)} } style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <Text>{this.state.message}</Text>
      </View>
    )
  }
}
//------------------------------------------------------------------------------Default Login screen
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login Screen'
  };

  press() {
    console.log('pressed')
    console.log(this.props.navigation.navigate)
    this.props.navigation.navigate('LoginPage');
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
//------------------------------------------------------------------------------Registration Screen
class RegisterScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username:'',
      password:''
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  register(username,password){
    if(username.split('').join('')!=='' && password.split('').join('')!==''){
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('success?',responseJson.success)
        if(responseJson.success){
          // this.props.navigation.navigate('Login')
          this.props.navigation.goBack();
        } else {
          console.log(responseJson);
        }
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
      })
      .catch((err) => {
        console.log(err)
        /* do something if there was an error with fetching */
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          // value={this.state.password.split('').map(item => 'X').join('')}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={()=>this.register(this.state.username,this.state.password)}>
          <Text style={styles.buttonGreen, styles.button}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

//------------------------------------------------------------------------------User Screen
class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      refreshing: false
    };
  }
  fetchData(){
    console.log('fetching data!')
    return fetch('https://hohoho-backend.herokuapp.com/users')
    //need the return here because while fetching, this returns a promise!
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        this.setState({
          dataSource: responseJson.users
        });
      } else {
        console.log(responseJson);
      }
    })
    .catch((err) => {
      console.log(err)
    });
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });
  componentDidMount(){
    this.fetchData();
  }
  // componentDidMount() {
  //   this.props.navigation.setParams({
  //     onRightPress: this.messages.bind(this)
  //   })
  // };
  // the above section will not exist anymore when using Swipe
  touchUser(user,latitude,longitude){
    fetch('https://hohoho-backend.herokuapp.com/messages',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: longitude,
          latitude: latitude
        }
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if(responseJson.success){
        Alert.alert(
          'Success',
          'Your Ho Ho Ho! to '+user.username+' has been sent together with your location latitude '
          +latitude+' longitude '+longitude,
          [{text: 'Dismiss Button'}] // Button
        )
      } else {
        Alert.alert(
          'Failure',
          'Your Ho Ho Ho! to '+user.username+' and your location could not be sent!',
          [{text: 'Dismiss Button'}] // Button
        )
        console.log(responseJson.error)
      }
    })
  }
  messages(){
    this.props.navigation.navigate('Messages')
  }
  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //handle failure
      return; //possibly?
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    console.log(location);
    this.touchUser(user,location.coords.latitude,location.coords.longitude);
    //I added a bind this
  }
  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData().then(() => { //to do so, this.fetchData should be a async function!
      this.setState({refreshing: false});
    });
  }
  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <View style={styles.container}>
        <ListView
          refreshControl={
          <RefreshControl //this enables a pull to refresh
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />}
          dataSource={ds.cloneWithRows(this.state.dataSource)}
          renderRow={(rowData) =>
            <TouchableOpacity
              onPress={this.touchUser.bind(this,rowData,null,null)}
              onLongPress={this.sendLocation.bind(this,rowData)}
              delayLongPress={1000} //hardcoded num of milliseconds
              >
              <Text>{rowData.username}</Text>
            </TouchableOpacity>}
        />
      </View>
    )
  }
}

//------------------------------------------------------------------------------Messages
class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      refreshing: false
    };
  }
  fetchData(){
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        this.setState({
          messages: responseJson.messages,
          refreshing: false //or better, after every fetch, automatically disable refresh
        });
      } else {
        console.log(responseJson.error);
      }
    })
    .catch((err) => {
      console.log(err)
    });
  }
  componentDidMount(){
    // setInterval(()=>this.fetchData(), 5000);
    this.fetchData();
    // this.fetchData.bind(this);
  };
  static navigationOptions = {
    title: 'Messages'
  };
  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
  };
  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log('directe to messages successfully')
    return(
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={ds.cloneWithRows(this.state.messages)}
          renderRow={(rowData) => {
              const mapView = (rowData.location && rowData.location.longitude) ?
              <MapView
                style={{
                  width:"100%",
                  height:100
                }} // remember to check the style
                showsUserLocation={true} //this will automatically ask permission and get user location!!
                scrollEnabled={true}
                region={{ //where the map is centered
                  longitude: rowData.location.longitude,
                  latitude: rowData.location.latitude,
                  longitudeDelta: 0.05,
                  latitudeDelta: 0.05
                }}>
                <MapView.Marker
                  coordinate={{
                    latitude: rowData.location.latitude,
                    longitude: rowData.location.longitude
                  }}
                />
              </MapView> : null;

             return (<View style={styles.messages}>
                <Text>From:{rowData.from.username}</Text>
                <Text>To: {rowData.to.username}</Text>
                <Text>Message: {rowData.body}</Text>
                <Text>When: {rowData.timestamp}</Text>
                <Image source={require(rowData.photo)} />
                {mapView}
              </View>)
          }
          }
        />
      </View>
    )
  }
}
//------------------------------------------------------------------------------SwiperScreen
class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };

  render() {
    return (
      <Swiper>
        <UserScreen />
        <Messages />
      </Swiper>
    );
  }
}

//Navigator
export default StackNavigator({ //similar to mapstate to props
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  LoginPage: {
    screen: LoginPage, //this is the one that ask for user to key in information
  },
  Users: {
    screen: UserScreen,
  },
  Messages: {
    screen: Messages,
  },
  Swiper: {
    screen: SwiperScreen,
  }
}, {initialRouteName: 'Login'});


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
  },
  input: {
    height: 40,
    textAlign: 'center',
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1
  },
  messages: {
    // borderWidth:10,
    // height: 60,
    // backgroundColor: 'red',
    // borderStyle: 'solid',
    borderColor: 'gray',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    flex:1
  }
});
