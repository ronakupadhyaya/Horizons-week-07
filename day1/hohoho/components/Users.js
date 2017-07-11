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
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles'

export default class Users extends React.Component {
  static navigationOptions = {
    title: 'Users'
  };
  constructor(props) {
    super(props);
    this.state = {
      users: [
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ]
    };
  }

  send(item) {
    console.log('item in users', item);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: item._id,
      })
    })
    .then((response) => {
      console.log('response in users', response);
      console.log('type res', typeof response);
      if (response.status === 200) {
        this.messages(item.username, true);
      } else {
        this.messages(item.username, false);
      }
    })
    .catch(err => {
      console.log('err in users', err);
    })
  }

  messages(name, couldSend) {
    if (couldSend) {
      alert('You sent a Hohoho to ' + name +'!');
    } else {
      alert('You failed to send a Hohoho to ' + name +'!');
    }
  }

  goToMessages() {
    this.props.navigation.navigate('Messages')
  }

  componentDidMount() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then(response => {
        return response.json();
      })
      .then((data) =>
        self.setState({users: data.users})
      );
  }
  render() {
    var self = this;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.state.users)}
          renderRow={((item) => (
          <View>
            <TouchableOpacity onPress={this.send.bind(this, item)}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'blue'
                }}>{item.username}
              </Text>
            </TouchableOpacity>
          </View>) )}
        ></ListView>
          <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.goToMessages()} }>
            <Text style={styles.buttonLabel}>Messages</Text>
          </TouchableOpacity>
      </View>
    )
  }
}
