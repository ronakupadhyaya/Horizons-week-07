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
      latitude: 41.067841,
      longitude: 29.045258,
      latitudeDelta: .05,
      longitudeDelta: .025
    }
  }

  istanbul() {
    this.setState({
      latitude: 41.067841,
      longitude: 29.045258,
      latitudeDelta: .05,
      longitudeDelta: .025
    })
  }

  sydney() {
    this.setState({
      latitude: -33.866174,
      longitude: 151.220345,
      latitudeDelta: .05,
      longitudeDelta: .025
    })
  }

  hongKong() {
    this.setState({
      latitude: 22.294074,
      longitude: 114.171995,
      latitudeDelta: .05,
      longitudeDelta: .025
    })
  }

  here() {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
          latitudeDelta: .05,
          longitudeDelta: .025
        })
      },
      (err) => {},
      {}
    )
  }

  save(region) {
  // this.setState({
  //   latitudeDelta: region.latitudeDelta,
  //   longitudeDelta: region.longitudeDelta
  // })
    console.log(region)
    AsyncStorage.setItem('region', JSON.stringify(region))
  }
  componentDidMount() {
    AsyncStorage.getItem('region')
      .then(region => {
        console.log('REGION', region)
        this.setState(JSON.parse(region))
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
            onPress={this.istanbul.bind(this)}
          >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={this.sydney.bind(this)}
          >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={this.hongKong.bind(this)}
          >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={this.here.bind(this)}
          >
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={{flex: 7}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
          onRegionChange={this.save.bind(this)}
        />
      </View>
    );
  }
}

export default App;
