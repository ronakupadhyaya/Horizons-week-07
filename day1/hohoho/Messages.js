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
import { MapView } from 'expo';

class Messages extends React.Component{
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([])
      }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJSON', responseJson);
        this.setState({
          dataSource: dataSource.cloneWithRows(responseJson.messages)
        });
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
            renderRow={item => {
              console.log('MESSAGE', item);
              if (item.location && item.location.longitude) {
                return (
                  <View style={{marginTop: 3, marginBottom: 9, borderBottomWidth: 3, borderColor: '#cccccc' }}>
                      <Text style={styles.message}>To: {item.to.username}</Text>
                      <Text style={styles.message}>From: {item.from.username}</Text>
                      <Text style={styles.message}>Message: {item.body}</Text>
                      <Text style={styles.message}>When: {item.timestamp}</Text>

                  <MapView style={{height: 300}}
                      showsUserLocation={true}
                      scrollEnabled={false}
                      region={{
                        latitude: item.location.latitude,
                        longitude: item.location.longitude,
                        latitudeDelta: 1,
                        longitudeDelta: 1
                      }}
                  />
                  </View>
                )
              } else {
                return (
                  <View style={{marginTop: 3, marginBottom: 3, borderBottomWidth: 2, borderColor: '#cccccc' }}>
                      <Text style={styles.message}>To: {item.to.username}</Text>
                      <Text style={styles.message}>From: {item.from.username}</Text>
                      <Text style={styles.message}>Message: {item.body}</Text>
                      <Text style={styles.message}>When: {item.timestamp}</Text>
                  </View>
                )

                }
              }
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
  message: {
    marginTop: 3,
    fontSize: 15,
    marginLeft: 9,
    fontFamily: 'Georgia',
    marginBottom: 3
  },
});

export default Messages;
