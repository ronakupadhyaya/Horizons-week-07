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

  constructor() {
    super();
    this.state = {
      latitude: 41.067841,
      longitude: 29.045258
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('lat')
      .then((resultLat) => {
        this.setState({latitude: Number(resultLat)})
      });
    AsyncStorage.getItem('long')
      .then((resultLong) => {
        this.setState({longitude: Number(resultLong)})
      });
  }

  changeLocation(city) {
    let lat;
    let long;
    if (city === "here") {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        long =  pos.coords.longitude;
        AsyncStorage.setItem('lat', JSON.stringify(lat))
          .then(() => this.setState({latitude: lat}));
        AsyncStorage.setItem('long', JSON.stringify(long))
          .then(() => this.setState({longitude: long}));
      }, (error) => {
        console.log("Error" + error);
      })
    } else {
      if (city === "istanbul") {
        lat = 41.067841;
        long = 29.045258;
      } else if (city === "sydney") {
        lat = -33.866174;
        long = 151.220345;
      } else {
        lat = 22.294074;
        long = 114.171995;
      }
      AsyncStorage.setItem('lat', JSON.stringify(lat))
        .then(() => this.setState({latitude: lat}));
      AsyncStorage.setItem('long', JSON.stringify(long))
        .then(() => this.setState({longitude: long}));
    }
  }

  changingRegion(region) {
    AsyncStorage.setItem('lat', JSON.stringify(region.latitude));
    AsyncStorage.setItem('long', JSON.stringify(region.longitude));
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
          onPress={() => this.changeLocation('istanbul')}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
            onPress={() => this.changeLocation('sydney')}>
              <Text>Sydney</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center'}}
              onPress={() => this.changeLocation('hong kong')}>
                <Text>Hong Kong</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center'}}
                onPress={() => this.changeLocation('here')}>
                  <Text>My Location</Text>
                </TouchableOpacity>
            </View>
            <MapView style={{flex: 7}}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.25
              }}
              onRegionChange={this.changingRegion.bind(this)}
            />
          </View>
        );
      }
    }

    export default App;
