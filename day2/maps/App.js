import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 600,
      longitudeDelta: 300
    };
  }
  savePos = (region) => {
    return AsyncStorage.setItem('state', JSON.stringify(region));
  }
  toMe = () => {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        })
      },
      (error) => {

      },
      {}
    )
  }
  toSydney = () => {
    this.setState({
      latitude: -33.871001,
      longitude: 151.211790,
      latitudeDelta: 0.5,
      longitudeDelta: 0.25
    })
  }
  toHongKong = () => {
    this.setState({
      latitude: 22.294074,
      longitude: 114.171995,
      latitudeDelta: 0.5,
      longitudeDelta: 0.25
    })
  }
  toIstanbul = () => {
    this.setState({
      latitude: 41.067841,
      longitude: 29.045258,
      latitudeDelta: 0.5,
      longitudeDelta: 0.25
    })
  }
  componentDidMount () {
    AsyncStorage.getItem('state')
    .then((result) => {
      this.setState(JSON.parse(result));
    });
  }
  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={this.toIstanbul}
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.toSydney}
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.toHongKong}
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.toMe}
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text>My Location</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{ flex: 7 }}
          region={this.state}
          onRegionChange={this.savePos}
        />
      </View>
    );
  }
}

export default App;
