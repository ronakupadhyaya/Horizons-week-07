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
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions } from 'expo';

class Users extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      lat: '',
      long: ''
      }
      //fetch
    fetch('https://hohoho-backend.herokuapp.com/users', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: dataSource.cloneWithRows(responseJson.users)
        });
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error', err);
      });
  }

  static navigationOptions = {
    title: 'Users'
  };

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
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
         if (responseJson.success) {
           console.log('hi');
           Alert.alert(
             'Your Ho Ho Ho ' + user.username
           )
         } else {
           Alert.alert(
             'Your Ho Ho Ho to ' + user.username + ' could not be sent'
           )
         }
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error', err);
      });
  }

  sendLocation = async(user) => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('User rejects to share location!')
      } else {
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        this.setState({lat: location.coords.latitude, long: location.coords.longitude})
        console.log('LOCATION', location);
      }
      //fetch and share location with other user
      this.longTouchUser(user)
  }

  longTouchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id,
          location: {
            longitude: this.state.long,
            latitude: this.state.lat
          }
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
         if (responseJson.success) {
           console.log('hi');
           Alert.alert(
             'Your Ho Ho Ho ' + user.username
           )
         } else {
           Alert.alert(
             'Your Ho Ho Ho to ' + user.username + ' could not be sent'
           )
         }
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error', err);
      });

  }

  render() {
    return (
      <View style={styles.container}>

        <ListView
          renderRow={item =>
            <TouchableOpacity
                onPress={this.touchUser.bind(this, item)}
                onLongPress={this.sendLocation.bind(this, item)}
            >
            <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
          }
          dataSource = {this.state.dataSource}
        />
        <Text style={styles.username}>Location:</Text>
        <Text style={styles.username}>{this.state.lat}</Text>
        <Text style={styles.username}>{this.state.long}</Text>
      </View>
    )
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
  },
  username: {
    margin: 7,
    textAlign: 'center',
    fontSize: 19,
    borderBottomWidth: 9
  }
});

export default Users;
