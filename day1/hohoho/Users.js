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
      dataSource: dataSource.cloneWithRows([])
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
        console.log('responseJSON', responseJson);
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
    title: 'Users' //you put the title you want to be displayed here
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
         console.log('responseJson', responseJson);
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
            <TouchableOpacity onPress={this.touchUser.bind(this, item)}>
            <Text style={styles.username}>{item.username}</Text>
            </TouchableOpacity>
          }
          dataSource = {this.state.dataSource}
        />
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
