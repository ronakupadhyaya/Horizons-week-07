import React from 'react';
import {
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05
      }
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('region')
      .then((result) => {
        this.setState({
          region: JSON.parse(result)
      })});
  }

  changeRegion(region) {
    this.setState({ region });
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
              AsyncStorage.setItem('region', JSON.stringify({
              latitude: 41.067841,
              longitude: 29.045258,
              latitudeDelta: 0.1,
              longitudeDelta: 0.05
            }))
              .then(() => this.changeRegion({
              latitude: 41.067841,
              longitude: 29.045258,
              latitudeDelta: 0.1,
              longitudeDelta: 0.05
            }))
          }}  >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {
                AsyncStorage.setItem('region', JSON.stringify({
                latitude: -33.866174,
                longitude: 151.220345,
                latitudeDelta: 0.1,
                longitudeDelta: 0.05
              }))
                .then(() => this.changeRegion({
                latitude: -33.866174,
                longitude: 151.220345,
                latitudeDelta: 0.1,
                longitudeDelta: 0.05
              }))
            }} >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => {
              AsyncStorage.setItem('region', JSON.stringify({
              latitude: 22.294074,
              longitude: 114.171995,
              latitudeDelta: 0.1,
              longitudeDelta: 0.05
            }))
              .then(() => this.changeRegion({
              latitude: 22.294074,
              longitude: 114.171995,
              latitudeDelta: 0.1,
              longitudeDelta: 0.05
            }))
          }}  >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => navigator.geolocation.getCurrentPosition(
              (success) => {
                AsyncStorage.setItem('region', JSON.stringify({
                  latitude: success.coords.latitude,
                  longitude: success.coords.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.05
                }))
                .then(() => this.changeRegion({
                  latitude: success.coords.latitude,
                  longitude: success.coords.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.05
                }))
              },
              (error) => {
              },
              {}
            )}  >
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={this.state.region} />
      </View>
    );
  }
}

export default App;
