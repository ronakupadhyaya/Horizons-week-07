import React from 'react';
import {
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
      currLong: 0,
      currLat: 0
    }
  }
  render() {
    return (
      <View style={{
          flex: 1
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => {this.setState({
            currLong: 29.045258, currLat: 41.067841
          })}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.setState({
            currLong: 151.2203458, currLat: -33.866174
          })}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.setState({
            currLong: 114.171995, currLat: 22.294074
          })}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigator.geolocation.getCurrentPosition(
            (success) => {this.setState({
                currLat: success.coords.latitude,
                currLong: success.coords.longitude
            })}
          )}}
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}>
            <Text>Current</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
          region = {{
            latitude: this.state.currLat,
            longitude: this.state.currLong,
            latitudeDelta: 0.25,
            longitudeDelta: 0.125
          }}
         />

      </View>
    );
  }
}

export default App;
