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
  Image,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {
  Location,
  Permissions,
  MapView
} from 'expo';

//Screens
class LoginScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      message: false,
    }
    this.login = this.login.bind(this);

  }

  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount(){
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        return this.login(username, password);
      }
      // Don't really need an else clause, we don't do anything in this case.
    })
    .catch(err => {
      console.log('error mounting component: ', err);
    });
  }

  login(username, password){
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
      })
    })
    .then(resp => resp.json())
    .then((responseJ) => {
      if (responseJ.success){
        this.setState({
          username,
          password,
        });
        this.props.navigation.navigate('Users');
      } else {
        console.log('error', responseJ.error);
      }
    })
    .catch((err) => {
      console.log('something went wrong', err);
    });
  }

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
      if (responseJson.success){
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
        .then(() => {
          this.props.navigation.navigate('Users');
          console.log('success!!!');
        })
      } else {
        this.setState({message: 'invalid login, sorry'})
      }
    })
    .catch((err) => {});
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('./img/smack.png')}
          style={styles.logo}
        />
        <Text style={styles.textBig}>Smack Dat</Text>
        <TextInput
          style={styles.register}
          placeholder="Enter a username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <Text>{this.state.message}</Text>
        <TextInput
          style={styles.register}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonPurple]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonWhite]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabelPurple}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.register}
          placeholder="Enter a username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.register}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={() => {
          fetch('https://hohoho-backend.herokuapp.com/register', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
            }),
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.success){
              // console.log(responseJson.success);
              this.props.navigation.goBack();
            } else {
              console.log('something went wrong');
            }
          })
          .catch((err) => {
            console.log('error', err);
          });
        }} >
        <Text style={styles.textBig}>Register</Text>
      </TouchableOpacity>
    </View>
  )
}
}

//Users
class UserScreen extends React.Component {

  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
    this.touchUser = this.touchUser.bind(this);
    this.messages = this.messages.bind(this);
    this.sendLocation = this.sendLocation.bind(this);
  }

  componentDidMount(){
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((respJson) => {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(respJson.users)
      });
      // console.log(respJson);
    })
    .catch((err) => {
      console.log('error', err);
    })
    this.props.navigation.setParams({
      onRightPress: () => {this.messages()}
    })
  }

  touchUser(user){
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      body: JSON.stringify({
        to: user._id
      }),
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((res) => {
      res.json();
      // console.log(res);
    })
    .then((resJson) => {
      // console.log(resJson);
      Alert.alert(
        'Success!',
        'You have successfully smacked dat ' + user.username + '!',
        [{text: 'Yuhh'}]
      )
      // console.log('message sent to ' + user.username);
    })
    .catch((err2) => {
      console.log('error!', err2);
    })
  };

  messages(){
    this.props.navigation.navigate('Messages')
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //handle failure
      console.log('oh no!', status);
      return;
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    // console.log(location);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        }
      })
    })
    .then((res) => {
      // console.log(res);
      return res.json();
    })
    // .then(res => res.json())
    .then((resJson) => {
      if (resJson.success){
        // console.log(resJson);
        Alert.alert(
          'Smacked!',
          'Location and smack successfully dished to dat ' + user.username + '!',
          [{text: 'Squaaa'}]
        );
        this.props.navigation.navigate('Messages');
        // this.messages();
      } else {
        Alert.alert(
          'Failure!',
          'Cannot share location wit dat ' + user.username + '.',
          [{text: 'Sad.'}]
        );
      }
      // console.log('message sent to ' + user.username);
    })
    .catch((err2) => {
      console.log('error with location share!', err2);
    })
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Who you wanna smack?',
    headerRight: <Button title='Receipts' onPress={() => {navigation.state.params.onRightPress()}}/>
  });

  render(){
    return(
      <View style={styles.hoBox}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <TouchableOpacity
              onPress={() => this.touchUser(rowData)}
              onLongPress={() => this.sendLocation(rowData)}
              delayLongPress={1000}
              style={styles.eachHo}>
              <View>
                <Text style={styles.hoText}>{rowData.username}</Text>
              </View>
            </TouchableOpacity>}
          />
        </View>
      )
    };
  }

  //messages
  class MessageScreen extends React.Component {

    constructor(props){
      super(props);
      const ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource2: ds2.cloneWithRows([])
      };
      // this.touchUser = this.touchUser.bind(this);
      this.timeClean = this.timeClean.bind(this);
    }

    componentDidMount(){
      // console.log('mounting smack');
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((response2) => response2.json())
      .then((resp2Json) => {
        // console.log('hello', resp2Json);
        let ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource2: ds2.cloneWithRows(resp2Json.messages)
        });
        // console.log('messages', this.state.dataSource2);
      })
      .catch((err) => {
        console.log('error', err);
      });
    }

    static navigationOptions = {
      title: 'Smack Receipts'
    };

    timeClean(time){
      const bad = new Date(time);
      const clean = bad.toDateString();
      return clean;
    }

    render(){

      // console.log('x');
      return(
        <View style={styles.hoMessageBox}>
          <ListView
            dataSource={this.state.dataSource2}
            renderRow={(rowData) =>
              <View style={styles.eachHoMessage}>
                <Text style={styles.hoMessageText}>From: {rowData.from.username}</Text>
                <Text style={styles.hoMessageText}>To: {rowData.to.username}</Text>
                <Text style={styles.hoMessageText}>At {this.timeClean(rowData.timestamp)}</Text>
                {/* {console.log('location', rowData.location)} */}
                {(rowData.location && rowData.location.longitude) ?
                  <MapView
                    style={styles.hoLocation}
                    showsUserLocation={true}
                    scrollEnabled={false}
                    region={{
                      longitude: rowData.location.longitude,
                      latitude: rowData.location.latitude,
                      longitudeDelta: 1,
                      latitudeDelta: 1
                    }}
                  />
                  :
                  <Text>No Location received</Text>
                }
              </View>}
            />
          </View>
        )
      };
    }


    //Navigator
    export default StackNavigator({
      Login: {
        screen: LoginScreen,
      },
      Register: {
        screen: RegisterScreen,
      },
      Users: {
        screen: UserScreen
      },
      Messages: {
        screen: MessageScreen
      },
    }, {initialRouteName: 'Login'});


    //Styles
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFDB80',
      },
      containerFull: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FFDB80',
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
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
        color: '#3e0040'
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
      buttonWhite: {
        backgroundColor: 'white',
        // color: '#1E6400'
      },
      buttonPurple: {
        backgroundColor: '#3e0040',
        // color: 'white'
      },
      buttonLabel: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white'
      },
      buttonLabelPurple: {
        textAlign: 'center',
        fontSize: 16,
        color: '#3e0040'
      },
      register: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 2,
        marginRight: 30,
        marginLeft: 30,
        padding: 5
      },
      hoBox: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#FFDE8E',
      },
      eachHo: {
        flex: 1,
        height: 50,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: '#FFEAB6',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#FFF7E4'
      },
      hoText: {
        textAlign: 'center',
        fontSize: 24
      },
      hoMessageBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF7E4',

      },
      eachHoMessage: {
        // flex: 1,
        // height: 100,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#FFEAB6',
        borderColor: '#D3A200',
        borderWidth: 3,
        borderRadius: 5,
        marginTop: 7,
      },
      hoMessageText: {
        // textAlign: 'center',
        fontSize: 12
      },
      hoLocation: {
        // flex: 2,
        height: 150,
        width: 150,
        borderRadius: 80,
        margin: 5,
      },
      logo: {
        height: 200,
        width: 200,
      }
    });
