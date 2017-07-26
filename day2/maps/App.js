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
  constructor(props) {
    super(props);
    this.state = {
      latitude: 41.067841,
      longitude: 29.045258,
    }
    this.currentLocation = this.currentLocation.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('coords')
      .then((result) => {
        this.setState({
          latitude: JSON.parse(result)[0],
          longitude: JSON.parse(result)[1]
        });
      });
  }

  currentLocation() {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude
        });
        AsyncStorage.setItem('coords', JSON.stringify([success.coords.latitude, success.coords.longitude]));
      },
      (error) => {
        alert(error);
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
            onPress={() => {
              this.setState({latitude: 41.067841, longitude: 29.045258});
              AsyncStorage.setItem('coords', JSON.stringify([41.067841, 29.045258]));
            }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({latitude: -33.866174, longitude: 151.220345});
              AsyncStorage.setItem('coords', JSON.stringify([-33.866174, 151.220345]));
            }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({latitude: 22.294074, longitude: 114.171995});
              AsyncStorage.setItem('coords', JSON.stringify([22.294074, 114.171995]));
            }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.currentLocation()}
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
            longitude: this.state.longitude,
            latitudeDelta: 0.125,
            longitudeDelta: 0.125
          }}
        />
      </View>
    );
  }
}

export default App;
