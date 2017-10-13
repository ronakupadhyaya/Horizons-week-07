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
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.78,
      longitude: -122.41,
    };
  }

  goIstanbul() {
    this.setState({
      latitude: 41.067841,
      longitude: 29.045258
    });
    AsyncStorage.setItem('coords', JSON.stringify(this.state));
  }

  goHere() {
    navigator.geolocation.getCurrentPosition(
      success => {
        this.setState({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        });
        AsyncStorage.setItem('coords', JSON.stringify(this.state));
      },
      error => {
        console.log(error)
      },
      {}
    )
  }

  componentDidMount() {
    AsyncStorage.getItem('coords')
    .then(result => {
      const parsed = JSON.parse(result);
      this.setState({
        latitude: parsed.latitude,
        longitude: parsed.longitude,
      });
      console.log('compDidMount', result);
    });
  }

  _onRegionChangeComplete(region) {
    console.log(region);
    AsyncStorage.setItem('coords', JSON.stringify({
      latitude: region.latitude,
      longitude: region.longitude,
    }));
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this.goIstanbul.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
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
          <TouchableOpacity
            onPress={this.goHere.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView
          onRegionChangeComplete={this._onRegionChangeComplete}
          style={{flex: 7}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.25
          }}
        />
      </View>
    );
  }
}

/* <MapView style={{flex: 7}} /> */

export default App;
