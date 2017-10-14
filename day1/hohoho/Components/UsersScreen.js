import React from 'react';
import { Alert, ListView, View, Text, TouchableOpacity } from 'react-native';
import { Location, Permissions } from 'expo';
import styles from './styles';
const baseUrl = 'https://hohoho-backend.herokuapp.com/';

class UsersScreen extends React.Component {
  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <TouchableOpacity onPress={() => props.navigation.navigate('Messages') }><Text>Messages</Text></TouchableOpacity>
  });
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
    this.getUsers();
  }
  getUsers() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch(baseUrl + 'users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        });
      })
      .catch(err => {
        alert('Error: ' + err);
        /* console.log('Error: ' + err); */
      });
  }
  longTouchUser(user, location) {
    fetch(baseUrl + 'messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        Alert.alert(
          'Success',
          `Your location to ${user.username} has been sent!`,
          [{text: 'Dismiss'}] // Button
        );
      })
      .catch(err => {
        Alert.alert(
          'Failure',
          `Your location to ${user.username} was not sent. Error: ${err}`,
          [{text: 'Dismiss'}] // Button
        );
      });
  }
  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Location permissions not granted :(');
    } else {
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.longTouchUser(user, location);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderRow={item => {
            return (
              <View key={item._id}>
                <TouchableOpacity
                  onLongPress={this.sendLocation.bind(this, item)}
                  delayLongPress={1000}>
                  <Text>{item.username}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          dataSource={this.state.dataSource}
        />
      </View>
    );
  }
}

export default UsersScreen;
