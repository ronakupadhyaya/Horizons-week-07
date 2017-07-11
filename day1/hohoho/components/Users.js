import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { Location, Permissions } from 'expo';
import styles from '../styles/styles.js';

class Users extends React.Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((res) => res.json())
    .then((resJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(resJson.users)
      })
    });
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: () => this.messages()
    })
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
    .then((res) => res.json())
    .then((resJson) => {
      if(resJson.success){
        Alert.alert(
          'Message',
          'Message to ' + user.username + ' was sent!',
          [{text: 'OK'}] // Button
        )
      }else{
        Alert.alert(
          'Message',
          'Message to ' + user.username + ' failed to send!',
          [{text: 'OK'}] // Button
        )
      }
    })
    .catch((err) => console.log(err));
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //handle failure
      alert('Permissions not granted.');
      return;
    };

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.longTouchUser(user, location.coords.latitude, location.coords.longitude);
  }

  longTouchUser(user, lat, long){
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: long,
          latitude: lat
        }
      })
    })
    .then((res) => res.json())
    .then((resJson) => {
      if(resJson.success){
        Alert.alert(
          'Message',
          'Location to ' + user.username + ' was sent!',
          [{text: 'OK'}] // Button
        )
      }else{
        Alert.alert(
          'Message',
          'Location to ' + user.username + ' failed to send!',
          [{text: 'OK'}] // Button
        )
      }
    })
    .catch((err) => console.log(err));
  }

  messages(){
    this.props.navigation.navigate('Messages');
  }

  render(){
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableOpacity
              onPress={this.touchUser.bind(this, rowData)}
              onLongPress={this.sendLocation.bind(this, rowData)}
              delayLongPress={200}
              >
              <Text>{rowData.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

export default Users;
