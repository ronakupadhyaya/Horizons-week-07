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
      latitude: 40.0583,
      longitude: -74.571,
      latitudeDelta: 0,
      longitudeDelta: 0
    }
  }

componentDidMount() {
  AsyncStorage.multiGet(['latitude', 'longitude'])
    .then((result) => {
      this.setState(['latitude', JSON.parse(result)], ['longitude', JSON.parse(result)]);
    });
}

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={() =>
              this.setState({
                latitude: 41.067841,
                longitude: 29.045258,
                latitudeDelta: 0.5,
                longitudeDelta: 0.125
              })
            }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
              this.setState({
                latitude: -33.866174,
                longitude: 151.220345,
                latitudeDelta: 0.5,
                longitudeDelta: 0.125
              })
            }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
              this.setState({
                latitude: 22.294074,
                longitude: 114.171995,
                latitudeDelta: 0.5,
                longitudeDelta: 0.125
              })
            }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            navigator.geolocation.getCurrentPosition(
              (success) => {
                this.setState({
                  latitude: success.coords.latitude,
                  longitude: success.coords.longitude,
                });
              },
            (error) => {},
          {})
            }
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
          onRegionChange={(region) => AsyncStorage.multiSet(
            [['latitude', JSON.stringify(this.state.latitude)],
             ['longitude', JSON.stringify(this.state.longitude)]])
              .then(() => this.setState({latitude: region.latitude, longitude: region.longitude,
                'latitudeDelta': region.latitudeDelta, 'longitudeDelta': region.longitudeDelta}))
            // )
          }
        />
      </View>
    );
  }
}

export default App;
