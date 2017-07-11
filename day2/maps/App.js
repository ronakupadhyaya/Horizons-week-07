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
      latitude: 43.6532,
      longitude: -79.3832,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015
    };
  }

  onRegionChange = (region) => {
    AsyncStorage.setItem('region', JSON.stringify(region))
  }

  componentDidMount() {
    AsyncStorage.getItem('region')
      .then((result) => {
        const res = JSON.parse(result)
        this.setState({
          latitude: res.latitude,
          longitude: res.longitude,
          latitudeDelta: res.latitudeDelta,
          longitudeDelta: res.longitudeDelta
        })
      });

  }

  render() {
    console.log(this.state.latitude)
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>

          <TouchableOpacity
            onPress={() =>
              this.setState({
                latitude: 41.067841,
                longitude: 29.045258,
              })
            }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() =>
              this.setState({
                latitude: -33.866174,
                longitude: 151.220345,
              })
            }

            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.setState({
                latitude: 22.294074,
                longitude: 114.171995,
              })
            }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
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
            }}

            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Where is Jathu?</Text>
          </TouchableOpacity>

        </View>
        <MapView style={{flex: 7}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
        }}
        onRegionChange={this.onRegionChange.bind(this)}
        />
      </View>
    );
  }
}

export default App;
