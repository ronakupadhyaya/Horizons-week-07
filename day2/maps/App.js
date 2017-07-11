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
      lat: 41.067841,
      long: 29.045258 //Istanbul
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('lat')
    .then((result) => {
      this.setState({lat: JSON.parse(result) || this.state.lat, long: this.state.long})
    })
    .then(() => AsyncStorage.getItem('long'))
    .then((result2) => {
      this.setState({lat: this.state.lat, long: JSON.parse(result2) || this.state.long})
    })
    .catch((e) => console.log(e));
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
            onPress={() => this.setState({lat: 41.067841, long: 29.045258})}
            >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.setState({lat: -33.866174, long: 151.220345})}
              >
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.setState({lat: 22.294074, long: 114.171995})}
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
                    lat: success.coords.latitude,
                    long: success.coords.longitude
                  });
                },
                (error) => {
                  console.log(error);
                },
                {}
              )
            }}
          >
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
            region={{
              latitude: this.state.lat,
              longitude: this.state.long,
              latitudeDelta: 0.1,
              longitudeDelta: 0.05
            }}
            onRegionChange={(region) => {
              // this.setState({lat: region.latitude, long: region.longitude});
              AsyncStorage.setItem('lat', JSON.stringify(region.latitude));
              AsyncStorage.setItem('long', JSON.stringify(region.longitude));
            }}
          />
      </View>
    );
  }
}

export default App;
