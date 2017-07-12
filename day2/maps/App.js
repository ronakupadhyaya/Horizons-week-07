import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      lat: 0,
      long: 0 
    }; 
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          lat: success.coords.latitude, 
          long: success.coords.longitude
        })
      }, 
      (error) => {
        console.log('Error = ', error)
      }, 
      {}
    )
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => this.setState({
                lat: 41.067841, 
                long: 29.045258
              })}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}} 
          region={{
            latitude: this.state.lat, 
            longitude: this.state.long, 
            latitudeDelta: 0.5, 
            longitudeDelta: 0.25
          }}
        />
      </View>
    );
  }
}

export default App;
