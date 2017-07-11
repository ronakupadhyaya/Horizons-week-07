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
import {styles} from '../style';

class UserScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({title: 'Users', headerRight: <Button title='Messages' onPress={() => {
    navigation.state.params.onRightPress()
  }}/>});

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    // get users from backend
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        });
      } else {
        console.log("error", responseJson.error);
      }
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: () => this.messages()
    })
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({to: user._id})
    }).then((response) => response.json()).then((responseJson) => {
      const alert = {
        title: '',
        contents: ''
      }
      if (responseJson.success) {
        alert.title = "Sweet!"
        alert.contents = `Your Ho Ho Ho! to ${user.username} has been sent!`;
      } else {
        alert.title = "Oh no!"
        alert.contents = `Your Ho Ho Ho! to ${user.username} could not be sent!`;
      }
      Alert.alert(alert.title, alert.contents, [
        {
          text: 'Dismiss Button'
        }
      ])
    })
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.dataSource} renderRow={rowData => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)} onLongPress={this.sendLocation.bind(this, rowData)} delayLongPress={1000}>
          <Text>{rowData.username}</Text>
        </TouchableOpacity>}/>
      </View>
    )
  }
}
export default UserScreen;
