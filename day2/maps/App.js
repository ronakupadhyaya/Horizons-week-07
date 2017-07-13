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
      this.state={
        longitude: 29.045258,
        latitude: 41.067841,
        longitudeDelta: 25,
        latitudeDelta: 25
      };
  }
  componentDidMount() { // All async data loading
    console.log('hello')
    AsyncStorage.getItem('region')
      .then((result) => {
        this.setState({
          longitude: JSON.parse(result).longitude,
          latitude: JSON.parse(result).latitude,
          longitudeDelta: JSON.parse(result).longitudeDelta,
          latitudeDelta: JSON.parse(result).latitudeDelta
        })
      })
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
            onPress={() => {
                this.setState({longitude: 29.045258, latitude: 41.067841})
            }}
            >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                  this.setState({longitude: 151.220345, latitude: -33.866174})
              }}
              >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                  this.setState({longitude: 114.171995, latitude: 22.294074})
                }}
              >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                navigator.geolocation.getCurrentPosition(
                  (success) => {
                    this.setState({
                      latitude: success.coords.latitude,
                      longitude: success.coords.longitude
                    })
                  },
                  (error) => {
                  },
                  {} // third option, javascript object you can use
                )
                }}
              >
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{flex: 7}}
          region = {this.state}
          onRegionChangeComplete = {(region) => {
            AsyncStorage.setItem('region', JSON.stringify(region))
            .then(() => this.setState({
              latitude: region.latitude,
              longitude: region.longitude,
              longitudeDelta: region.longitudeDelta,
              latitudeDelta: region.latitudeDelta,
            }))
            .catch((err) => {
              console.log(err)
            })
          }}
        />
      </View>
    );
  }
}

export default App;
