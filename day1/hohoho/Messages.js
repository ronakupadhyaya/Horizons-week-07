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
import {MapView} from 'expo'

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
              return (
                <View>
                <Text style={styles.username}>To: {item.to.username}</Text>
                <Text style={styles.username}>From: {item.from.username}</Text>
                <Text style={styles.username1}>When: {item.timestamp}</Text>
                {item.location ? <MapView style={styles.map} showsUserLocation={true}
  scrollEnabled={false} region={{
    longitude: item.location.longitude,
    latitude: item.location.latitude,
    longitudeDelta: 1,
    latitudeDelta: 1
  }} /> : <Text>False</Text>}
                </View>
              )
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
    // textAlign: 'center',
    fontSize: 19,
    // borderBottomWidth: 2,
    width: 300,
  },
  username1: {
    margin: 7,
    // textAlign: 'center',
    fontSize: 19,
    borderBottomWidth: 2,
    width: 300,
  },
  map: {
    height: 100,
  }
});

export default Messages;
