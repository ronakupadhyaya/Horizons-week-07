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
  constructor(){
    super();
    this.state={  }
  }
  setRegion(latitude, longitude){
    this.setState({
        latitude:latitude,
        longitude:longitude,
      })
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => (this.setRegion(41.067841,29.045258))}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (this.setRegion(-33.866174,151.220345))}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (this.setRegion(22.294074, 114.171995))}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigator.geolocation.getCurrentPosition(
                (success) => {
                  this.setState({
                    latitude: success.coords.latitude,
                    longitude: success.coords.longitude,
                  })
                },
                (error) => {
                  console.log(error)
                }
              )
            }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={{
            latitude: this.state.latitude,
            logitude: this.state.longitude
          }}
        />
      </View>
    );
  }
}

export default App;
