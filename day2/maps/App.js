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
      lat: 0,
      long: 0,
      latitudeDelta: 0.025,
      longitudeDelta: 0.0125
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('long')
     .then((result) => this.setState({long: JSON.parse(result)}))
   AsyncStorage.getItem('lat')
    .then((result) => this.setState({lat: JSON.parse(result)}))
  }

  onRegionChange(region) {
    AsyncStorage.setItem('long', JSON.stringify(region.longitude))
    AsyncStorage.setItem('lat', JSON.stringify(region.latitude))
    AsyncStorage.setItem('longitudeDelta', JSON.stringify(region.longitudeDelta))
    AsyncStorage.setItem('latitudeDelta', JSON.stringify(region.latitudeDelta))
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
            onPress={() => this.setState({
              lat: 41.065581,
              long: 29.033432
            })}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.setState({
              lat: -33.866174,
              long: 151.220345
            })}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.setState({
              lat: 22.294074,
              long: 114.171995
            })}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => navigator.geolocation.getCurrentPosition(
              (success) => {
                this.setState({
                  lat: success.coords.latitude,
                  long: success.coords.longitude
                });
              },
              (error) => {
                console.log(error);
              },
              {}
            )}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
            region={{
              latitude: this.state.lat,
              longitude: this.state.long,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta
            }}
            onRegionChange={this.onRegionChange}
        />
      </View>

    );
  }
}

export default App;
