import React from 'react';
import {
  View,
  Text,
  TextInput,
  ListView,
  Alert,
  Button,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../style/styles';
import { Location, Permissions, MapView } from 'expo';
const SERVER_URL = "https://hohoho-backend.herokuapp.com";
const DEFAULT_LAT_DELTA = 0.0250;
const DEFAULT_LON_DELTA = 0.0125;

class MessageScreen extends React.Component {
  static navigationOptions = {
    title: 'Message'
  };

  constructor(props){
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount(){
    fetch(`${SERVER_URL}/messages`,{
      method: 'GET'
    })
    .then((resp)=>(
      resp.json()
    ))
    .then((respJson)=>{
      if(!respJson.success){
        throw('Error');
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(respJson.messages)
      });
    })
    .catch((err)=>{
      alert('Error loading messages.');
    })
  }

  renderMapView(rowData){
    if(rowData.location && rowData.location.longitude){
      return(
        <MapView
          style={{height: 200, alignSelf: 'stretch'}}
          region={{
            latitude: rowData.location.latitude,
            longitude: rowData.location.longitude,
            latitudeDelta: DEFAULT_LAT_DELTA,
            longitudeDelta: DEFAULT_LON_DELTA
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: rowData.location.latitude,
              longitude: rowData.location.longitude
            }}
            title={rowData.from.username}
          />
        </MapView>
      );
    }
  }

  render() {
    return (
      <ListView
        className='containerFull'
        style={{display:'flex'}}
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <View
            className='containerFull'
          >
            <Text
            key={rowData._id}
            style={{fontSize: 10}}
            >
              {`${rowData.from.username} -> ${rowData.to.username}\nTime: ${rowData.timestamp}\n${rowData.body}`}
            </Text>
            {this.renderMapView(rowData)}
          </View>
        }
      />
    );
  }
}

export default MessageScreen;
