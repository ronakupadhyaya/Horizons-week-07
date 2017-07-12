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
  constructor(){
    super();
    this.state = {
      region: {
        latitude: 41.067841,
        longitude: 29.045258
      }
    }
  }

  istanbul(){
    this.setState({region: {latitude: 41.067841, longitude: 29.045258}});
  }

  sydney(){
    this.setState({region: {latitude: -33.866174, longitude: 151.220345}});
  }

  hong(){
    this.setState({region: {latitude: 22.294074, longitude: 114.171995}});
  }

  here(){
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({region: {latitude: success.coords.latitude, longitude: success.coords.longitude}});
      },
      (error) => {
      },
      {}
    );
    this.setState({region: {latitude: 41.067841, longitude: 29.045258}});
  }

  onRegionChange(region){
    AsyncStorage.setItem('region', JSON.stringify(region))
    .then(
      // () => this.setState({region: region})
    )
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('region')
    .then((result) => {
      self.setState({region: JSON.parse(result)})
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
              onPress={ () => {this.istanbul()} }>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={ () => {this.sydney()} }>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={ () => {this.hong()} }
              >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={ () => {this.here()} }
              >
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={{
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.25
        }}
        onRegionChange={this.onRegionChange.bind(this)}
      />
      </View>
    );
  }
}

export default App;
