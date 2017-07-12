import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import expo from 'expo';
import { Location, Permissions } from 'expo';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/stylesheets/style';

class UsersScreen extends React.Component {
  constructor(props) {
    console.log('')
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows([
      ])
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={() => { navigation.state.params.onRightPress() }} />
  });

  messagesNav() {
    this.props.navigation.navigate('Messages');
  }
  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messagesNav.bind(this)
    })
    console.log('mounted')
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },

    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)

        if (responseJson.success) {
          console.log('json success')
          const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
          this.setState({

            dataSource: ds.cloneWithRows(responseJson.users)
          })
        }
      })

      .catch((err) => {
        <Text>{err}</Text>
      });
  }

  sendLocation = (user) => {
    let location = navigator.geolocation.getCurrentPosition(
      (location) => {
        this.longTouchUser(user, location);
      },
      function(err) {
        console.log('err', err);
      }, 
      { enableHighAccuracy: true });
    
  }

  longTouchUser(user, location) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }

      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)

        if (responseJson.success) {
          alert(
            'Your Ho Ho Ho! To ' + user.username + 'has been sent'

          )
        } else {
          alert('Your Ho Ho Ho! could not be sent')
        }
      })
  }

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
        console.log(responseJson)

        if (responseJson.success) {
          alert(
            'Your Ho Ho Ho! To ' + user.username + 'has been sent'

          )
        } else {
          alert('Your Ho Ho Ho! could not be sent')
        }
      })
  }

  render() {
    console.log(this.state.dataSource)
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => (
          <TouchableOpacity
            onPress={this.touchUser.bind(this, rowData)}
            onLongPress={this.sendLocation.bind(this, rowData)}
            delayLongPress={/* num of millseconds here */ 2000}>
            <Text>{rowData.username}</Text>
          </TouchableOpacity>
        )}
      />

    )
  }
}

export default UsersScreen
