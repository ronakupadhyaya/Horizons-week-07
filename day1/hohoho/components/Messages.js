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
import { MapView } from 'expo';
import styles from '../styles/styles.js';

class Messages extends React.Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((res) => res.json())
    .then((resJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(resJson.messages)
      })
    });
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  static navigationOptions = {
    title: 'Messages' //you put the title you want to be displayed here
  }

  render(){
    let location = function(rowData){
      // showsUserLocation={true}
      // scrollEnabled={false}
      // <MapView
      //     style={{flex: 1}}
      //     region={{
      //       latitude: parseInt(rowData.location.longitude),
      //       longitude: parseInt(rowData.location.latitude),
      //       longitudeDelta: 0.1,
      //       latitudeDelta: 0.05
      //     }}
      //   />
      if(rowData.location && rowData.location.longitude){
        return(
          <MapView
              style = {{width:400, height:400}}
              showsUserLocation={true}
              scrollEnabled={false}
              region={{
                latitude: rowData.location.latitude,
                longitude: rowData.location.longitude,
                longitudeDelta: 0.05,
                latitudeDelta: 0.025
              }}
            />
        )
      }
      else{
        return(
          <Text>Location not shared.</Text>
        )
      }
    };

    return(
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <View>
              <Text>{rowData.timestamp}</Text>
              <Text>From: {rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>HoHoHo!</Text>
              {location(rowData)}
            </View>
          )}
        />
      </View>
    )
  }
}

export default Messages;
