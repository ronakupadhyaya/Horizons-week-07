import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View, AsyncStorage} from 'react-native';

import {MapView} from 'expo';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      }
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('region').then(region => {
      const regionObj = JSON.parse(region);
      this.setState({
        region: {
          latitude: regionObj.latitude,
          longitude: regionObj.longitude,
          latitudeDelta: regionObj.latitudeDelta,
          longitudeDelta: regionObj.longitudeDelta
        }
      })
    }).catch(err => console.log(err))
  }

  showLocation(lat, long) {
    AsyncStorage.setItem('region', JSON.stringify({latitude: lat, longitude: long, latitudeDelta: 0.25, longitudeDelta: 0.25})).then(region => {
      this.setState({
        region: {
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25
        }
      })
    }).catch(error => console.log(error))
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((success) => {
      AsyncStorage.setItem('region', JSON.stringify({latitude: success.coords.latitude, longitude: success.coords.longitude, latitudeDelta: 0.25, longitudeDelta: 0.25})).then(region => this.setState({
        region: {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25
        }
      })).catch(error => console.log(error))
    }, (error) => {}, {})
  }

  onRegionChange(region) {
    AsyncStorage.setItem('region', JSON.stringify(region)).catch(err => console.log(err));
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'row'
        }}>
          <TouchableOpacity onPress={() => this.showLocation(41.067841, 29.045258)} style={{
            flex: 1,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.showLocation(-33.866174, 151.220345)} style={{
            flex: 1,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.showLocation(22.294074, 114.171995)} style={{
            flex: 1,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.getCurrentLocation()} style={{
            flex: 1,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text>Your Location</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{
          flex: 7
        }} region={this.state.region} initialRegion={this.state.region} onRegionChange={this.onRegionChange.bind(this)}/>
      </View>
    )
  }
}

export default App;
