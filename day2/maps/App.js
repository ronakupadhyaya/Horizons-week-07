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
  constructor(){
    super();
    this.state = {
      location: {}
    }
  }

  pressI() {
    this.setState({
      location: {
        latitude: 41.067841,
        longitude: 29.045258,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    })
  }

  pressS() {
    this.setState({
      location: {
        latitude: -33.866174,
        longitude: 151.220345,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    })
  }

  pressHK() {
    this.setState({
      location: {
        latitude: 22.294074,
        longitude: 114.171995,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    })
  }

  pressHere() {
    navigator.geolocation.getCurrentPosition(
      (success) => {
        this.setState({
          location: {
            latitude: success.coords.latitude,
            longitude: success.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        })
      },
      (error) => {
      },
      {}
    )
  }

  componentDidMount() {
    AsyncStorage.getItem('yes')
      .then((result) => {
        this.setState({yes: JSON.parse(result)})
      });
  }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.pressI.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.pressS.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.pressHK.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.pressHere.bind(this)}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Here</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region={this.state.location}
          onRegionChangeComplete={ (region) => {
            AsyncStorage.setItem('yes', JSON.stringify(region))
              .then(() => this.setState({location: region}));
          }}
        />
      </View>
    );
  }
}

export default App;
