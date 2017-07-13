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
  constructor (props) {
    super(props);
    this.state = {
      lat: 0,
      long: 0,
      latD: 0.5,
      longD: 0.25,
    }
  }
  componentDidMount() {
    AsyncStorage.getItem('position')
    .then((region)=> {
      region = JSON.parse(region);
      this.setState({
          lat: region.latitude,
           long: region.longitude,
           latD: region.latitudeDelta,
           longD: region.longitudeDelta
      })
    })

  }
  onRegionChange(region) {
     AsyncStorage.setItem('position', JSON.stringify(region))
    // console.log(this.state);
  }
  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={()=> {
            navigator.geolocation.getCurrentPosition(
              (success)=> {
                this.setState({
                  lat: 41.067841,
                  long: 29.045258
                });
                console.log(this.state);
              },
              (error) => {},
              {}
            )
          }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {
            navigator.geolocation.getCurrentPosition(
              (success)=> {
                this.setState({
                  lat: -33.866174,
                  long: 151.220345
                });
                console.log(this.state);
              },
              (error) => {},
              {}
            )
          }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {
            navigator.geolocation.getCurrentPosition(
              (success)=> {
                this.setState({
                  lat:  22.294074,
                  long: 114.171995
                });
                console.log(this.state);
              },
              (error) => {},
              {}
            )
          }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {
            navigator.geolocation.getCurrentPosition(
              (success)=> {
                this.setState({
                  lat: success.coords.latitude,
                  long: success.coords.longitude
                });
                console.log(this.state);
              },
              (error) => {},
              {}
            )
          }}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Your Location</Text>
          </TouchableOpacity>
      </View>
        <MapView style={{flex: 7}}
            region={{
              latitude: this.state.lat,
              longitude: this.state.long,
              latitudeDelta: this.state.latD,
              longitudeDelta: this.state.longD
            }}
            onRegionChange={this.onRegionChange}
        />
      </View>
    );
  }
}

export default App;
