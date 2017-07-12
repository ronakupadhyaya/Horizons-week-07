import React from 'react';
import {
  AsyncStorage,
  TouchableOpacity,
  // StyleSheet,
  Text,
  View
 } from 'react-native';

import {
  MapView
} from 'expo';

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state={
            region: {
                latitude: 41.067841,
                longitude: 29.045258,
                latitudeDelta: 0.5,
                longitudeDelta: 0.25
            }
        }
    }
    onRegionChange(region) {
      AsyncStorage.setItem('region', region)
      .then((result) => {
        this.setState({ region })});
    }
    componentDidMount() {
      AsyncStorage.getItem('region')
      .then((result) => {
        this.setState({region: result})
      })
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
              justifyContent: 'center'
              }}
              onPress={() => {this.setState({
                  region: {latitude: 41.067841,
              longitude: 29.045258,
              latitudeDelta: 0.5,
              longitudeDelta: 0.25}})}}>
            <Text>Istanbul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {this.setState({
                  region: {latitude: -33.866174,
              longitude: 151.220345,
              latitudeDelta: 0.5,
              longitudeDelta: 0.25}})}}>
            <Text>Sydney</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'}}
              onPress={() => {this.setState({
                  region: {
                      latitude: 22.294074,
                      longitude: 114.171995,
                      latitudeDelta: 0.5,
                      longitudeDelta: 0.25}})}}
            >
            <Text>Hong Kong</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
              }}
              onPress={() => {
                  navigator.geolocation.getCurrentPosition(
                      (success) => {
                          this.setState({
                              region: {
                                  latitude: success.coords.latitude,
                                  longitude: success.coords.longitude}})
                              }
                          )
                      }}>
            <Text>My location</Text>
          </TouchableOpacity>
        </View>
        <MapView style={{flex: 7}}
        region={this.state.region}
        />
      </View>
    );
  }
}

export default App;
