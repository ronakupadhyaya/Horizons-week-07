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
      lat: 41.067841,
      long: 29.045258
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('region')
    .then((result) => {
      var newResult = JSON.parse(result)
      console.log(newResult, "newResult")
      this.setState({
        lat: newResult.latitude,
        long: newResult.longitude
      })
    })
  }

  onIstanbul() {
    this.setState({
      lat: 41.067841,
      long: 29.045258
    })
  }
  onSydney() {
    this.setState({
      lat: 33.866174,
      long: 151.220345
    })
  }
  onHongKong() {
    this.setState({
      lat: 22.294074,
      long: 114.171995
    })
  }
  onHere() {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          lat: success.coords.latitude,
          long: success.coords.longitude
        })
      }
    )
  }

  onRegionChange(region) {
    console.log(region, "region")
    AsyncStorage.setItem('region', JSON.stringify(region))
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this.onIstanbul.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onSydney.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onHongKong.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onHere.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={{
            latitude: this.state.lat,
            longitude: this.state.long
          }}
          onRegionChange={this.onRegionChange.bind(this)}
        />
      </View>
    );
  }
}

export default App;
