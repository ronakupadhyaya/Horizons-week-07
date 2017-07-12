import React from 'react';
import {
  TouchableOpacity,
  AsyncStorage,
  StyleSheet,
  Text,
  View
} from 'react-native';
import expo from 'expo';

import {
  MapView
} from 'expo';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 41.067841,
        longitude: 29.045258,
        latitudeDelta: .05,
        longitudeDelta: .05
      }

    };
  }
  onRegionChange(region) {
    AsyncStorage.setItem('region', JSON.stringify(region))
    
  }
  stateSetter(region) {
    this.setState({region: region})
  }

  componentDidMount(){
    AsyncStorage.getItem('region')
    .then((result) => {
      this.setState({region: JSON.parse(result)});
    })
  }
  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>

          <TouchableOpacity
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}

          >
            <Text onPress={() => {
              this.stateSetter({
                latitude: 41.067841,
                longitude: 29.045258,
                latitudeDelta: .005,
                longitudeDelta: .005
              })
            }}>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}

          >
            <Text onPress={() => {
              this.stateSetter({
                latitude: 22.294074,
                longitude: 114.171995,
                latitudeDelta: .05,
                longitudeDelta: .05
              })
            }}>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}

          >
            <Text onPress={() => {
              this.stateSetter({
                latitude: -33.866174,
                longitude: 151.220345,
                latitudeDelta: .05,
                longitudeDelta: .05
              })
            }}>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}

          >
            <Text onPress={() => {
              navigator.geolocation.getCurrentPosition(
                  (success) => {
                    this.stateSetter({
                      lat: success.coords.latitude,
                      long: success.coords.longitude,
                      latitudeDelta: .05,
                      longitudeDelta: .05
                    });
                  }, 
                  (error) => {
                      console.log(err);
                    },
                {}
              )
            }}
            >My Location</Text>
          </TouchableOpacity>
      </View >
      <MapView style={{ flex: 7 }}
        initialRegion={{
          latitude: 22.294074,
          longitude: 114.171995,
          latitudeDelta: .05,
          longitudeDelta: .05
        }}
        region={this.state.region}
        onRegionChange={this.onRegionChange.bind(this)}
        
      />
      </View >
    );
  }
}

export default App;
