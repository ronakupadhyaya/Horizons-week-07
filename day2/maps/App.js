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
  constructor(props){
    super(props);
    this.state = {
        latitude: 38.8899,
        longitude: 77.0091,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('longitude')
                .then((result) =>{
                  console.log(result);
                  this.setState({longitude: parseFloat(result)})
                });
    AsyncStorage.getItem('latitude')
                .then((result) =>{
                  console.log(result);
                  this.setState({latitude: parseFloat(result)})
                });
  }

  onRegionChange(region) {
    console.log("region", region)
    console.log('region lati: ', region.latitude);
    console.log('region long: ', region.longitude);
    AsyncStorage.setItem('longitude', String(region.longitude));
    AsyncStorage.setItem('latitude', String(region.latitude));
  }

  IstanbulMap() {
    return (
      this.setState({
          latitude: 41.067841,
          longitude: 29.045258,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
      })
    )
  }

  SydneyMap() {
    return (
      this.setState({
        latitude: -33.866174,
        longitude: 151.220345,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      })
    )
  }


  HongKongMap() {
    return (
      this.setState({
        latitude: 22.294074,
        longitude: 114.171995,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      })
    )
  }

  Here() {
    return (
      navigator.geolocation.getCurrentPosition(
        (success) => {
          this.setState({
            latitude: success.coords.latitude,
            longitude: success.coords.longitude
          });
        },
        (error) => {

        },
        {}
      )
    )
  }
  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 0.3, flexDirection: 'row'}}>
          <TouchableOpacity onPress={ () => {this.IstanbulMap()} }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => {this.SydneyMap()} }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => {this.HongKongMap()} }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => {this.Here()} }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{ flex:1 }}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta,
            }}
            onRegionChange={this.onRegionChange.bind(this)}

        />
      </View>
    );
  }
}

export default App;
