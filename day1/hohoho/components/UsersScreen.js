import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ListView,
  RefreshControl
} from 'react-native';
import styles from '../styles/styles.js';

class UsersScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      dataSource: [],
      refreshing: false,
    }
  }

  static navigationOptions = props => ({
    title: 'Users',
    // headerRight: <TouchableOpacity onPress={() => props.navigation.navigate('Messages')}><Text>Messages >   </Text></TouchableOpacity>,
    headerStyle: { marginTop: 25 },
  })

  componentWillMount() {
    return fetch('https://hohoho-backend.herokuapp.com/users', {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.success) {
        this.setState({dataSource: respJson.users})
      } else {
        alert('There was an error loading users. Close this window and we will make another atempt.');
        this.props.navigation.navigate('Main');
      }
    })
    .catch(err => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    })
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      body: JSON.stringify({
        to: user._id,
      }),
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.success) {
        alert(`Successfully messaged ${user.username}!`)
      } else {
        alert(`There was an error messaging ${user.username}`)
      }
    })
    .catch(err => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    })
  }

  sendLocation(user) {
    let test = navigator.geolocation.getCurrentPosition(
      success => {
        const location = {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude
        }
        fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          body: JSON.stringify({
            to: user._id,
            location,
          }),
          headers: {
            "Content-Type": "application/json"
          },
        })
        .then(resp => resp.json())
        .then(respJson => {
          if (respJson.success) {
            alert(`Successfully messaged ${user.username} with your location!`)
          } else {
            alert(`There was an error messaging ${user.username}`)
          }
        })
        .catch(err => {
          alert('There seems to have been a problem. Pls contact the devs... bro.')
          console.log('ERROR', err);
        })
      }
    )
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.componentWillMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Users</Text>
        <ListView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={ds.cloneWithRows(this.state.dataSource)}
          renderRow={(rowData) => (
            <TouchableOpacity
              onPress={() => this.touchUser(rowData)}
              onLongPress={() => this.sendLocation(rowData)}
              delayLongPress={1000}>
              <Text style={styles.textMed}>
                {rowData.username}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

export default UsersScreen;
