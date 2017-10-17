import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ListView,
  Button,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import {
  Location,
  Permissions,
  MapView,
} from 'expo';
import styles from '../Styles/styles'

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      refreshing: false,
    };
  }

  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <Button
      title="Messages"
      onPress={ () => props.navigation.navigate('Messages') }
    />,
  })

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then( responseJson => responseJson.json() )
    .then( (resp) => {
      this.setState({
        users: resp.users
      });
    })
    .catch( error => {console.log('error: ', error);})
  }

  _onRefresh() {
    this.setState({
      refreshing: true,
    });
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then( responseJson => responseJson.json() )
    .then( (resp) => {
      this.setState({
        users: resp.users,
        refreshing: false,
      });
    })
    .catch( error => {console.log('error: ', error);})
  }

  hohoho(id, location) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: id,
        location: location ?
          {
            latitude: location.latitude,
            longitude: location.longitude,
          }
          :
          null,
      }),
    })
    .then( responseJson => responseJson.json() )
    .then( item => {
      console.log(item);
      this.props.navigation.navigate('Messages')
    } )
    .catch( error => {console.log('error in hohoho: ', error);})
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('failed permissions check :', status, user);
      return
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true,});
    this.hohoho(user._id, location.coords)

  }

  render() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    return (
      <View style={styles.container}>
        <ListView
          style={{alignSelf: 'stretch'}}
          enableEmptySections
          dataSource={ds.cloneWithRows(this.state.users)}
          renderRow={ (item) => (
            <TouchableOpacity
              onPress={ () => this.hohoho(item._id) }
              onLongPress={ () => this.sendLocation(item) }
              style={[styles.textUsernameContainer]}
              >
              <Text style={[styles.textUsername]}>{item.username}</Text>
            </TouchableOpacity>
          ) }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={ () => this._onRefresh() }
            />
          }
        />
      </View>
    )
  }
}

export default UsersScreen;
