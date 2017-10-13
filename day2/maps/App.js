import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage
 } from 'react-native';

import {
  MapView,
} from 'expo';

console.disableYellowBox = true;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 90,
      longitudeDelta: 45,
    }
    this.coords = {
      Istanbul: {
        latitude: 41.067841,
        longitude: 29.045258,
      },
      Sydney: {
        latitude: -33.866174,
        longitude: 151.220345,
      },
      HongKong: {
        latitude: 22.294074,
        longitude: 114.171995,
      },
    }
  }


  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      success => {
        this.coords.currentLoc = {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        }
      }
    );
    AsyncStorage.getItem('latitude')
    .then(result => this.setState({latitude: JSON.parse(result)}));
    AsyncStorage.getItem('latitudeDelta')
    .then(result => this.setState({latitudeDelta: JSON.parse(result)}));
    AsyncStorage.getItem('longitude')
    .then(result => this.setState({longitude: JSON.parse(result)}));
    AsyncStorage.getItem('longitudeDelta')
    .then(result => this.setState({longitudeDelta: JSON.parse(result)}));
  }

  change(city) {
    this.setState({
      latitude: this.coords[city].latitude,
      longitude: this.coords[city].longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.25,
    })
  }

  render() {
    return (
      <View style={{
          flex: 1,
          marginTop: 24,
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.change('Istanbul')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.change('Sydney')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.change('HongKong')}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.change('currentLoc')}
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Current Location</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          onRegionChangeComplete={(region) => {
            AsyncStorage.setItem('latitude', JSON.stringify(region.latitude));
            AsyncStorage.setItem('latitudeDelta', JSON.stringify(region.latitudeDelta));
            AsyncStorage.setItem('longitude', JSON.stringify(region.longitude));
            AsyncStorage.setItem('longitudeDelta', JSON.stringify(region.longitudeDelta));
          }}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}
        />
      </View>
    );
  }
}

export default App;
