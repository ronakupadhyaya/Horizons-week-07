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

const locations = {
  Istanbul: {
    latitude: 41.089185,
    longitude: 29.070511
  },
  Sydney: {
    latitude: -33.866174,
    longitude: 151.220345
  },
  HongKong: {
    latitude: 22.294074,
    longitude: 114.171995
  }
};

class App extends React.Component {

  constructor(){
    super();
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  renderMap(country) {
    this.setState({
      latitude: locations[country].latitude,
      longitude: locations[country].longitude,
      latitudeDelta: .5,
      longitudeDelta: .25
    })
  }

  onRegionChange(region) {
    AsyncStorage.setItem('geo', JSON.stringify(region))
      .then(() => {
        console.log('region change:', region);
      });
  }

  componentDidMount() {
    AsyncStorage.getItem('geo')
      .then((result) => {
        console.log('loaded from async', JSON.parse(result));
        this.setState(JSON.parse(result));
      });
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
            onPress={() => {this.renderMap('Istanbul')}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => {this.renderMap('Sydney')}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => {this.renderMap('HongKong')}}>
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
                    longitude: success.coords.longitude,
                    latitudeDelta: .5,
                    longitudeDelta: .25,
                  })
                },
                (error) => {
                },
                {}
              )
            }
            }>
            <Text>Your Location</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{flex: 7}}
          region={this.state}
          onRegionChange={this.onRegionChange}
        />
      </View>
    );
  }
}

export default App;
