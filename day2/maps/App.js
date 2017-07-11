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
      latitude: 5,
      longitude: 5,
      latitudeDelta: 0.5,
      longitudeDelta: 0.25
    };
  }

  componentDidMount() {

    AsyncStorage.getItem('location')
      .then((result) => {
        console.log("this is async storage location");
        console.log(result); 
        const xyz = JSON.parse(result);
        this.setState({latitude: xyz.latitude,
                       longitude: xyz.longitude});
        });
      }

  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => this.setState({latitude: 41.067841, longitude: 29.045258})}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({latitude: -33.866174, longitude: 151.220345})}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({latitude: 22.294074, longitude: 114.171995})}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigator.geolocation.getCurrentPosition(
              (success) => {
                this.setState({
                  latitude: success.coords.latitude,
                  longitude: success.coords.longitude
                });
              },
              (error) => {
                console.log("error" + error)
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
          onRegionChange={(region) => {
            console.log("this is region change");
            console.log(region);
            AsyncStorage.setItem('location', JSON.stringify(region));
            }
          }

          style={{flex: 7}}
                 region={{
                   latitude: this.state.latitude,
                   longitude: this.state.longitude,
                   latitudeDelta: this.state.latitudeDelta,
                   longitudeDelta: this.state.longitudeDelta
                 }}/>
      </View>
    );
  }
}

export default App;
