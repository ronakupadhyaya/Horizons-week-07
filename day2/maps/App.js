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
    this.state= {
      lat: 0,
      long: 0
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.multiGet(['lat','long'])
    .then((result) => {
      console.log('mount storage', result);
      this.setState(
      {lat: Number(result[0][1]),
       long: Number(result[1][1])
      }
    )
  } )
  }

  handleRegion(region) {
    console.log('onRegionChange region data', region);
    AsyncStorage.multiSet([['lat', region.latitude.toString()], ['long',region.longitude.toString()]])
    // .then(() => AsyncStorage.multiGet(['lat','long']))
    // .then((result) => console.log(result))

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
              onPress = {
                () => AsyncStorage.multiSet([['lat', '41.067841'], ['long','29.045258']])
                .then(() => this.setState(
                  {lat: 41.067841,
                  long: 29.045258}
                ))
              } >
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress = {
                () => this.setState(
                  {lat: -33.866174,
                  long: 151.220345}
                )
              }>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress = {
                () => this.setState(
                  {lat: 22.294074,
                  long: 114.171995}
                )
              }>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress = {
                () => {
                  navigator.geolocation.getCurrentPosition(
                    (success) => {
                      this.setState({
                        lat: success.coords.latitude,
                        long: success.coords.longitude
                      })
                    }
                  )
                }
              }>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
            region={{
              latitude: this.state.lat,
              longitude: this.state.long,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025
            }}
            onRegionChange={(region) => this.handleRegion(region)}
          />
      </View>
    );
  }
}

export default App;
