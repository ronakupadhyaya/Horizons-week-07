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
  //navigationOptions code
  static navigationOptions = {
    title: 'Login',
    // headerRight: 'Message'
  };
  constructor(props) {
    super(props);
    this.state = {
      users: [
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ]
    };
  }
  componentDidMount() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then((data) =>
        self.setState({users: data.users})
      );
  }

  send(id) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: self.state.username,
      })
    })
    .then((response) => {
      console.log('response in login', response);
      console.log('type res', typeof response);
      if (response.status === 200) {
        self.props.navigation.navigate('Users');
      } else {
        self.setState({wrongPassword: true})
      }
    })
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView renderRow={((item) => (<View>
          <Text
            style={{
            fontSize: 20,
            color: 'blue'
            }}
            onPress={(id) => this.send(item._id)}
          >
            {item.username}
          </Text>
      </View>) )}
       dataSource={ds.cloneWithRows(this.state.users)}
        ></ListView>
    )
  }
}
