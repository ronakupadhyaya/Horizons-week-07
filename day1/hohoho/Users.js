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

class Users extends React.Component {
  constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    }
  }

  static navigationOptions = {
    title: 'Users' //you put the title you want to be displayed here
  };

  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderRow={item => <Text>{item}</Text>}
          dataSource = {this.state.dataSource}
        />
      </View>
    )
  }
}

export default Users;
