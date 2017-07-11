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
      location: {
        lat: 0,
        long: 0
      }
    };
  }

  onRegionChange(region) {
    AsyncStorage.setItem('latitude', JSON.stringify(region.latitude));
    AsyncStorage.setItem('longitude', JSON.stringify(region.longitude))
  }

  componentDidMount() {
    AsyncStorage.getItem('latitude')
    .then((result) => {
      AsyncStorage.getItem('longitude')
      .then((result2) => {
        this.setState({location:
          {lat: Number(result), long: Number(result2)}
        });
      });
    });

  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                location: {
                  lat: 41.067841,
                  long: 29.045258
                }
              })
            }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                location: {
                  lat: -33.866174,
                  long: 151.220345
                }
              })
            }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                location: {
                  lat: 22.294074,
                  long: 114.171995
                }
              })
            }}
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
                    location: {
                      lat: success.coords.latitude,
                      long: success.coords.longitude
                    }
                  })
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
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView
          onRegionChange={this.onRegionChange.bind(this)}
          style={{flex: 7}}
          region={{
            latitude: this.state.location.lat,
            longitude: this.state.location.long,
            latitudeDelta: 0.25,
            longitudeDelta: 0.125
          }}
          />
      </View>
    );
  }
}

export default App;
